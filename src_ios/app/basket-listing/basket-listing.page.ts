import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-basket-listing',
    templateUrl: './basket-listing.page.html',
    styleUrls: ['./basket-listing.page.scss'],
})
export class BasketListingPage implements OnInit {

    public PModel = {};
    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store_id: '' };
    public ServiceData;
    public CartNotification;
    public image_url = this.rest.cdn_upload_url + 'basket/';

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router) { }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.storage.get('id').then((val) => {
            this.PData.user_id = val;
            if (val != '' && val != null) { this.chekBlock() }
            this.storage.get('storeID').then((storeID) => {
                this.PData.store_id = storeID;
                this.GetListing();
                this.GetCartNotification();
            });
        })
    }

    chekBlock() {
        this.storage.get('id').then((val) => {
            let key = {
                "user_id": this.PData.user_id,
                "apikey": this.PData.apikey
            }
            this.rest.userBlock(key).subscribe((result) => { });
        });
    }

    GetListing() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/User/basket_listing').subscribe((result) => {
            
            this.ServiceData = result;
            // console.log(this.ServiceData);
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

    async ErrorAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

    GetCartNotification() {
        this.rest.GlobalPHit(this.PData, 'Cart/count_cart').subscribe((result) => {
            this.CartNotification = result;
            
        }, (err) => {
            console.log(err);
        });
    }

    GoBasketDetail(basketID, basketName, basket_variant_id) {
        this.navCtrl.navigateForward(['basket-detail-page', { basketID: basketID, basketName: basketName, basket_variant_id: basket_variant_id }])
    }

    route_cart() {
        this.navCtrl.navigateForward('/cart');
    }

    route_search() {
        this.navCtrl.navigateForward('/search');

    }
}
