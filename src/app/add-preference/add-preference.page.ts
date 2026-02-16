import * as $ from 'jquery';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController,Platform } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { SafeEventService } from '../services/safe-event.service';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-add-preference',
    templateUrl: './add-preference.page.html',
    styleUrls: ['./add-preference.page.scss'],
})
export class AddPreferencePage implements OnInit {
    public PModel = {};
    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store_id: '', category_preference: '' };
    basketName;
    public ServiceData;
    public shopCategory;
    public uspref = [];
    public shopcat = [];
    // public image_url = this.rest.cdn_upload_url + 'category/';
    public image_url = this.rest.cdn_upload_url;
    public category_placeholder: any = 'assets/image/placeholders/category.jpg';
    public imageProduct = this.rest.cdn_product_compress_url;
    SelectedArr2 = [];
    SelectedArr3 = [];
    user_id

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public platform: Platform,
        public router: ActivatedRoute,
        private Event: SafeEventService,) {

    }

    ngOnInit() {
        this.storage.get('id').then((val) => {
            this.user_id = val;
            console.log(this.user_id)
            if (val != '' && val != null) {
                this.chekBlock()
            }
        })
    }

    chekBlock() {
        this.storage.get('id').then((val) => {
            let key = {
                "user_id": this.user_id,
                "apikey": this.PData.apikey
            }
            this.rest.userBlock(key).subscribe((result) => { });
        });
    }

    ionViewWillEnter() {
        this.SelectedArr2 = [];
        this.SelectedArr3 = [];
        this.uspref = [];
        $(".category_div").removeClass('added');
        this.storage.get('storeID').then((storeid) => { this.PData.store_id = storeid; });
        this.storage.get('id').then((userid) => {
            this.PData.user_id = userid;
            this.GetListing();
        });

    }

    GetListing() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/User/shopping_preferences').subscribe((result) => {

            this.ServiceData = result;
            this.shopCategory = result.data.shopCategory
            console.log(this.ServiceData.data.shopCategory);
            if (this.ServiceData.status == 1) {
                this.shopcat = this.ServiceData.data.shopCategory;
                this.uspref = this.ServiceData.data.userPreferences;


                this.shopcat.forEach(item => {
                    var z = 0;
                    if (this.uspref.length > 0) {
                        this.uspref.forEach(item2 => {

                            if (item.id == item2.id) {
                                z = 1;
                            }


                        });
                    }


                    if (z == 0) {
                        this.SelectedArr3.push({ 'id': item.id, 'category_banner': item.category_banner, 'name': item.name });
                        console.log(this.SelectedArr3)

                    }

                });
            } else {
                this.ErrorAlert();
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }
    AddedMultiCategoryID(id, i = null) {
        //alert(id);
        var index = this.SelectedArr2.indexOf(id);
        //alert(index);
        if (index > -1) {
            $("#add" + id).removeClass('added');
            this.SelectedArr2.splice(index, 1);
        } else {
            $("#add" + id).addClass('added');
            this.SelectedArr2.push(id);
        }
        console.log("-->" + JSON.stringify(this.SelectedArr2));
    }
    AddPeference() {
        //alert(this.SelectedArr.length);

        if (this.SelectedArr2.length > 0 || this.uspref.length > 0) {
            // alert('0');
            if (this.SelectedArr2.length > 0) {
                //  alert('1');
                if (this.uspref.length > 0) {
                    this.uspref.forEach(item3 => {
                        if (item3) {
                            this.SelectedArr2.push(item3.id);
                        }


                    });
                }

                this.PData.category_preference = this.SelectedArr2.toString();
                this.rest.present();

                this.rest.GlobalPHit(this.PData, '/User/addShoppingPreferences').subscribe((result) => {
                    this.ServiceData = result;
                    // console.log(this.ServiceData);
                    if (this.ServiceData.status == 1) {
                        this.uspref = [];
                        $(".category_div").removeClass('added');
                        this.SelectedArr2 = [];
                        this.navCtrl.navigateForward(['/shopping-preferenes', { SelectedCatID: this.SelectedArr2 }]);
                    } else {
                        this.ErrorAlert();
                    }
                    this.rest.dismiss();
                }, (err) => {
                    this.rest.dismiss();
                    console.log(err);
                });

            } else if (this.uspref.length > 0) {
                // alert("2");
                this.uspref.forEach(item245 => {

                    this.SelectedArr2.push(item245.id);

                });
                this.uspref = [];
                $(".category_div").removeClass('added');
                this.SelectedArr2 = [];
                this.navCtrl.navigateForward(['/shopping-preferenes', { SelectedCatID: this.SelectedArr2 }]);
            }
        } else {

            this.PleaseSelectAlert();
        }
    }

    async ErrorAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

    async PleaseSelectAlert() {
        const alert = await this.alertController.create({
            message: "Select Atleast One Category First !",
            buttons: ['OK']
        });
        await alert.present();
    }

    new_functionfor(id) {

        this.uspref.forEach(item245 => {
            var index = this.SelectedArr2.indexOf(item245.id);
            if (id == item245.id) {

                $("#add" + item245.id).addClass('added');
                this.SelectedArr2.push(item245.id);
            }
        });
    }

    download_image(event, file_name, upload_url, extra_url) {
        event = this.Event.normalize(event);
        if (this.platform.is('ios')) {
            if (event.target && event.target.className != 'loaded') {
                this.rest.save_image(upload_url + '/' + extra_url + '/' + file_name, event);
    
            }
        }
        else{
            if (event.path[0] && event.path[0].className != 'loaded') {
                this.rest.save_image(upload_url + '/' + extra_url + '/' + file_name, event);
    
            }
            
        }
    }

}

