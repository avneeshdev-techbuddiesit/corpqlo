import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController, ModalController, IonInfiniteScroll, IonContent, Events, Platform, IonSlides } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { FilterModalPage } from '../filter-modal/filter-modal.page';
import * as $ from 'jquery';
import { SafeEventService } from '../services/safe-event.service';

@Component({
    selector: 'app-subcategory',
    templateUrl: './subcategory.page.html',
    styleUrls: ['./subcategory.page.scss'],
})
export class SubcategoryPage implements OnInit {

    @ViewChild('transactionSlider', { static: false }) slides: IonSlides;
    @Input() PData: any = { apikey: this.rest.APIKey, category_id: '', offset: '', parent_id: '', request_type: '', featured: '', subcategory_id: '', user_id: '', store_id: '', brands: '', store_availability: '', price_type: '' };
    @Input() PData2 = { apikey: this.rest.APIKey, user_id: '', varient_id: '', store_id: '' };
    @Input() load_variant_data: any = { apikey: this.rest.APIKey, product_id: '', user_id: '', store_id: '', variant_id: '' };
    @Input() addtocart_data = { apikey: this.rest.APIKey, user_id: '', store_id: '', product_id: '', qnty: 0, weightid: 0, action:'', basketChk: 'false', };
    @Input() PDataGetStoreDetail = { apikey: this.rest.APIKey, user_id: '', store_id: '' };
    @Input() PDataBrandseDetail = { apikey: this.rest.APIKey, user_id: '', store_id: '' };

    public Brands;
    public subcat_name;
    public image_url = this.rest.cdn_upload_url;
    public banner;
    public totalRecords;
    public ofsets: any = 1;
    public variant_id;
    public is_cart;
    public product_id;
    public local_offset: number = 20;
    public is_cart_empty: any = 0;
    public featured_product_count: any = 0;
    public all_active: any = null;
    public featured_active: any = null;
    public apply_filter_count: number = 0;
    public is_api_request: boolean = false;
    public is_filter: boolean = true;
    public fix_category_class: string = '';
    public header_title: string = this.rest._app_name;
    public user_id: any = 0;
    public store_id: any = 0;
    public category_id: any = 0;
    public subcategory_id: any = 0;
    public parent_id: any = 0;
    public initial_load: boolean = false;
    public brand_list:any = [];
    public subcategory_list: any = [];
    public category_banner_slider2: any = ['assets/image/placeholders/cat_banner.jpg', 'assets/image/placeholders/cat_banner.jpg'];
    public product_data:any = [];
    public product_data_price_asc:any = [];
    public featured_product_list:any = [];
    public category_product_list:any = [];
    public subcategory_product_list:any = [];
    public cat_banner: any = 'assets/image/placeholders/cat_banner.jpg';
    public currency = this.rest._currency;
    public slideOptsOne = {
        initialSlide: 0,
        slidesPerView: 1,
        autoplay: true
    };
    // Image Placeholders
    public no_product_placeholder: any = 'assets/image/placeholders/product.jpg';
    public product_placeholder: any = 'assets/image/placeholders/product.jpg';
    public category_placeholder: any = 'assets/image/placeholders/category.jpg';
    public cat_banner_placeholder: any = 'assets/image/placeholders/cat_banner2.jpg';
    public subcat_banner_placeholder: any = 'assets/image/placeholders/subcat_banner2.jpg';

    @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
    @ViewChild('IonContent', { static: false }) content: IonContent;

