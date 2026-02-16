import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
    selector: 'app-refer-freind',
    templateUrl: './refer-freind.page.html',
    styleUrls: ['./refer-freind.page.scss'],
})
export class ReferFreindPage implements OnInit {

    @Input() PData = { apikey: this.rest.APIKey, user_id: '' };
    public PModel = {};
    public ServiceData;
    public image_url = this.rest.cdn_upload_url + 'basket/';
    public imageProduct = this.rest.cdn_product_compress_url;

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: ActivatedRoute, private socialSharing: SocialSharing) {
    }

    ngOnInit() {
        this.storage.get('id').then((ival) => {
            this.PData.user_id = ival;
            
            this.GetReferalCode();
        });
    }

    GetReferalCode() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/User/refer_friend').subscribe((result) => {
            this.ServiceData = result;
            // console.log(this.ServiceData);

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

    Go() {
        let url35324 = this.ServiceData.data.refer;
        let url = "https://play.google.com/store/apps/details?id=com.freshngreen.online";
        let image = "assets/image/refer/refer.png";
        this.socialSharing.share("FreshnGreen App : Referral Code -" + url35324, null, url).then(() => {
            // Success
        }).catch((e) => {
            this.rest.showAlert("Something went wrong.");
        });
    }

}
