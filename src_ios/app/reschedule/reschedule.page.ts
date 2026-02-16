import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-reschedule',
    templateUrl: './reschedule.page.html',
    styleUrls: ['./reschedule.page.scss'],
})
export class ReschedulePage implements OnInit {

    @Input() PDataReschedule = { apikey: this.rest.APIKey, user_id: '', order_type:'', order_id: '', store_id: '', timeslot_time:'', pickup_timeslot:'' };
    
    public order_type;
    public OrderID;
    public timeslots;
    public pickup_timeslot_date;
    public reschedule_data;
    public is_api_request: boolean = false;

    constructor(
        private rest: RestService, 
        private navCtrl: NavController, 
        public storage: Storage, 
        public alertController: AlertController,
        public router: ActivatedRoute, 
        public router2: Router, 
        public platform: Platform
        ) {

            this.OrderID = this.router.snapshot.paramMap.get('orderID');
            this.order_type = this.router.snapshot.paramMap.get('otype');
            this.PDataReschedule.order_id = this.OrderID;
            this.PDataReschedule.order_type = this.order_type;

    }

    ngOnInit() {

    }

    ionViewWillEnter() {

        this.storage.get('id').then((save_user_id) => {
            
            if (save_user_id) {
                this.PDataReschedule.user_id = save_user_id;
                this.storage.get('storeID').then((storeid) => {
                    this.PDataReschedule.store_id = storeid;
                    if (this.order_type == 1) {
                        this.get_timeslot();
                    }
                    if (this.order_type == 2) {
                        this.get_timeslot();
                    }
                })
            }
        })
    }

    get_timeslot() {

        this.rest.present();
        
        this.rest.GlobalPHit(this.PDataReschedule, 'My_order/get_data_reschedule_data').subscribe((result) => {
            this.reschedule_data = result;
            this.is_api_request = true;
            if (result.status == 1) {

                if (result.data.order_detail.order_type == 1) {

                    this.timeslots = result.data.timeslots.pickup_timeslots;
                    this.pickup_timeslot_date = result.data.timeslots.pickup_timeslot_date;
                }
                if (result.data.order_detail.order_type == 2) {

                    this.timeslots = result.data.timeslots;
                }
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    go_to_submit() {
        this.rest.present();
        this.rest.GlobalPHit(this.PDataReschedule, 'My_order/reschedule').subscribe((result) => {
            if (result.status == 1) {
                this.rest.presentToast(result.message);
                this.navCtrl.navigateForward(['/order-detail', { orderID: this.OrderID }]);
            } else {
                this.rest.presentToast(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }
}