    constructor(
        private rest: RestService,
        private navCtrl: NavController,
        public storage: Storage,
        public alertController: AlertController,
        public router: ActivatedRoute,
        private modalCtrl: ModalController,
        private platform: Platform,
        public events: Events,
        private Event:SafeEventService
    ) {

        this.header_title = this.router.snapshot.paramMap.get('title');
        this.category_id = this.router.snapshot.paramMap.get("category_id");
        this.subcategory_id = this.router.snapshot.paramMap.get("subcategory_id");

        // Event subscribe
        this.events.subscribe('cart_empty_update', (status) => {
            console.log("cart_empty_update", status);
            this.is_cart_empty = status.is_empty;
            $(' .add_btn').show();
            $(' .update_btn').hide();
            $(' .add_to_cart_btn_out_stock').hide();

        });

        this.events.subscribe('cart_product_update', (data) => {
            console.log("cart_product_update subcategory", data);
            if (data) {

                if(this.product_data && this.product_data.length > 0)
                {
                    this.product_data.forEach((item, index) => {
                        if (item.product_id == data.product_id && item.vid == data.variant_id) {
                            console.log("find product_data :");
                            this.product_data[index].in_cart_quantity = data.is_cart;
                        }
                    });
                    // console.log("this.product_data", this.product_data);
                }

                if(this.product_data_price_asc && this.product_data_price_asc.length > 0)
                {
                    this.product_data_price_asc.forEach((item, index) => {
                        if (item.product_id == data.product_id && item.vid == data.variant_id) {
                            console.log("find product_data_price_asc :");
                            this.product_data_price_asc[index].in_cart_quantity = data.is_cart;
                        }
                    });

                    // console.log("this.product_data_price_asc", this.product_data_price_asc);
                }

                if(data.is_cart && data.is_cart > 0)
                {
                    $(".featured_control_"+data.product_id+' .product_quantity_count').text(data.is_cart);
                    $(".featured_control_"+data.product_id+' .update_btn').show();
                    $(".featured_control_"+data.product_id+' .add_btn').hide();

                    $(".subcat_control_"+data.product_id+' .product_quantity_count').text(data.is_cart);
                    $(".subcat_control_"+data.product_id+' .update_btn').show();
                    $(".subcat_control_"+data.product_id+' .add_btn').hide();

                    this.subcategory_list.forEach((item, index) => {
                        $("."+item.id+"_cat_product_control_"+data.product_id+' .product_quantity_count').text(data.is_cart);
                        $("."+item.id+"_cat_product_control_"+data.product_id+' .update_btn').show();
                        $("."+item.id+"_cat_product_control_"+data.product_id+' .add_btn').hide();
                    });

                }
                else{
                    $(".featured_control_"+data.product_id+' .add_btn').show();
                    $(".featured_control_"+data.product_id+' .update_btn').hide();

                    $(".subcat_control_"+data.product_id+' .add_btn').show();
                    $(".subcat_control_"+data.product_id+' .update_btn').hide();
                    
                    this.subcategory_list.forEach((item, index) => {
                        $("."+item.id+"_cat_product_control_"+data.product_id+' .add_btn').show();
                        $("."+item.id+"_cat_product_control_"+data.product_id+' .update_btn').hide();
                    });
                }

            }
        });
    }

    ngOnInit() {

        this.initializeApp();
    }

    slideChanged() {
        // console.log("slide changed.");
        this.slides.startAutoplay();
    }

    ionViewWillEnter() {
        if (this.is_cart_empty == 1) {
            this.is_api_request = false;
            // this.initializeApp();
            this.is_cart_empty = 0;
        }
    }

    ionViewWillLeave() {
        // console.log("slide ionViewWillLeave.");
        this.slides.stopAutoplay();
    }

    ionViewDidEnter() {
        // console.log("slide ionViewDidEnter.");
        if (this.slides) {
            this.slides.startAutoplay();
        }
        this.onScroll();
    }

    async initializeApp() {

        this.user_id = await this.storage.get('id');
        this.store_id = await this.storage.get('storeID');

        this.PData.user_id = this.user_id;
        this.addtocart_data.user_id = this.user_id;
        this.PData2.user_id = this.user_id;
        this.load_variant_data.user_id = this.user_id;
        this.PDataGetStoreDetail.user_id = this.user_id;

        this.PData.store_id = this.store_id;
        this.PData2.store_id = this.store_id;
        this.load_variant_data.store_id = this.store_id;
        this.addtocart_data.store_id = this.store_id;
        this.PDataGetStoreDetail.store_id = this.store_id;

        if (this.subcategory_id && this.subcategory_id != 0) {

            this.parent_id = 0;
            this.PData.category_id = this.category_id;
            this.PData.subcategory_id = this.subcategory_id;
            this.PData.parent_id = this.parent_id;
            this.all_active = 0;
            this.get_subcategory_products('subcategory');
        }
        else {
            this.parent_id = 1;
            this.all_active = 1;
            this.PData.parent_id = this.parent_id
            this.PData.category_id = this.category_id;
            this.get_category_products();

        }
    }

