import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController, ModalController, Events } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { FilterModalPage } from '../filter-modal/filter-modal.page';
import * as $ from 'jquery';
import { SafeEventService } from '../services/safe-event.service';

@Component({
    selector: 'app-search-detail',
    templateUrl: './search-detail.page.html',
    styleUrls: ['./search-detail.page.scss'],
})
export class SearchDetailPage implements OnInit {

    @Input() PData = { apikey: this.rest.APIKey, search_data: '', store_id: '', search_type: "2", user_id: '', brands: '', offset: '', request_type: '', store_availability: '', price_type: '',category_id:'', page:1 };
    @Input() PDataGetStoreDetail = { apikey: this.rest.APIKey, user_id: '' };
    @Input() PDatavr: any = { apikey: this.rest.APIKey, product_id: '', user_id: '', store_id: '', variant_id: '' };
    @Input() PDataAddToCart = { apikey: this.rest.APIKey, user_id: '', store_id: '', product_id: '', qnty: 0, weightid: 0, action:'' };
    @Input() PData2: any = { apikey: this.rest.APIKey, user_id: '', varient_id: '', store_id: '' };

    public user_id: any;
    public ServiceData;
    public no_load:any = 0;
    public ofsets: any = 1;
    public brand_list = [];
    public brand_list_temp = [];
    public productList = [];
    public image_url = this.rest.cdn_upload_url;
    public totalRecords: any = 0;
    public apply_filter_count: any = 0;
    public is_api_request:boolean = false;
    public is_cart_empty = 0;
    public currency = this.rest._currency;
    public product_placeholder: any = 'assets/image/placeholders/product.jpg';

    @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
    public ErrorMsg;
    constructor(
        private rest: RestService,
        private navCtrl: NavController,
        public storage: Storage,
        public modalCtrl: ModalController,
        public alertController: AlertController,
        public events :Events,
        public router: ActivatedRoute,
        private Event:SafeEventService
    ) {

        this.PData.search_data = this.router.snapshot.paramMap.get('stringquer');
        this.events.subscribe('cart_empty_update', (status) => {
            console.log("cart_empty_update", status);
            this.is_cart_empty = status.is_empty;
            $(' .add_btn').show();
            $(' .update_btn').hide();
            // $(' .add_to_cart_btn_out_stock').hide();

        });
        

        this.events.subscribe('cart_product_update', (data) => {
            // console.log("cart_product_update1", data);
            if (data) {
               
                if(data.is_cart > 0)
                {
                    $(".search_product_"+data.product_id+' .product_quantity_count').text(data.is_cart);
                    $(".search_product_"+data.product_id+' .update_btn').show();
                    $(".search_product_"+data.product_id+' .add_btn').hide();
                }
                else{
                    $(".search_product_"+data.product_id+' .add_btn').show();
                    $(".search_product_"+data.product_id+' .update_btn').hide();
                }
            }
        });
    }

    ngOnInit() {

        this.storage.get('id').then((save_user_id) => {
            this.PDatavr.user_id = save_user_id;
            this.PData.user_id = save_user_id;
            this.PData2.user_id = save_user_id;
            this.PDataAddToCart.user_id = save_user_id;
            this.PDataGetStoreDetail.user_id = save_user_id;
            this.user_id = save_user_id;
            
            this.storage.get('storeID').then((storeID) => {
                this.PData.store_id = storeID;
                this.PDatavr.store_id = storeID;
                this.PData2.store_id = storeID;
                this.PDataAddToCart.store_id = storeID;
                this.getSearchProducts();
            });
        });
    }

    ionViewWillEnter() {

        if (this.is_cart_empty == 1) {
            this.is_api_request = false;
            this.productList = null;
            this.getSearchProducts();
            this.is_cart_empty = 0;
        }
    }

    filter_modal_action() {
        this.no_load = 0;
        this.PData.page = 1;
        this.PData.offset = "";
        this.PData.request_type = "";
        this.brand_list = null;
        this.getSearchProducts();
    }

