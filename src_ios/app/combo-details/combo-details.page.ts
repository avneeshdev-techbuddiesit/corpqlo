import * as $ from 'jquery';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController, Events } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-combo-details',
    templateUrl: './combo-details.page.html',
    styleUrls: ['./combo-details.page.scss'],
})

export class ComboDetailsPage implements OnInit {

    @Input() PData = { apikey: this.rest.APIKey, combo_id: '', user_id: '', store_id: '' };
    @Input() PData2 = { apikey: this.rest.APIKey, user_id: '', store_id: '' };
    @Input() PDatacm = { apikey: this.rest.APIKey, user_id: '', store_id: '', combo_id: '', type: '' };
    
    public combo_detail;
    public is_api_request:boolean = false;
    public combo_image_url = this.rest.cdn_upload_url+'combo/';
    public image_url = this.rest.cdn_upload_url+'product/thumbnails/100/';

    constructor(
        private rest: RestService, 
        private navCtrl: NavController, 
        public storage: Storage, 
        public alertController: AlertController,
        public events: Events,
        public router: ActivatedRoute
        ) {
        this.PDatacm.combo_id = this.PData.combo_id = this.router.snapshot.paramMap.get('ComboID');
    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.storage.get('id').then((val) => {
            this.PData2.user_id = val;
            this.PData.user_id = val;
            this.PDatacm.user_id = val;
            this.storage.get('storeID').then((storeID) => {
                this.PData2.store_id = storeID;
                this.PData.store_id = storeID;
                this.PDatacm.store_id = storeID;
                if (this.PData.combo_id) {
                    this.GetListing();
                }
            });
        })
    }

    GetListing() {

        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/Combo/combo_view').subscribe((result) => {
            this.is_api_request = true;
            if (result.status == 1) {
                this.combo_detail = result.data;
                
            } else {
                this.rest.showAlert(result.message)
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }
    
    updateComboQuantity(combo_id, type) {
        
        if (type == 'add') {
            this.PDatacm.combo_id = combo_id;
            this.PDatacm.type = type;
            var combo_qnty = 1;
            this.updateComboQuantityPost("add", combo_qnty, combo_id);
        }
        else if (type == 'down') {
            this.PDatacm.combo_id = combo_id;
            this.PDatacm.type = type;
            var combo_qnty = Number($("#combo_count_" + combo_id).first().text());
            if (combo_qnty - 1 < 1) {
                combo_qnty = 0;
                this.updateComboQuantityPost("down", combo_qnty, combo_id);
            }
            else {
                combo_qnty -= 1;
                this.updateComboQuantityPost("down", combo_qnty, combo_id);
            }
        }
        else if (type == 'up') {
            this.PDatacm.combo_id = combo_id;
            this.PDatacm.type = type;
            var combo_qnty = Number($("#combo_count_" + combo_id).first().text());
            combo_qnty += 1;
            this.updateComboQuantityPost("up", combo_qnty, combo_id);
        }
    }

    updateComboQuantityPost(type, combo_qnty, combo_id) {
        
        this.rest.present();
        this.rest.GlobalPHit(this.PDatacm, '/Cart/add_combo').subscribe((result) => {
            if (result.status == 1) {
                this.events.publish('cart_count', result.totalitems);
                this.rest.presentToast(result.message);
                // this.getCartLoadNoLoader();
                if(type == 'add')
                {
                    $(".combo-action-btn.add_btn").hide();
                    $(".combo-action-btn.update_btn").show();
                    $("#combo_count_" + combo_id).first().text(combo_qnty);

                }
                else if(type == 'up')
                {
                    $(".combo-action-btn.add_btn").hide();
                    $(".combo-action-btn.update_btn").show();
                    $("#combo_count_" + combo_id).first().text(combo_qnty);
                }
                else if(type == 'down')
                {
                    if(combo_qnty == 0)
                    {
                        $(".combo-action-btn.add_btn").show();
                        $(".combo-action-btn.update_btn").hide();
                        $("#combo_count_" + combo_id).first().text(0);
                        
                    }
                    else{
                        $(".combo-action-btn.add_btn").hide();
                        $(".combo-action-btn.update_btn").show();
                        $("#combo_count_" + combo_id).first().text(combo_qnty);
                    }
                }
            }
            else {
                
                this.rest.showAlert(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
        
    }

    route_product_view(pid, ProductName) {
        this.storage.set('pid', pid);
        this.navCtrl.navigateForward(['/product-view', { ProductID: pid, ProductName: ProductName }]);
    }

    route_login() {
        this.rest.presentToast('Please login first.');
        this.navCtrl.navigateForward('/sign-in');
    }
}
