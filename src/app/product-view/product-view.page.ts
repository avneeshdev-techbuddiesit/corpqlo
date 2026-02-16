import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, Events, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-product-view',
    templateUrl: './product-view.page.html',
    styleUrls: ['./product-view.page.scss'],
})
export class ProductViewPage implements OnInit {

    @Input() PData: any = { apikey: this.rest.APIKey, product_id: '', user_id: '', store_id: '', varient_id: '' };
    @Input() PDataAddToCart: any = { apikey: this.rest.APIKey, user_id: '', store_id: '', pid: '', qnty: '', weightid: '', basketChk: 'false', };
    @Input() PDatavr: any = { apikey: this.rest.APIKey, product_id: '', user_id: '', store_id: '', varient_id: '' };
    @Input() PWishlistData: any = { apikey: this.rest.APIKey, user_id: '', variant_id: '', store_id: '',product_id:'' };

    public sliderOne: any;
    public item_qty: any;
    public item_qty2: any;
    public heart: any;
    public ServiceData;
    public image_url;
    public ProductName;
    public ProductID;
    public product_detail:any = [];
    public user_id = 0;
    public product_placeholder: any = 'assets/image/placeholders/product.jpg';
    public heartColor = 0;
    
    slideOptsOne = {
        initialSlide: 0,
        slidesPerView: 1,
        autoplay: true
    };

    constructor(
        public rest: RestService, 
        private navCtrl: NavController, 
        public storage: Storage, 
        public alertController: AlertController,
        public router: ActivatedRoute,
        public events: Events
        ) {
        this.image_url = this.rest.cdn_upload_url;
        this.ProductName = this.router.snapshot.paramMap.get('ProductName');
        this.ProductID = this.PData.product_id = this.router.snapshot.paramMap.get('ProductID');

        this.events.subscribe('cart_product_update', (data) => {
            // console.log("cart_product_update1", data);
            if (data) {
                // console.log("cart_product_update2", data);
                // console.log("1 featured_product", this.featured_product);
               
                if(data.is_cart > 0)
                {
                    $(".product_detail_"+data.product_id+' .product_quantity_count').text(data.is_cart);
                    $(".product_detail_"+data.product_id+' .update_btn').show();
                    $(".product_detail_"+data.product_id+' .add_btn').hide();
                }
                else{
                    $(".product_detail_"+data.product_id+' .add_btn').show();
                    $(".product_detail_"+data.product_id+' .update_btn').hide();
                }
            }
        });
    }

    ngOnInit() {
         
    }

    ionViewWillEnter() {
        this.item_qty = 0;
        this.storage.get('storeID').then((storeid) => {
            this.PData.store_id = storeid;
            this.PWishlistData.store_id = storeid;
            this.PDatavr.store_id = storeid;
            this.PDataAddToCart.store_id = storeid;

            this.storage.get('id').then((save_user_id) => {
                this.PData.user_id = save_user_id;
                this.PWishlistData.user_id = save_user_id;
                this.PDatavr.user_id = save_user_id;
                this.PDataAddToCart.user_id = save_user_id;
                this.user_id = save_user_id;
                this.get_product_detail();
                // this.GetCartNotification();
            })
        });
    }

get_product_detail() {
  this.rest.present();

  this.rest.GlobalPHit(this.PData, 'Products/product_detail')
    .subscribe(
      (result: any) => {
        this.rest.dismiss();
        this.ServiceData = result;

        console.log('-----------------------------', result);

        if (
          result?.status === 1 &&
          result?.data?.products &&
          result.data.products.length > 0
        ) {
          this.product_detail = result.data.products[0];

          // wishlist flag (safe)
          this.heartColor = this.product_detail.is_in_wishlist === 1 ? 1 : 0;

          this.wishlistColor();
        } else {
          this.product_detail = null;
          this.rest.showAlert(result?.message || 'Product not found');
        }
      },
      (err) => {
        this.rest.dismiss();
        console.log(err);
      }
    );
}


    //Move to Next slide
    slideNext(object, slideView) {
        slideView.slideNext(500).then(() => {
            this.checkIfNavDisabled(object, slideView);
        });
    }

    //Move to previous slide
    slidePrev(object, slideView) {
        slideView.slidePrev(500).then(() => {
            this.checkIfNavDisabled(object, slideView);
        });;
    }

    //Method called when slide is changed by drag or navigation
    SlideDidChange(object, slideView) {
        this.checkIfNavDisabled(object, slideView);
    }

