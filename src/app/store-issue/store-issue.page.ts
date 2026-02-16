import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-store-issue',
    templateUrl: './store-issue.page.html',
    styleUrls: ['./store-issue.page.scss'],
})
export class StoreIssuePage implements OnInit {

    public PModel = {};
    @Input() PData = { apikey: this.rest.APIKey, user_id: '' };
    basketName;
    public ServiceData;
    public image_url = this.rest.cdn_upload_url + 'basket/';
    public imageProduct = this.rest.cdn_product_compress_url;

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: ActivatedRoute) {

    }
    ngOnInit() {
        this.storage.get('id').then((val) => {
            this.PData.user_id = val;
            if (val != '' && val != null) {
                this.chekBlock()
            }
            this.GetListing();
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
        this.rest.GlobalPHit(this.PData, '/User/store_ticket').subscribe((result) => {
            this.ServiceData = result;
            console.log(this.ServiceData);
            if (this.ServiceData.status == 1) {
            } else {
                this.ErrorAlert();
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    ionViewWillEnter() {
        if (this.PData.user_id) {
            this.GetListing();
        }
    }

    async ErrorAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

    ViewOrder(ticket_id) {
        this.navCtrl.navigateForward(["/view-ticket", { type: "store", ticket_id: ticket_id }]);
    }

    raiseticket() {
        this.navCtrl.navigateForward("/raise-ticket")
    }

}
