import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, Events, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import * as $ from 'jquery';
import { SafeEventService } from '../services/safe-event.service';

@Component({
    selector: 'app-my-wishlist',
    templateUrl: './my-wishlist.page.html',
    styleUrls: ['./my-wishlist.page.scss'],
})
export class MyWishlistPage implements OnInit {

    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store_id: '' };
    @Input() PData2 = { apikey: this.rest.APIKey, user_id: '', varient_id: '', store_id: '' }
    @Input() PDataGetStoreDetail = { apikey: this.rest.APIKey, user_id: '' };
    @Input() PDatavr: any = { apikey: this.rest.APIKey, product_id: '', user_id: '', store_id: '', varient_id: '' };
    @Input() PDataAddToCart = { apikey: this.rest.APIKey, user_id: '', store_id: '', product_id: '', qnty: 0, weightid: 0, action:'' };
    @Input() PWishlistData: any = { apikey: this.rest.APIKey, user_id: '', variant_id: '', store_id: '',product_id:'' };

    public productList: any;
    public is_api_request:boolean = false;
    public is_cart_empty = 0;
    public user_id = 0;
    public image_url = '';
    public product_placeholder: any = 'assets/image/placeholders/product.jpg';

    constructor(
        private rest: RestService,
        private navCtrl: NavController,
        public storage: Storage,
        public alertController: AlertController,
        public router: Router,
        public events: Events,
        private Event:SafeEventService
    ) {
        this.events.subscribe('cart_product_update', (data) => {
            // console.log("cart_product_update1", data);
            if (data) {

                if (data.is_cart > 0) {
                    $(".search_product_" + data.product_id + ' .product_quantity_count').text(data.is_cart);
                    $(".search_product_" + data.product_id + ' .update_btn').show();
                    $(".search_product_" + data.product_id + ' .add_btn').hide();
                }
                else {
                    $(".search_product_" + data.product_id + ' .add_btn').show();
                    $(".search_product_" + data.product_id + ' .update_btn').hide();
                }
            }
        });
    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.image_url = this.rest.cdn_upload_url;
        this.storage.get('id').then((save_user_id) => {
            if (save_user_id) {
                this.PData.user_id = save_user_id;
                this.PData2.user_id = save_user_id;
                this.PDatavr.user_id = save_user_id;
                this.PDataAddToCart.user_id = save_user_id;
                this.PDataGetStoreDetail.user_id = save_user_id;
                this.user_id = save_user_id;
                if (save_user_id != '' && save_user_id != null) {
                    this.chekBlock()
                }
                this.storage.get('storeID').then((storeID) => {
                    this.PData.store_id = storeID;
                    this.PData2.store_id = storeID;
                    this.PDatavr.store_id = storeID;
                    this.PDataAddToCart.store_id = storeID;
                    this.get_whislist_detail();
                });

            } else {
                this.PData.user_id = "";
                this.PData2.user_id = "";
            }
        });
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

    get_whislist_detail() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'Products/my_wishlist').subscribe((result) => {
            console.log(result)
            if (result.status == 1) {
                this.productList = result.data.product_list;
                this.is_api_request = true;
            } else {
                this.productList = [];
                this.rest.showAlert(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    addToCart(product_id, prefix) {

        this.rest.present();
        this.PDataAddToCart.product_id = product_id;
        this.PDataAddToCart.qnty = 1;
        this.PDataAddToCart.action = 'add';
        this.PDataAddToCart.weightid = Number($("." + prefix + " .variant_data").val());
        this.rest.GlobalPHit(this.PDataAddToCart, 'Cart/add').subscribe((result) => {
            if (result.status == 'success') {
                $("." + prefix + " .product_quantity_count").text(1);
                $("." + prefix + " .add_btn").hide();
                $("." + prefix + " .update_btn").show();
                this.rest.presentToast(result.message);
                this.events.publish("cart_count", result.totalitems);
            } else {
                this.rest.showAlert(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    updateQuantity(product_id, type, prefix) {

        var quantity = Number($("." + prefix + " .product_quantity_count").text());
        if (type == 'up') {
            quantity += 1;
            $("." + prefix + " .product_quantity_count").text(quantity);
            this.updateQuantityPost(product_id, quantity, "up", prefix);
        }
        else if (type == 'down') {

            if ((quantity - 1) < 1) {
                quantity = 0;
                $("." + prefix + " .update_btn").hide();
                $("." + prefix + " .add_btn").show();
                $("." + prefix + " .product_quantity_count").text(quantity);
                this.updateQuantityPost(product_id, quantity, "down", prefix);
            }
            else {
                quantity -= 1;
                $("." + prefix + " .product_quantity_count").text(quantity);
                this.updateQuantityPost(product_id, quantity, "down", prefix);
            }
        }
    }

    updateQuantityPost(product_id, quantity, action, prefix) {

        this.rest.present();
        this.PDataAddToCart.action = action;
        this.PDataAddToCart.qnty = quantity;
        this.PDataAddToCart.product_id = product_id;
        this.PDataAddToCart.weightid = Number($("." + prefix + " .variant_data").val());
        this.rest.GlobalPHit(this.PDataAddToCart, 'Cart/update').subscribe((result) => {
            if (result.status == 'success') {
                this.rest.presentToast(result.message);
                this.events.publish("cart_count", result.totalitems);
                // this.events.publish("cart_count_update", 1);
            } else {

                $("." + prefix + " .product_quantity_count").text((quantity - 1));
                this.rest.presentToast(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }
    
    wishlistAction(event, product_id, prefix) {
       
        this.PWishlistData.product_id = product_id;
        this.PWishlistData.variant_id = Number($("."+prefix+" .variant_data").val());;
        if (this.PWishlistData.variant_id) {
            this.rest.present();
            this.rest.GlobalPHit(this.PWishlistData, 'Cart/update_wishlist').subscribe((result) => {
                if (result.status == 1) {
                    if(result.data.action == 'add')
                    {
                        event.target.classList.remove('fa-heart-o');
                        event.target.classList.add('fa-heart');
                    }
                    else{
                        event.target.classList.remove('fa-heart');
                        event.target.classList.add('fa-heart-o');
                    }
                    this.rest.presentToast(result.message);
                    
                } else {
                    this.rest.showAlert(result.message);
                }
                this.rest.dismiss();
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        }
        else{
            alert('no')
        }
    }

    route_product_view(product_id, product_name) {
        this.navCtrl.navigateForward(['/product-view', { ProductID: product_id, ProductName: product_name }]);

    }

    download_image(event, file_name, upload_url, extra_url) {
        event = this.Event.normalize(event);
        if (event.target && event.target.className != 'loaded') {
            this.rest.save_image(upload_url + '/' + extra_url + '/' + file_name, event);
            console.log(this.rest.save_image(upload_url + '/' + extra_url + '/' + file_name, event))

        }
    }
    
    routeLogin()
    {
        this.rest.presentToast('Please Login First');
        this.navCtrl.navigateForward('/sign-in');
    }

    
}