    load_category(category_id) {

        this.header_title = this.router.snapshot.paramMap.get('title');
        this.all_active = 1;
        this.featured_active = 0;
        this.parent_id = 1;
        this.subcategory_id = 0;
        this.category_id = category_id;
        this.PData.category_id = this.category_id;
        this.PData.parent_id = this.parent_id;
        this.is_filter = false;
        this.scrollUp2();
        this.get_category_products(false);
    }

    load_subcategory(subcategory_id, subcategory_name) {

        this.all_active = 0;
        this.featured_active = 0;
        this.local_offset = 20;
        this.parent_id = 0;
        this.subcat_name = subcategory_name;
        this.header_title = subcategory_name;
        this.subcategory_id = subcategory_id;
        this.PData.subcategory_id = this.subcategory_id;
        this.PData.parent_id = this.parent_id;
        this.PData.brands = '';
        this.PData.store_availability = '';
        this.PData.price_type = '';
        this.brand_list = null;
        this.is_filter = false;
        this.scrollUp2();
        this.get_subcategory_products('subcategory');
    }

    get_category_products(is_first_time_load = true) {

        // Reset Vars
        this.PData.featured = '';
        this.PData.brands = '';
        this.PData.store_availability = '';
        this.PData.price_type = '';
        this.is_api_request = false;
        this.brand_list = null;
        this.category_product_list = [];
        this.subcategory_product_list = [];
        this.featured_product_list = [];
        this.product_data = [];
        this.product_data_price_asc = [];
        
        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'Products/category_products').subscribe((result) => {
            this.ofsets = 1;
            // this.ServiceData = result;
            this.is_api_request = true;
            this.initial_load = true;
            this.apply_filter_count = 0;
            if (result.status == '1') {
                this.subcat_name = "";
                this.subcategory_list = result.subcategory;
                console.log("subcategory_list", this.subcategory_list);
                this.category_product_list = result.data;
                console.log(result)

                if (result.offer_banner['0']) {
                   this.banner = result.offer_banner['0'];
                }
                if (is_first_time_load == false) {
                    $(".sub_main_img img").attr('src', this.cat_banner_placeholder);
                    $(".sub_main_img img").removeClass('loaded').attr('src', this.image_url + '/category/compress/' + this.banner);
                }
                this.featured_product_list = result.featured_product;
                this.featured_product_count = result.featured_product_count;

            } else {
                // this.rest.showAlert(result['message']);
                
            }
            this.is_filter = true;
            this.rest.dismiss()
        }, (err) => {
            this.rest.dismiss()
            console.log(err);
        });
    }

    get_subcategory_products(type = null) {
        this.rest.present();
        this.PData.featured = '';
        this.is_api_request = false;
        this.category_product_list = [];
        this.subcategory_product_list = [];
        this.featured_product_list = [];
        this.product_data = [];
        this.product_data_price_asc = [];
        this.rest.GlobalPHit(this.PData, 'Products/category_products').subscribe((result) => {
            this.ofsets = 1;
            // this.ServiceData = result;
            this.scrollTo();
            this.featured_product_count = result.featured_product_count;
            this.is_api_request = true;
            this.initial_load = true;
            this.apply_filter_count = 0;
            if (result.status == 1) {
                
                if(!this.subcategory_list || this.subcategory_list == null || this.subcategory_list.length == 0)
                {
                    this.subcategory_list = result.subcategory;
                }

                if (result.data['0']['products']) {

                    this.product_data = result.data['0']['products'];
                    var product_list2 = JSON.parse(JSON.stringify(result.data['0']['products']));
                    this.product_data.forEach((item, index) => {
                        if (index < 20) {
                            this.subcategory_product_list.push(item);
                        }
                    });

                    this.product_data_price_asc = this.sortByPriceAsc(product_list2);

                } else {
                    this.category_product_list = [];
                }

                if (result.offer_banner['0']) {
                    this.banner = result.offer_banner['0'];
                    if (type == 'subcategory') {
                        $(".sub_main_img img").attr('src', this.cat_banner_placeholder);
                        $(".sub_main_img img").removeClass('loaded').attr('src', this.image_url + '/category/compress/' + this.banner);
                    }
                }
                // console.log(this.p_list);
                this.subcat_name = result.data['0'].name;
                this.totalRecords = result.data['0'].totalRecords;
            } else {
                this.rest.showAlert(result.message);
            }
            this.is_filter = true;
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
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

    download_image(event, file_name, upload_url, extra_url, prefix = null) {
        event = this.Event.normalize(event);
        console.log("filename",event, file_name, upload_url, extra_url, prefix);
        if (event.path[0] && event.path[0].className != 'loaded') {
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

    sortByPriceAsc(myarr = null) {
        // var myarr = myarr2;
        // var new_list = [];
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

            this.__local_filter();

        });
        return await filter_model.present();
    }

    __local_filter() {

        this.local_offset = 20;
        this.PData.request_type = '';
        this.PData.offset = '';
        this.local_filter(true);
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
                
                // console.log("product_data price_type", product_data);
                if (this.PData.price_type == 'highlow') {
                    product_data = product_data_price_asc;
                    var new_product_arr1 = [];
                    product_data.forEach(item => {
                        new_product_arr1.unshift(item);
                    });
                    product_data = new_product_arr1;
                }
                else if (this.PData.price_type == 'lowhigh') {
                    product_data = product_data_price_asc;
                }
                else if (this.PData.price_type == 'AZ') {
                    
                    var new_product_arr1 = [];
                    new_product_arr1 = this.rest.multiSort(product_data, {'product_name':'asc'})
                    product_data = new_product_arr1;
                }
                else if (this.PData.price_type == 'ZA') {
                    
                    var new_product_arr1 = [];
                    new_product_arr1 = this.rest.multiSort(product_data, {'product_name':'desc'})
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
                // this.subcategory_product_list  = product_data;
                this.subcategory_product_list.push(...product_data);
                // console.log("subcategory_product_list", this.subcategory_product_list);
            }
            else {

                this.subcategory_product_list = product_data;
                this.scrollUp();
                console.log("subcategory_product_list Pradeep", this.subcategory_product_list);
            }
        }
        else {
            // local storage value not set
            console.log("local storage value not set");
            if (this.PData.parent_id == 0 && this.subcat_name == 'Featured Items') {
                // this.load_featured();
            }
            else {
                this.load_subcategory(this.PData.category_id, this.subcat_name);

            }
        }
    }

    onScroll() {

        this.content.ionScroll.subscribe((scroll) => {

            var navbar = $(".sub_main_img").height();
            // console.log("navbar", navbar);
            if (navbar == null || navbar == 0 || navbar == undefined ) {
                navbar = 93;
            }
            if (scroll.detail.scrollTop >= navbar) {

                this.fix_category_class = 'category-fix-top';
            } else {

                this.fix_category_class = '';
            }
        });
    }

    addToCart(product_id, prefix = null, _event) {
        
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
                this.events.publish("cart_product_update", { product_id: this.addtocart_data.product_id, variant_id: this.addtocart_data.weightid, is_cart: this.addtocart_data.qnty });
            } 
            
            else {
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
                this.events.publish("cart_product_update", { product_id: this.addtocart_data.product_id, variant_id: this.addtocart_data.weightid, is_cart: this.addtocart_data.qnty });
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
    
    Getbrands() {
        this.rest.GlobalPHit(this.PData, 'User/get_brands').subscribe((result123) => {
            this.Brands = result123;
            if (this.Brands.status == 1) {
                this.brand_list = this.Brands.data;
            }
        }, (err) => {
            console.log(err);
        });
    }

    async loadData(event) {
        
        await this.local_filter(false);
        event.target.complete();
    }
    
    route_product_view(product_id, product_name) {
        console.log("product",product_id, product_name)
        this.navCtrl.navigateForward(['/product-view', { ProductID: product_id, ProductName: product_name }]);

    }
    
    routeLogin()
    {
        if(!this.user_id || this.user_id == null || this.user_id == 0)
        {
            this.rest.presentToast('Please Login First');
            this.navCtrl.navigateForward('/sign-in');
        }
    }
    
    scrollTo(){

        setTimeout(function(){
            var is_active = 0;
            var pos = 50;
            var actWidth = $( ".scroll_category .scroll_category_elem.active" ).outerWidth();
            // console.log("window.innerWidth", window.innerWidth);
            // console.log("actWidth", actWidth);
            var winWidth = (window.innerWidth/2) + (actWidth/2);
            $( ".scroll_category .scroll_category_elem" ).each(function(){
                
                if(is_active == 0)
                {
                    pos += $(this).outerWidth();
                }

                if( $(this).hasClass('active') )
                {
                    is_active = 1;
                }
            });

            $(".scroll_category").animate({scrollLeft: pos - winWidth}, 500);

        }, 1000);
    }

}