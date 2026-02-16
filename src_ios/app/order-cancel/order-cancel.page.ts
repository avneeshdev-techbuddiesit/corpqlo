import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-order-cancel',
    templateUrl: './order-cancel.page.html',
    styleUrls: ['./order-cancel.page.scss'],
})
export class OrderCancelPage implements OnInit {

    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store_id: '', order_id: '', reason: '' };

    public ServiceData;
    public ErrorReason;
    public order_number;
    public ShowCancelOrder: boolean = true;
    public ShowThankYouOrder: boolean = false;

    constructor(
        private rest: RestService,
        private navCtrl: NavController,
        public storage: Storage,
        public alertController: AlertController,
        public router: ActivatedRoute
    ) {

    }

    ngOnInit() {

        this.PData.order_id = this.router.snapshot.paramMap.get('orderID');
        this.order_number = this.router.snapshot.paramMap.get('order_number');
        this.storage.get('id').then(save_user_id => {
            this.PData.user_id = save_user_id;
            this.storage.get('storeID').then((store_id) => {
                this.PData.store_id = store_id;
            })
        })
    }

    cancelOrder() {

        if (!this.PData.reason) {
            this.rest.presentToastTop("Please give reason.");
        }
        else {
            this.rest.present();
            this.rest.GlobalPHit(this.PData, 'My_order/cancel_order').subscribe((result) => {
                this.ServiceData = result;
                if (result.status == 1) {
                    this.ShowCancelOrder = false;
                    this.ShowThankYouOrder = true;
                } else {
                    this.rest.showAlert(result.message);
                }
                this.rest.dismiss();
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        }
    }

    continueShopping() {
        this.navCtrl.navigateRoot('/home')
    }
}
