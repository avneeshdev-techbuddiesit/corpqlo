import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.page.html',
    styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
    public ServiceData;
    public no_load: any = 0;

    @Input() PData = { apikey: this.rest.APIKey, offset: '', user_id: '', store_id: '' };
    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router) {

    }

    ngOnInit() {
        this.storage.get('id').then((val) => {
            this.PData.user_id = val;
            if (val != '' && val != null) {
                this.chekBlock()
            }
            this.storage.get('storeID').then((storeID) => {
                this.PData.store_id = storeID;
                this.GetNotificationInApp(event);
            });
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

    ionViewWillLeave() {
        this.GetNotification_ConvertedInToViewed();
    }

    GetNotificationInApp(event) {
        setTimeout(() => {
            this.rest.present();
            this.rest.GlobalPHit(this.PData, 'User/notification_api').subscribe((result) => {
                this.ServiceData = result;
                if (this.ServiceData.status == 1) {
                }
                if (this.ServiceData.status == "0") {
                }
                this.rest.dismiss();
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        }, 200);
    }

    GetNotification_ConvertedInToViewed() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'User/notification_status_api').subscribe((result) => {
            this.ServiceData = result;
            if (this.ServiceData.status == 1) {

            }
            if (this.ServiceData.status == "0") {

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

}
