import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-view-ticket',
    templateUrl: './view-ticket.page.html',
    styleUrls: ['./view-ticket.page.scss'],
})
export class ViewTicketPage implements OnInit {

    @Input() PData = { apikey: this.rest.APIKey, user_id: '', ticket_id: '', type: '' };
    public PModel = {};
    public basketName;
    public ServiceData;
    public lngth;
    public image_url = this.rest.cdn_upload_url + 'basket/';
    public imageProduct = this.rest.cdn_product_compress_url;

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: ActivatedRoute) {
        this.PData.ticket_id = this.router.snapshot.paramMap.get('ticket_id');
        this.PData.type = this.router.snapshot.paramMap.get('type');
    }

    ngOnInit() {
        this.storage.get('id').then((val) => {
            this.PData.user_id = val;
            if (val != '' && val != null) {
                this.chekBlock()
            }
            if (this.PData.type == 'order') {

                this.GetListing();
            }
            if (this.PData.type == 'store') {
                this.GetListingStore();
            }

        })
    }

    chekBlock() {
        this.storage.get('id').then((val) => {
            let key = {
                "user_id": val,
                "apikey": this.PData.apikey
            }
            this.rest.userBlock(key).subscribe((result) => { });
        });
    }

    GetListing() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/User/order_issue_view').subscribe((result) => {
            this.ServiceData = result;
            // console.log(this.ServiceData);
            if (this.ServiceData.status == 1) {
                
                setTimeout(function () {
                    navigator['app'].exitApp();
                }, 400000000);
                if (this.ServiceData.data.log) {
                    if (this.ServiceData.data.log.length > 0) {
                        this.lngth = "1";
                    }
                }
            } else {
                this.ErrorAlert();
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    GetListingStore() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/User/store_issue_view').subscribe((result) => {
            this.ServiceData = result;
            // console.log(this.ServiceData);
            if (this.ServiceData.status == 1) {
                
                if (this.ServiceData.data.log) {

                    if (this.ServiceData.data.log.length > 0) {

                        this.lngth = "1";
                    }
                }

            } else {
                this.ErrorAlert();
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    async ErrorAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

    Back() {
        this.navCtrl.navigateForward("/order-issue");
    }

    Back2() {
        this.navCtrl.navigateForward("/store-issue");
    }
}