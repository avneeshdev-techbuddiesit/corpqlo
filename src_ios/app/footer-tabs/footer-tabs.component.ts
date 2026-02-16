import { Component, OnInit } from '@angular/core';
import { Events, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'app-footer-tabs',
    templateUrl: './footer-tabs.component.html',
    styleUrls: ['./footer-tabs.component.scss'],
})
export class FooterTabsComponent implements OnInit {
    cart_count: number = 0;
    user_id_login: any;
    is_login = 'My Account';
    constructor(
        public storage: Storage,
        public rest: RestService,
        public router: Router,
        private navCtrl: NavController,
        public events: Events

    ) {
        console.log("FooterTabsComponent");
        this.events.subscribe('ProfileData', (data) => {
            // alert(data);
            if (data) {
                this.is_login = 'My Account';
                this.get_total_cart_count();
            }
            else {
                this.is_login = 'Login';
            }
        });

        this.events.subscribe('cart_count', (data) => {
            this.cart_count = data;
            this.storage.set('cart_count', data);
        });

        this.events.subscribe('cart_count_update', (data) => {
            this.storage.get('id').then((save_user_id) => {
                if (save_user_id) {
                    this.user_id_login = save_user_id;
                    this.get_total_cart_count2(save_user_id);
                }
                else{
                    this.cart_count = 0;
                    this.storage.set('cart_count', 0);
                }
            });
        });

        this.events.subscribe('cart_empty_update', (status) => {
            this.cart_count = 0;
            this.storage.set('cart_count', 0);
        });
    }

    ngOnInit() {
        console.log('ngOnInit');
        this.storage.get('id').then((save_user_id) => {
            if (save_user_id) {
                this.user_id_login = save_user_id;
                this.is_login = 'My Account';
                // this.get_total_cart_count2(save_user_id);
                this.storage.get('cart_count').then((save_cart_count) => {
                    if (save_cart_count) {
                        this.cart_count = save_cart_count;
                    }
                });

            }
            else {
                this.is_login = 'Login';
            }
        });
    }

    get_total_cart_count(type = "recall") {
        return false;
        if (this.user_id_login && this.user_id_login != '') {
            console.log("get_total_cart_count fired from FooterTabsComponent " + type);
            this.rest.GlobalPHit({ apikey: this.rest.APIKey, user_id: this.user_id_login }, 'Cart/count_cart').subscribe((result) => {
                if (result.status == 1 && result.count) {
                    this.cart_count = result.count;
                    this.storage.set('cart_count', this.cart_count);
                }
                else {
                    this.cart_count = 0;
                }
            }, (err) => {
                console.log("get_total_cart_count", err);
            });
        }
    }

    get_total_cart_count2(saved_user_id) {
        if (saved_user_id && saved_user_id != '') {
            console.log("get_total_cart_count2 fired from FooterTabsComponent ");
            this.rest.GlobalPHit({ apikey: this.rest.APIKey, user_id: saved_user_id }, 'Cart/count_cart').subscribe((result) => {
                if (result.status == 1 && result.count) {
                    this.cart_count = result.count;
                    this.storage.set('cart_count', this.cart_count);
                }
                else {

                    this.cart_count = 0;
                    this.storage.set('cart_count', 0);
                }
            }, (err) => {
                console.log("get_total_cart_count", err);
            });
        }
    }

    route(url) {
        if (url) {
            this.navCtrl.navigateForward(url);
        }
    }

    route_user() {
        this.storage.get('id').then((save_user_id) => {
            if (save_user_id) {
                this.navCtrl.navigateForward('/my-account');
            }
            else {
                this.navCtrl.navigateForward('/sign-in');
            }
        });

    }
}
