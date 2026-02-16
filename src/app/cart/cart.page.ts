import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController, Events } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.page.html',
    styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store_id: '' };
    @Input() PDataAddToCart = { apikey: this.rest.APIKey, user_id: '', store_id: '', action: '', product_id: '', qnty: '', weightid: 0, basketChk: 'false', };
    @Input() PDatacm = { apikey: this.rest.APIKey, user_id: '', store_id: '', combo_id: '', type: '' };
    @Input() PDatarm = { apikey: this.rest.APIKey, user_id: '', product_id: '', weight_id: '', duplicate: '', type: '', basket_id: '', combo_id: '' };

    public item_qty: any;
    public nodeCount: any;
    public create_val = 1;
    public productCount;
    public ServiceData;
    public cart_chks;
    public empties;
    public cart_accesorieschk;
    public CartNotification;


    // -------------------
    public cart_remaining_total = 0;
    public discount_total = 0;


    // --------------------
    public checkout_limit = 0;
    public cart_total = 0;
    public total_cart_item: number = 0;
    public is_api_request: boolean = false;
    public cart_products = [];
    public cart_products_combo = [];
    public imageUrl = this.rest.cdn_upload_url + 'product/';
    public imageUrl_free = this.rest.cdn_upload_url;
    public combo_image = this.rest.cdn_upload_url + 'combo/';
    public currency = this.rest._currency;
    
    constructor(private rest: RestService, private navCtrl: NavController,
        public storage: Storage, public alertController: AlertController,
        public router: ActivatedRoute,
        public events: Events) {
        this.item_qty = 1;
    }

    ngOnInit() {
        
    }

    ionViewWillEnter() {
        this.storage.get('id').then((val) => {
            this.PData.user_id = val;
            this.PDatarm.user_id = val;
            this.PDatacm.user_id = val;
            this.PDataAddToCart.user_id = val;
            if (val != '' && val != null) {
                this.chekBlock();
            }
            else{
                this.is_api_request = true;
            }

            if (this.PData.user_id) {
                this.storage.get('storeID').then((storeID) => {

                    this.PData.store_id = storeID;
                    this.PDatacm.store_id = storeID;
                    this.PDataAddToCart.store_id = storeID;
                    this.GetCartLoad();
                    // this.GetCartNotification();
                    // this.JqueryForThePage();
                    this.get_user_profile();
                });
            }
            else
            {
                this.is_api_request = true;
            }
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

    GetCartLoad() {

        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/Cart/my_cart').subscribe((result) => {
            this.ServiceData = result;
            console.log(this.ServiceData)
            this.is_api_request = true;
            // this.create_val = this.checkout_limit = this.ServiceData.checkout_limit;
            if (result.status == 1) {
                this.cart_total = Number(result.data.cart_subtotal);
                this.discount_total = Number(result.data.total_discount);
                this.checkout_limit = Number(result.data.checkout_limit);
                this.cart_products = result.data.cart_products;
                this.cart_products_combo = result.data.cart_products_combo;
                this.total_cart_item = result.data.total_cart_item;
                this.events.publish('cart_count', this.total_cart_item);
                if (result.data.product_data && result.data.product_data.length > 0) {
                    this.productCount = result.data.product_data.length;
                } else {
                    this.productCount = 0;
                    
                }
                
            }
            else {
                // this.rest.showAlert(result.message);
                this.events.publish('cart_count', 0);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    getCartLoadNoLoader() {

        this.rest.GlobalPHit(this.PData, '/Cart/my_cart').subscribe((result) => {
            this.ServiceData = result;
            this.create_val = this.checkout_limit = result.checkout_limit;
            if (result.status == 1) {
                this.cart_total = Number(result.data.cart_subtotal);
                this.checkout_limit = Number(result.data.checkout_limit);
                this.cart_products = result.data.cart_products;
                this.cart_products_combo = result.data.cart_products_combo;
                this.total_cart_item = result.data.total_cart_item;
                this.events.publish('cart_count', this.total_cart_item);
                if (result.data.product_data && result.data.product_data.length > 0) {
                    this.productCount = result.data.product_data.length;
                } else {
                    this.productCount = 0;
                }
            }
            else {
                this.cart_total = 0;
                this.productCount = 0;
                this.checkout_limit = 0;
                this.total_cart_item = 0;
                this.cart_products = [];
                this.cart_products_combo = [];
                this.rest.showAlert(result.message);
                this.events.publish('cart_count', 0);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    async emptyCartConfirm() {
        const alert = await this.alertController.create({
            header: 'Confirm!',
            message: 'Do you want to empty cart?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Ok',
                    handler: () => {
                        this.emptyCartPost();
                    }
                }
            ]
        });

        await alert.present();
        let result = await alert.onDidDismiss();
        console.log(result);
    }

    emptyCartPost() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/Cart/empty_cart').subscribe((result) => {
            
            if (this.ServiceData.status == 1) {
                this.total_cart_item = 0;
                this.cart_products = [];
                this.cart_products_combo = [];
                // this.events.publish("cart_empty_update", { is_empty:1 });
                this.events.publish("cart_count", 0);
            } else {
                this.rest.showAlert(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    updateQuantity(product_id, variant_id, type, prefix) {

        var quantity = Number($("." + prefix + " .product_quantity_count").text());
        if (type == 'up') {
            quantity += 1;
            $("." + prefix + " .product_quantity_count").text(quantity);
            this.updateQuantityPost(product_id, quantity, "up", prefix, variant_id);
        }
        else if (type == 'down') {

            if ((quantity - 1) < 1) {
                quantity = 0;
                $("." + prefix + " .product_quantity_count").text(quantity);
                this.updateQuantityPost(product_id, quantity, "down", prefix, variant_id);
            }
            else {
                quantity -= 1;
                $("." + prefix + " .product_quantity_count").text(quantity);
                this.updateQuantityPost(product_id, quantity, "down", prefix, variant_id);
            }
        }
    }

    updateQuantityPost(product_id, quantity, action, prefix, variant_id) {
        this.rest.present();
        this.PDataAddToCart.action = action;
        this.PDataAddToCart.qnty = quantity;
        this.PDataAddToCart.product_id = product_id;
        this.PDataAddToCart.weightid = variant_id;
        this.rest.GlobalPHit(this.PDataAddToCart, 'Cart/update').subscribe((result) => {
            if (result.status == 'success') {

                this.events.publish("cart_count", result.totalitems);
                this.rest.presentToast(result.message);
                this.events.publish("cart_product_update", { product_id: this.PDataAddToCart.product_id, variant_id: this.PDataAddToCart.weightid, is_cart: this.PDataAddToCart.qnty });
                this.getCartLoadNoLoader();
            }
            else {
                this.rest.dismiss();
                $("."+prefix+" .product_quantity_count" ).text((quantity-1));
                this.rest.presentToast(result.message);
                 
                // this.rest.showAlert(result.message);
            }

        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    remove_product(product_id, weight_id) {

        this.PDatarm.product_id = product_id;
        this.PDatarm.weight_id = weight_id;
        this.PDatarm.type = 'item';
        this.rest.present();
        this.rest.GlobalPHit(this.PDatarm, '/Cart/remove_item_from_cart').subscribe((result) => {
            if (result.status == 1) {
                this.rest.presentToast(result.message);
                this.getCartLoadNoLoader();
            } else {
                this.rest.dismiss();
                this.rest.showAlert(result.message);
            }
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    updateComboQuantity(combo_id, type) {

        if (type == 'down') {
            this.PDatacm.combo_id = combo_id;
            var combo_qnty = Number($("#countcomb_" + combo_id).first().text());
            if (combo_qnty - 1 < 1) {
                combo_qnty = 0;
                this.updateComboQuantityPost("down");
            }
            else {
                combo_qnty -= 1;
                this.updateComboQuantityPost("down");
            }
        }
        else if (type == 'up') {
            this.PDatacm.combo_id = combo_id;
            var combo_qnty = Number($("#countcomb_" + combo_id).first().text());
            combo_qnty += 1;
            this.updateComboQuantityPost("up");
        }
    }

    updateComboQuantityPost(types) {

        this.PDatacm.type = types;
        if (types == 'up') {
            this.rest.present();
            this.rest.GlobalPHit(this.PDatacm, '/Cart/add_combo').subscribe((result) => {
                if (result.status == 1) {
                    this.rest.presentToast(result.message);
                    this.getCartLoadNoLoader();
                } else {
                    this.rest.dismiss();
                    this.rest.showAlert(result.message);
                }

            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        } else {
            this.rest.present();
            this.rest.GlobalPHit(this.PDatacm, '/Cart/add_combo').subscribe((result) => {
                if (result.status == 1) {
                    this.getCartLoadNoLoader();

                } else {
                    this.rest.dismiss();
                    this.rest.showAlert(result.message);
                }
                this.rest.presentToast(result.message);
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        }
    }

    remove_combo(combo_id) {
        this.PDatacm.combo_id = combo_id;
        this.PDatacm.type = 'combo';
        this.rest.present();
        this.rest.GlobalPHit(this.PDatacm, '/Cart/remove_from_cart').subscribe((result) => {
            if (result.status == 1) {
                this.rest.presentToast(result.message);
                this.getCartLoadNoLoader();
            } else {
                this.rest.dismiss();
                this.rest.showAlert(result.message);
            }

        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    route_product_detail(pid, ProductName) {
        this.navCtrl.navigateForward(['/product-view', { ProductID: pid, ProductName: ProductName }]);
    }

    route_combo_detail(ComboID, ComboName) {
        this.navCtrl.navigateForward(['combo-details', { ComboID: ComboID, ComboName: ComboName }])
    }

    route_checkout(is_rat, ordr_id, is_out) {
        console.log('......................................',is_rat, ordr_id, is_out)
        
        if (is_out == "1") {

            this.removeOutOfStock();
            
        } else {
            if (is_rat == "0" && ordr_id) {
            this.navCtrl.navigateForward(['/rating', { orderID: ordr_id }]);

            } else {
                this.navCtrl.navigateForward('/checkout');
            }
        }

        
    }

    async removeOutOfStock() {
        const alert = await this.alertController.create({
            header: 'Warning!',
            message: 'Remove Out Of Stock Product',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }
            ]
        });

        await alert.present();
        let result = await alert.onDidDismiss();
        console.log(result);
    }

    get_user_profile() {

        this.PData.user_id = this.PData.user_id;
        this.rest.GlobalPHit(this.PData, 'User/my_profile').subscribe((result) => {
            if (result.status == 1) {
                if (result.user_profile.status != 1 || result.user_profile.is_blocked != 1) {
                    this.goto_logout();
                }
            }
        }, (err) => {
            console.log(err);
        });
    }

    goto_logout() {

        this.storage.set('mobile', '');
        this.storage.set('id', '');
        this.storage.set('user_name', '');
        this.storage.set('city', '');
        this.storage.set('country', '');
        this.storage.set('phone', '');
        this.storage.set('email_address', '');
        this.storage.set('address', '');
        this.storage.set('username', "");
        this.storage.set('last_name', "");
        this.storage.set('user_id', "");
        this.storage.set('gender', "");
        this.storage.set('user_all_data', "");
        this.events.publish('ProfileData', "");
        this.events.publish('Profileuser_pic', "");
        this.events.publish('Profileuser_name', "");
        this.navCtrl.navigateRoot('/home');
    }

}