    getSearchProducts() {

        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'Search_product').subscribe((result) => {
            // this.ServiceData = result;
            // console.log(this.ServiceData);
            this.is_api_request = true;
            if (result.responseCode == 200 && result.responseType == 1) {
                if (result.data.product_list) {
                    this.productList = result.data.product_list;
                    this.brand_list = result.data.brand_list;
                    this.totalRecords = result.data.totalRecords;
                } else {
                    this.productList = [];
                    this.brand_list = [];
                }
                if(result.data.search_records < 20)
                {
                    this.no_load = 1;
                }
            } else {
                this.no_load = 1;
                this.rest.showAlert(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    loadData(event) {
        if (this.no_load == 0) {
            setTimeout(() => {
                console.log('Done');
                this.PData.page+=1;
                this.PData.request_type = 'load_more';
                this.PData.offset = this.ofsets;
                this.rest.GlobalPHit(this.PData, 'Search_product').subscribe((result) => {
                    event.target.complete();
                    if (result.responseCode == 200 && result.responseType == 1) {
                        this.ofsets = Number(this.ofsets) + 1;
                        result.data.product_list.forEach(item => {
                            this.productList.push(item);
                        });
                        if(result.data.totalRecords == 0)
                        {
                            this.no_load = 1;
                        }
                    } else {
                        this.no_load = 1;
                    }
                }, (err) => {
                    console.log(err);
                });
            }, 3000);
        }
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
    
    route_product_view(product_id, product_name) {
        this.navCtrl.navigateForward(['/product-view', { ProductID: product_id, ProductName: product_name }]);

    }

    route_search() {
        this.navCtrl.navigateForward('/search');
    }

    route_cart() {
        //this.storage.set('cart_back',"home");
        this.navCtrl.navigateForward('/cart');
    }
    
    routeLogin()
    {
        this.rest.presentToast('Please Login First');
        this.navCtrl.navigateForward('/sign-in');
    }

    async filter_modal() {
        if(this.brand_list_temp.length > 0)
        {
            mybrand = this.brand_list_temp;
        }
        else{
            var mybrand = this.brand_list;
        }
        const filter_model = await this.modalCtrl.create({
            component: FilterModalPage,
            componentProps: { postable_data: this.PData, brand_list2: mybrand },
            cssClass: 'modalFilterCss'
        });

        filter_model.onDidDismiss().then((filter_response) => {
            this.apply_filter_count = 0;
            console.log("filter data recieve:", filter_response);
            if (filter_response) {
                if (filter_response.data.price_type != 'undefined' && filter_response.data.price_type != undefined && filter_response.data.price_type != null && filter_response.data.price_type != '') {
                    this.PData.price_type = filter_response.data.price_type;
                    this.apply_filter_count += 1;
                }
                else{
                    this.PData.price_type = '';
                }
                if (filter_response.data.store_availability != 'undefined' && filter_response.data.store_availability != undefined && filter_response.data.store_availability != null && filter_response.data.store_availability != '') {
                    this.PData.store_availability = filter_response.data.store_availability;
                    this.apply_filter_count += 1;
                }
                else{
                    this.PData.store_availability = '';
                }
                if (filter_response.data.brands != 'undefined' && filter_response.data.brands != undefined && filter_response.data.brands != null && filter_response.data.brands != '' && filter_response.data.brands.length > 0) {
                    this.PData.brands = filter_response.data.brands;
                    this.apply_filter_count += 1;
                }
                else{
                    this.PData.brands = '';
                }
                if (filter_response.data.brand_list != 'undefined' && filter_response.data.brand_list != undefined && filter_response.data.brand_list != null && filter_response.data.brand_list != '' && filter_response.data.brand_list.length > 0) {
                    this.brand_list_temp = filter_response.data.brand_list;
                }
                else
                {
                    this.brand_list_temp = null;
                }
            }

            this.filter_modal_action();

        });
        return await filter_model.present();
    }

    download_image(event, file_name, upload_url, extra_url) {
        event = this.Event.normalize(event);
        if (event.path[0] && event.path[0].className != 'loaded') {
            this.rest.save_image(upload_url + '/' + extra_url + '/' + file_name, event);

        }
    }

}
