import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController, Events, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { IonInfiniteScroll, IonContent } from '@ionic/angular';
import { FilterModalPage } from '../filter-modal/filter-modal.page';
import * as $ from 'jquery';

@Component({
    selector: 'app-mb-express',
    templateUrl: './mb-express.page.html',
    styleUrls: ['./mb-express.page.scss'],
})
export class MbExpressPage implements OnInit {

    @Input() PData = { apikey: this.rest.APIKey, category_id: '', user_id: '', store_id: '', offset: '' ,price_type:'',store_availability:'',brands:'',request_type:''};
    @Input() PData2: any = { apikey: this.rest.APIKey, user_id: '', varient_id: '', store_id: '' };
    @Input() load_variant_data: any = { apikey: this.rest.APIKey, product_id: '', user_id: '', store_id: '', varient_id: '' };
    @Input() addtocart_data: any = { apikey: this.rest.APIKey, user_id: '', store_id: '', pid: '', qnty: '', weightid: '', basketChk: 'false', };
    @Input() PDataGetStoreDetail = { apikey: this.rest.APIKey, user_id: '' };
    @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
    @ViewChild('IonContent', { static: false }) content: IonContent;
    
    
    public user_id;
    public no_load;
    public ServiceData;
    public subcategory_id;
    public product_id;
    public variant_id;
    public is_cart;
    public totalRecords;
    public express_category;
    public subcat_name;
    public local_offset: number = 20;
    public is_api_request: boolean = false;
    public is_filter: boolean = true;
    public ofsets: any = 1;
    public is_cart_empty = 0;
    public apply_filter_count = 0;
    public mb_product = [];
    public brand_list = [];
    public product_data:any = [];
    public product_data_price_asc:any = [];
    public image_url =  this.rest.cdn_upload_url;
    public product_placeholder: any = 'assets/image/placeholders/product.jpg';
    public no_product_placeholder: any = 'assets/image/placeholders/product.jpg';
    
    constructor(
        private rest: RestService,
        private navCtrl: NavController,
        public storage: Storage,
        public alertController: AlertController,
        public events: Events,
        private modalCtrl: ModalController,
        public router: ActivatedRoute
    ) {
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

        this.storage.get('storeID').then((storeid) => {
            this.PData.store_id = storeid;
            this.load_variant_data.store_id = storeid
            this.addtocart_data.store_id = storeid
            this.PData2.store_id = storeid
        });

        this.storage.get('id').then((val) => {
            this.PData2.user_id = val;
            this.PData.user_id = val;
            this.load_variant_data.user_id = val;
            this.addtocart_data.user_id = val;
            this.PDataGetStoreDetail.user_id = val;
            this.get_express_products(this.PData.category_id);
        });
        this.ofsets = 1;
    }

    ionViewWillEnter() {
        if (this.is_cart_empty == 1) {
            this.is_api_request = false;
            this.is_cart_empty = 0;
            this.get_express_products(this.PData.category_id);
        }
    }