    //Call methods to check if slide is first or last to enable disbale navigation  
    checkIfNavDisabled(object, slideView) {
        //this.checkisBeginning(object, slideView);
        //this.checkisEnd(object, slideView);
    }

    load_variant(product_id, index, _event, prefix) {

        this.rest.present();
        var variant_id = $("."+prefix+" .variant_data").val();
        this.PDatavr.variant_id = variant_id;
        this.PDatavr.product_id = product_id;
        this.rest.GlobalPHit(this.PDatavr, 'Products/get_product_variant').subscribe((result) => {
            // this.ServiceData = result;
            this.rest.dismiss();
            if (result.status == 1) {

                // -------------------------------------------------
                if (result.data.wishlist == 1) {
                    this.heartColor = 1;
                } else {
                    this.heartColor = 0;
                }
                this.wishlistColor();
                // -------------------------------------------------

                $("."+prefix+" .product-price-container .product-price").html('<i class="fa fa-inr"></i>'+result.data.final_price);

                if (result.data.product_price != result.data.final_price) {
                    $("."+prefix+" .product-price-container"+' .cut-price').html('<i class="fa fa-inr"></i>'+result.data.product_price);
                    $("."+prefix+" .product-price-container"+' .cut-price').show();
                }
                else {
                    $("."+prefix+" .product-price-container"+' .cut-price').text('');
                    $("."+prefix+" .product-price-container"+' .cut-price').hide();
                }

                if (result.data.offers_data.offers_type) {
                    if (result.data.offers_data.offers_type == 'discount') {
                        if (result.data.offers_data.discount_type == 'percentage') {
                            
                            $("."+prefix+" .offer-container").html('<p class="__offer per-discount">' + result.data.offers_data.discount + " %</p>");
                        }
                        else if (result.data.offers_data.discount_type == 'flat') {
                            $("."+prefix+" .offer-container").html('<p class="__offer flat-discount">' + result.data.offers_data.discount + " Flat</p>");
                        }
                    }
                    else if (result.data.offers_data.offers_type == 'special_price') {
                        $("."+prefix+" .offer-container").html('<p class="__offer special-price">Special Price</p>');
                    }
                    else if (result.data.offers_data.offers_type == 'offer') {
                        $("."+prefix+" .offer-container").html('<p class="__offer bogo">OFFER</p>');
                    }
                    else {
                        $("."+prefix+" .offer-container").html("");
                    }
                }
                else {
                    $("."+prefix+" .offer-container").html("");
                }

                if (result.data.in_cart_quantity > 0 && this.user_id) {
                    if (result.data.is_stock == 1) {
                        $("." + prefix + " .prod-quantity-container .update_btn .product_quantity_count").text(result.data.in_cart_quantity);
                        $("." + prefix + " .prod-quantity-container .update_btn").show();
                        $("." + prefix + " .prod-quantity-container .add_btn").hide();
                        $("." + prefix + " .prod-quantity-container .add_to_cart_btn_login").hide();
                        $("." + prefix + " .prod-quantity-container .add_to_cart_btn_out_stock").hide();
                    }
                    else {
                        $("." + prefix + " .prod-quantity-container .add_btn").hide();
                        $("." + prefix + " .prod-quantity-container .update_btn").hide();
                        $("." + prefix + " .prod-quantity-container .add_to_cart_btn_login").hide();
                        $("." + prefix + " .prod-quantity-container .add_to_cart_btn_out_stock").show();
                    }
                }
                else {
                    if (result.data.is_stock == 1) {
                        if (this.user_id) {
                            $("." + prefix + " .prod-quantity-container .add_to_cart_btn_login").hide();
                            $("." + prefix + " .prod-quantity-container .add_btn").show();
                        }
                        else {
                            $("." + prefix + " .prod-quantity-container .add_to_cart_btn_login").show();
                            $("." + prefix + " .prod-quantity-container .add_btn").hide();
                        }
                        // $("." + prefix + " .prod-quantity-container .add_btn").show();
                        $("." + prefix + " .prod-quantity-container .update_btn").hide();
                        // $("." + prefix + " .prod-quantity-container .add_to_cart_btn_login").hide();
                        $("." + prefix + " .prod-quantity-container .add_to_cart_btn_out_stock").hide();
                    }
                    else {
                        $("." + prefix + " .prod-quantity-container .add_btn").hide();
                        $("." + prefix + " .prod-quantity-container .update_btn").hide();
                        $("." + prefix + " .prod-quantity-container .add_to_cart_btn_login").hide();
                        $("." + prefix + " .prod-quantity-container .add_to_cart_btn_out_stock").show();
                    }
                }

            } else {
                this.rest.showAlert(result.message);
                this.rest.dismiss();
            }
        }, (err) => {
            console.log(err);
        });
    }

