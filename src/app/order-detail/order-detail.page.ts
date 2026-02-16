import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.page.html',
    styleUrls: ['./order-detail.page.scss'],
})

export class OrderDetailPage implements OnInit {
    
    @Input() PData = { apikey: this.rest.APIKey, product_id: '', user_id: '', order_id: '' };
    @Input() PData_reorder = { apikey: this.rest.APIKey, user_id: '', order_id: '', store_id: '' };
    @Input() PDataCheck = { apikey: this.rest.APIKey, product_id: '', user_id: '', store_id: '', order_id: '' };

    public ServiceData;
    public DiliveryData23;
    public OrderID;
    public total_amount;
    public DiliveryData2;
    public DiliveryData;
    public featureImageUrl = this.rest.cdn_upload_url+'product/';
    public imageUrl = this.rest.cdn_upload_url+'product/';
    public imageUrl_free = this.rest.cdn_base_url;
    public ImageBasketUrl = this.rest.cdn_upload_url+'basket';
    public currency = this.rest._currency;

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
    }

    ngOnInit() {

        this.PData.order_id = this.OrderID;
        this.PDataCheck.order_id = this.OrderID;
        // this.storage.get('user_id').then(val => {
        this.storage.get('id').then(val => {
            this.PData.user_id = val;
            this.PData_reorder.user_id = val;

            this.storage.get('storeID').then((store_id) => {
                this.PData_reorder.store_id = store_id
                
            })

        })
    }

    ionViewWillEnter() {

        this.LoadOrderLists();
    }

    LoadOrderLists() {

        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'My_order/view_order').subscribe((result) => {
            this.ServiceData = result;
            if (result.status == 1) {

                if (result.order_detail.mb_express) {
                    this.total_amount = Number(result.order_detail.total_amount) + Number(result.order_detail.mb_express);
                } else {
                    this.total_amount = Number(result.order_detail.total_amount);
                }
                console.log(result)
            } else {
                this.rest.showAlert(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    GoToOrderRaiseTicket(orderID) {

        this.PDataCheck.order_id = orderID;
        this.rest.GlobalPHit(this.PDataCheck, 'User/my_ticket').subscribe((result) => {
            this.DiliveryData = result;
            if (this.DiliveryData.status == 1) {
                //this.rest.dismiss();
                if (this.DiliveryData['data']['is_ticket_generated'] == 0) {
                    this.navCtrl.navigateForward(['order-raise-ticket', { orderID: orderID }]);
                }
                if (this.DiliveryData['data']['is_ticket_generated'] == 1) {
                    this.navCtrl.navigateForward(['order-raise-ticket', { orderID: orderID }]);
                }
            } else {
                this.rest.showAlert(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    GoToreorder(orderID) {
        this.rest.present();
        this.PData_reorder.order_id = orderID;
            console.log('----------',this.PData_reorder)
        this.rest.GlobalPHit(this.PData_reorder, 'User/re_order').subscribe((result) => {
            console.log('----------',result)
            if (this.DiliveryData2.status == 1) {
                this.navCtrl.navigateForward('/cart');
            } else {
                this.rest.showAlert(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    GoToOrderinvoice(orderID) {
        this.PData_reorder.order_id = orderID;
        this.rest.present();
        this.rest.GlobalPHit(this.PData_reorder, 'Payment/send_order_mail').subscribe((result) => {

            if (result.status == 1) {
                this.rest.showAlert(result.message);

            } else {
                this.rest.showAlert(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.present();
            console.log(err);
        });
    }

    GoToCancelOrder(orderID, order_number) {
        this.navCtrl.navigateForward(['/order-cancel', { orderID: orderID, order_number: order_number }]);
    }

    GoToOrderDetails_resc(orderID, otp) {
        this.navCtrl.navigateForward(['/reschedule', { orderID: orderID, otype: otp }]);
    }

    GoToOrderDetails_rate(orderID) {
        this.navCtrl.navigateForward(['/rating', { orderID: orderID }]);
    }

    
}
