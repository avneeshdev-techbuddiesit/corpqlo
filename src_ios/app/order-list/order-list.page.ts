import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.page.html',
    styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {

    @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

    @Input() PData = { apikey: this.rest.APIKey, product_id: '', user_id: '', store_id: '', offset: '', order_view_type: 0 };
    @Input() PData_reorder = { apikey: this.rest.APIKey, user_id: '', order_id: '', order_view_type: 0 };
    @Input() PDataCheck = { apikey: this.rest.APIKey, product_id: '', user_id: '', store_id: '', order_id: '', order_view_type: 0 };
    
    public ServiceData;
    public DiliveryData;
    public DiliveryData2;
    public DiliveryData23;
    public ofsets: any = 1;
    public order_view_type: any = 0;
    public order_list = [];
    public currency = this.rest._currency;
    
    constructor(
        private rest: RestService, 
        private navCtrl: NavController, 
        public storage: Storage, 
        public alertController: AlertController,
        public router: Router, 
        public platform: Platform
        ) {

        platform.ready().then(() => {
            this.platform.backButton.subscribe(() => {
                //  alert(this.router.url);
                if (this.router.url == "/order-list") {
                    // this.route_back();  
                    this.navCtrl.navigateForward('/home');
                }
            })
        });
    }

    ngOnInit() {
        
    }

    ionViewWillEnter() {
        this.ofsets = 1;
        this.storage.get('id').then(save_user_id => {
            this.PData.user_id = save_user_id;
            this.PDataCheck.user_id = save_user_id;
            this.PData_reorder.user_id = save_user_id;
            if (save_user_id != '' && save_user_id != null) {
                this.chekBlock(save_user_id);
            }
            this.storage.get('storeID').then((store_id) => {
                this.PData.store_id = store_id;
                this.PDataCheck.store_id = store_id
                this.LoadOrderLists();
            })
        })
    }

    chekBlock(save_user_id) {
        let key = {
            "user_id": save_user_id,
            "apikey": this.PData.apikey
        }
        this.rest.userBlock(key).subscribe((result) => { });
    }

    loadData(event) {

        setTimeout(() => {
            console.log('Done');
            this.PData.offset = this.ofsets;
            this.rest.GlobalPHit(this.PData, 'My_order').subscribe((result34) => {
                event.target.complete();
                if (result34.status == 1) {
                    this.ofsets = Number(this.ofsets) + 1;
                    result34.data.forEach(item => {
                        this.order_list.push(item);
                    });
                }

                this.rest.dismiss();
            }, (err) => {

                this.rest.dismiss();
                console.log(err);
            });

        }, 3000);
    }

    LoadOrderLists() {
        
        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'My_order').subscribe((result) => {
            if (result.status == 1) {
                this.order_list = result.data;
            } else {
                this.rest.showAlert(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    router_order_detail(orderID) {
        this.navCtrl.navigateForward(['/order-detail', { orderID: orderID, order_view_type: this.order_view_type }]);
    }

}