    addToCart(product_id, prefix) {
        
        this.rest.present();
        this.PDataAddToCart.product_id = product_id;
        this.PDataAddToCart.qnty = 1;
        this.PDataAddToCart.action = 'add';
        this.PDataAddToCart.weightid = Number($("."+prefix+" .variant_data").val());
        this.rest.GlobalPHit(this.PDataAddToCart, 'Cart/add').subscribe((result) => {
            if (result.status == 'success') {
                $("."+prefix+" .product_quantity_count").text(1);
                $("."+prefix+" .add_btn").hide();
                $("."+prefix+" .update_btn").show();
                this.rest.presentToast(result.message);
                this.events.publish("cart_count", result.totalitems);
                this.events.publish("cart_product_update", { product_id: this.PDataAddToCart.product_id, variant_id: this.PDataAddToCart.weightid, is_cart: this.PDataAddToCart.qnty });
            } else {
                if(result.status == 'noUserAddress')
                {
                    this.rest.showRouteAlert(result.message, 'my-address');
                }
                else if(result.status == 'noOrderPrefer')
                {
                    this.rest.showRouteAlert(result.message, 'select-ordertype');
                    
                }
                else if(result.status == 'exist' && result.quantity && result.quantity > 0)
                {
                    $("."+prefix+" .update_btn .product_quantity_count").text(result.quantity);
                    $("."+prefix+" .add_btn").hide();
                    $("."+prefix+" .update_btn").show();
                    this.rest.presentToast(result.message);
                }
                else{

                    this.rest.showAlert(result.message);
                }
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    updateQuantity(product_id, type, prefix) {
        
        var quantity = Number($("."+prefix+" .product_quantity_count").text());
        if(type == 'up')
        {
            quantity += 1;
            $("."+prefix+" .product_quantity_count").text(quantity);
            this.updateQuantityPost( product_id, quantity, "up",prefix);
        }
        else if(type == 'down'){
            
            if ((quantity - 1) < 1) {
                quantity = 0;
                $("."+prefix+" .update_btn").hide();
                $("."+prefix+" .add_btn").show();
                $("."+prefix+" .product_quantity_count").text(quantity);
                this.updateQuantityPost(product_id, quantity, "down",prefix);
            }
            else {
                quantity -= 1;
                $("."+prefix+" .product_quantity_count").text(quantity);
                this.updateQuantityPost(product_id, quantity, "down",prefix);
            }
        }
    }

    updateQuantityPost(product_id, quantity, action,prefix) {

        this.rest.present();
        this.PDataAddToCart.action = action;
        this.PDataAddToCart.qnty = quantity;
        this.PDataAddToCart.product_id = product_id;
        this.PDataAddToCart.weightid = Number($("."+prefix+" .variant_data").val());
        this.rest.GlobalPHit(this.PDataAddToCart, 'Cart/update').subscribe((result) => {
            if (result.status == 'success') {
                this.rest.presentToast(result.message);
                this.events.publish("cart_count", result.totalitems);
                // this.events.publish("cart_count_update", 1);
                this.events.publish("cart_product_update", { product_id: this.PDataAddToCart.product_id, variant_id: this.PDataAddToCart.weightid, is_cart: this.PDataAddToCart.qnty });
            } else {
                
                $("."+prefix+" .product_quantity_count").text((quantity-1));
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
        this.PWishlistData.variant_id = Number($("." + prefix + " .variant_data").val());
        console.log('variant id',this.PWishlistData.variant_id)
        if (this.PWishlistData.variant_id) {
            console.log('variant id pass to wishlist list', this.PWishlistData.variant_id)
            this.rest.present();
            this.rest.GlobalPHit(this.PWishlistData, 'Cart/update_wishlist').subscribe((result) => {
                if (result.status == 1) {
                    if(result.data.action == 'add')
                    {
                        // event.target.classList.remove('fa-heart-o');
                        // event.target.classList.add('fa-heart');
                        this.heartColor = 1;
                        this.wishlistColor()
                    }
                    else{
                        // event.target.classList.remove('fa-heart');
                        // event.target.classList.add('fa-heart-o');
                        this.heartColor = 0;
                        this.wishlistColor()
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
    
    routeLogin()
    {
        this.rest.presentToast('Please Login First');
        this.navCtrl.navigateForward('/sign-in');
    }

    wishlistColor() {
        if (this.heartColor != 0) {
            console.log('add')
        } else {
            console.log('remove')
        }
    }

}