    get_express_products(category_id = null) {

        this.ofsets = "";
        this.PData.offset = this.ofsets;
        this.rest.present();
        this.mb_product = [];
        this.express_category = [];
        this.rest.GlobalPHit(this.PData, 'Products/express_product').subscribe((result) => {
            if (result.status == 1) {
                this.express_category = result.data.all_subcategory;
                this.subcategory_id = result.data.subcategory_id;
                this.subcat_name = result.data.subcategory_name;
                if (result.data.product_data) {
                    
                    this.totalRecords = result.data.product_data.length;
                    this.product_data = result.data.product_data;
                    var product_list2 = JSON.parse(JSON.stringify(result.data.product_data));

                    this.product_data.forEach((item, index) => {
                        if (index < 20) {
                            this.mb_product.push(item);
                        }
                    });
                    this.product_data_price_asc = this.sortByPriceAsc(product_list2);
                } else {
                    this.mb_product = [];
                }
                
            } else {
                this.rest.showAlert(result.message);
            }
            this.ofsets = 1;
            this.is_api_request = true;
            this.is_filter = true;
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    get_express_productsWithoutLoader(category_id = null) {
        this.ofsets = "";
        this.is_api_request = false;
        this.mb_product = [];
        this.PData.offset = this.ofsets;
        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'Products/express_product').subscribe((result) => {
            if (result.status == 1) {
                
                this.express_category = result.data.all_subcategory;
                if (result.data.product_data) {
                    
                    this.totalRecords = result.data.product_data.length;
                    this.product_data = result.data.product_data;
                    var product_list2 = JSON.parse(JSON.stringify(result.data.product_data));

                    this.product_data.forEach((item, index) => {
                        if (index < 20) {
                            this.mb_product.push(item);
                        }
                    });
                    this.product_data_price_asc = this.sortByPriceAsc(product_list2);
                } else {
                    this.mb_product = [];
                }
            } else {
                this.rest.showAlert(result.message);
            }
            this.ofsets = 1;
            this.is_api_request = true;
            this.is_filter = true;
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    load_category() {
        this.PData.category_id = '0';
        this.scrollUp2();
        this.get_express_products(0);
    }

    load_subcategory(subcategory_id, name) {
        this.subcat_name = name;
        this.subcategory_id = subcategory_id;
        this.local_offset = 20;
        this.PData.category_id = subcategory_id;
        this.scrollUp2();
        this.get_express_productsWithoutLoader(subcategory_id);
    }

    load_variant(product_id, index, _event, prefix) {

        this.rest.present();
        var variant_id = $("."+prefix+" .variant_data").val();
        this.load_variant_data.variant_id = variant_id;
        this.load_variant_data.product_id = product_id;
        this.rest.GlobalPHit(this.load_variant_data, 'Products/get_product_variant').subscribe((result) => {
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

                if (result.data.in_cart_quantity > 0) {
                    if (result.data.is_stock == 1) {
                        $("."+prefix+" .prod-quantity-container .update_btn .product_quantity_count").text(result.data.in_cart_quantity);
                        $("."+prefix+" .prod-quantity-container .update_btn").show();
                        $("."+prefix+" .prod-quantity-container .add_btn").hide();
                        $("."+prefix+" .prod-quantity-container .add_to_cart_btn_out_stock").hide();
                    }
                    else{
                        $("."+prefix+" .prod-quantity-container .add_btn").hide();
                        $("."+prefix+" .prod-quantity-container .update_btn").hide();
                        $("."+prefix+" .prod-quantity-container .add_to_cart_btn_out_stock").show();
                    }
                }
                else
                {
                    if (result.data.is_stock == 1) {
                        $("."+prefix+" .prod-quantity-container .add_btn").show();
                        $("."+prefix+" .prod-quantity-container .update_btn").hide();
                        $("."+prefix+" .prod-quantity-container .add_to_cart_btn_out_stock").hide();
                    }
                    else{
                        $("."+prefix+" .prod-quantity-container .add_btn").hide();
                        $("."+prefix+" .prod-quantity-container .update_btn").hide();
                        $("."+prefix+" .prod-quantity-container .add_to_cart_btn_out_stock").show();
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

    sortByPriceAsc(myarr = null) {
        // var myarr = myarr2;
        var new_list = [];
        // console.log("sortByPriceAsc", myarr);
        if (myarr) {
            // manually sort array from smallest to largest:
            // loop through array backwards:
            for (let i = myarr.length - 1; i >= 0; i--) {

                // loop again through the array, moving backwards:
                for (let j = i; j >= 0; j--) {
                    if (parseFloat(myarr[i].product_price) < parseFloat(myarr[j].product_price)) {
                        var temp = myarr[i];
                        // console.log("temp", temp);
                        myarr[i] = myarr[j];
                        myarr[j] = temp;
                    }
                };
            };
            // console.log("sortByPriceAsc2", myarr);
        }
        // this.product_data_price_asc = myarr;
        return myarr;
    }

    async local_filter(is_filter = false) {

        if (this.is_filter == false) {
            return false;
        }

        this.is_api_request = true;
        var offset = this.local_offset;
        var per_page = 20;
        var new_product_arr = [];
        var product_data = this.product_data;
        var product_data_price_asc = this.product_data_price_asc;
        // console.log("local_filter product_data", product_data);
        // console.log("local_filter product_data_price_asc", product_data_price_asc);
        if (is_filter == true) {
            offset = 0;
        }
        console.log("is_api_request", this.is_api_request);
        if (product_data != null && product_data_price_asc != null) {
            console.log("offset", offset);
            // console.log("this.PData.price_type", this.PData.price_type);
            if (this.PData.price_type != '') {

                product_data = product_data_price_asc;
                // console.log("product_data price_type", product_data);
                if (this.PData.price_type == 'highlow') {
                    var new_product_arr1 = [];
                    product_data.forEach(item => {
                        new_product_arr1.unshift(item);
                    });
                    product_data = new_product_arr1;
                }
            }

            if (this.PData.store_availability != '') {

                if (this.PData.store_availability == 'yes') {
                    var new_product_arr2 = [];
                    product_data.forEach((item, index) => {
                        if (item.is_stock != 'undefined' && item.is_stock != null && item.is_stock == 1) {
                            new_product_arr2.push(item);
                        }
                    });
                    product_data = new_product_arr2;
                    // console.log("store_availability  products list:", product_data);
                }
                else if (this.PData.store_availability == 'no') {
                    var new_product_arr2 = [];
                    product_data.forEach((item, index) => {
                        if (item.is_stock != 'undefined' && item.is_stock != null && item.is_stock == 0) {
                            new_product_arr2.push(item);
                        }
                    });
                    product_data = new_product_arr2;
                    // console.log("store_availability  products list:", product_data);
                }
            }

            if (typeof this.PData.brands != "undefined" && this.PData.brands != null && this.PData.brands.length != null && this.PData.brands.length > 0) {

                // console.log("this.PData.brands", this.PData.brands);
                var new_product_arr3 = [];
                product_data.forEach((item, index) => {
                    if (item.brand_name != 'undefined' && item.brand_name != null && this.PData.brands.indexOf(item.brand_name) >= 0) {
                        new_product_arr3.push(item);
                    }
                });
                product_data = new_product_arr3;
                // console.log("this.PData.brands  products list:", product_data);
            }
            this.totalRecords = product_data.length;
            var product_counter = 0;
            product_data.forEach((item, index) => {
                if (index >= offset && product_counter < per_page) {
                    if (this.PData.price_type && this.PData.price_type != null && this.PData.price_type != "undefined" && this.PData.price_type != '' && this.PData.price_type == 'highlow') {
                        // console.log("index: ", index);
                        // console.log("value: ", value);
                        new_product_arr.push(item);
                        product_counter++;
                    }
                    else {
                        // console.log("index: ", index);
                        // console.log("value: ", value);
                        new_product_arr.push(item);
                        product_counter++;
                    }
                }
            });
            product_data = new_product_arr;
            // console.log("product_data", product_data);
            // console.log("product_data_price_asc", product_data_price_asc);
            if (is_filter == false) {
                this.local_offset = this.local_offset + 20;
                // this.mb_product  = product_data;
                this.mb_product.push(...product_data);
                // console.log("mb_product", this.mb_product);
            }
            else {
                this.mb_product = product_data;
                this.scrollUp();
            }
        }
        else {
            // local storage value not set
            console.log("local storage value not set");
            this.load_subcategory(this.PData.category_id, this.subcat_name);
        }
    }

    async filter_modal() {
        const filter_model = await this.modalCtrl.create({
            component: FilterModalPage,
            componentProps: { postable_data: this.PData, brand_list2: this.brand_list },
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
                else {
                    this.PData.price_type = '';
                }

                if (filter_response.data.store_availability != 'undefined' && filter_response.data.store_availability != undefined && filter_response.data.store_availability != null && filter_response.data.store_availability != '') {
                    this.PData.store_availability = filter_response.data.store_availability;
                    this.apply_filter_count += 1;
                }
                else {
                    this.PData.store_availability = '';
                }
                if (filter_response.data.brands != 'undefined' && filter_response.data.brands != undefined && filter_response.data.brands != null && filter_response.data.brands != '' && filter_response.data.brands.length > 0) {
                    this.PData.brands = filter_response.data.brands;
                    this.apply_filter_count += 1;
                }
                else {
                    this.PData.brands = '';
                }
                if (filter_response.data.brand_list != 'undefined' && filter_response.data.brand_list != undefined && filter_response.data.brand_list != null && filter_response.data.brand_list != '' && filter_response.data.brand_list.length > 0) {
                    this.brand_list = filter_response.data.brand_list;
                }
            }

            this.filter_product();

        });
        return await filter_model.present();
    }
    
    filter_product() {

        this.local_offset = 20;
        this.PData.request_type = '';
        this.PData.offset = '';
        this.local_filter(true);
    }

    download_image(event, file_name, upload_url, extra_url, prefix = null) {
        // console.log("filename",file_name);
        if (event.target && event.target.className != 'loaded') {
            if (prefix) {
                file_name = prefix + file_name;
            }

            this.rest.save_image(upload_url + '/' + extra_url + '/' + file_name, event);

        }
    }

    scrollUp() {
        let that = this;
        setTimeout(() => {
            that.content.scrollToTop();
        }, 500);
        // console.log("Scroll worked");
    }

    scrollUp2() {
        let that = this;
        setTimeout(() => {
            that.content.scrollToTop();
        }, 100);
        // console.log("Scroll worked");
    }

    addToCart(product_id, prefix = null, _event = null) {
        
        console.log("prefix", prefix);
        this.addtocart_data.product_id = product_id;
        this.addtocart_data.qnty = 1;
        this.addtocart_data.action = 'add';
        this.addtocart_data.weightid = Number($("."+prefix+" .variant_data").val());
        if(!this.addtocart_data.weightid)
        {
            this.rest.presentToast("Variant not found.");
            return false;
        }
        this.rest.present();
        this.rest.GlobalPHit(this.addtocart_data, 'Cart/add').subscribe((result) => {
            if (result.status == 'success') {
                $("."+prefix+" .update_btn .product_quantity_count").text(1);
                $("."+prefix+" .add_btn").hide();
                $("."+prefix+" .update_btn").show();
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

    updateQuantity(product_id, type, prefix = null) {

        // console.log("updateQuantity _this", prefix);
        var quantity = Number($("."+prefix+" .update_btn .product_quantity_count").text());
        console.log("quantity", typeof(quantity));
        if(type == 'up')
        {
            quantity += 1;
            $("."+prefix+" .update_btn .product_quantity_count").text(quantity);
            this.updateQuantityPost( product_id, quantity, "up", prefix);
        }
        else if(type == 'down'){
            
            if ((quantity - 1) < 1) {
                quantity = 0;
                $("."+prefix+" .update_btn").hide();
                $("."+prefix+" .add_btn").show();
                $("."+prefix+" .update_btn .product_quantity_count").text(quantity);
                this.updateQuantityPost(product_id, quantity, "down", prefix);
            }
            else {
                quantity -= 1;
                $("."+prefix+" .update_btn .product_quantity_count").text(quantity);
                this.updateQuantityPost(product_id, quantity, "down", prefix);
            }
        }
    }

    updateQuantityPost(product_id, quantity, action, prefix = null) {
        
        this.addtocart_data.action = action;
        this.addtocart_data.qnty = quantity;
        this.addtocart_data.product_id = product_id;
        this.addtocart_data.weightid = Number($("."+prefix+" .variant_data" ).val());
        if(!this.addtocart_data.weightid)
        {
            this.rest.presentToast("Variant not found.");
            return false;
        }
        this.rest.present();
        this.rest.GlobalPHit(this.addtocart_data, 'Cart/update').subscribe((result) => {
            if (result.status == 'success') {
                this.rest.presentToast(result.message);
                this.events.publish("cart_count", result.totalitems);
                // this.events.publish("cart_count_update", 1);
            } else {
                
                $("."+prefix+" .update_btn .product_quantity_count" ).text((quantity-1));
                this.rest.presentToast(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    async loadData(event) {
        
        await this.local_filter(false);
        event.target.complete();
    }

    route_product_view(pid, ProductName) {
        this.navCtrl.navigateForward(['/product-view', { ProductID: pid, ProductName: ProductName }]);
    }
    
    routeLogin()
    {
        this.rest.presentToast('Please Login First');
        this.navCtrl.navigateForward('/sign-in');
    }

}