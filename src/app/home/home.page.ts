import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { AlertController, NavController, Platform, MenuController, Events, IonSlides } from '@ionic/angular';
import { ActivatedRoute, Router} from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { AnimationService, AnimationBuilder } from 'css-animator';
import { SafeEventService } from '../services/safe-event.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    @ViewChild('transactionSlider', { static: false }) slides: IonSlides;
    @ViewChild("myElement", { read: ElementRef, static:false }) private searchbarElem: ElementRef;
    @ViewChildren("catAnim", { read: ElementRef }) private catAnim: ElementRef;
    private animator: AnimationBuilder;
    
    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store_id: '',home_slider_cache_metadata:'',shop_by_category_cache_metadata:'',cat_subcat_cache_metadata:'', sm_banner_cache_metadata: '', lg_banner_cache_metadata: '' };
    @Input() PDataGetStoreDetail = { apikey: this.rest.APIKey, user_id: '' };
    @Input() addtocart_data = { apikey: this.rest.APIKey, user_id: 0, store_id: 0, action: '', product_id: '', qnty: 0, weightid: 0, basketChk: false };
    @Input() load_variant_data: any = { apikey: this.rest.APIKey, product_id: '', user_id: '', store_id: '', varient_id: '' };
    
    public p_list = [];
    public item_qty = 0;
    public chk_qty;
    public quant;
    public user_address: any;
    public nextTimeSlotData:any;
    public sliderOne: any;
    public sliderTwo: any;
    public sliderThree: any;
    public user_id: any;
    public ServiceData: any;
    public ServiceData3: any;
    public CartNotification: any;
    public smart_way: any;
    public recipe_data: any;
    public shop_by_category: any;
    public offer_banner: any;
    public show: any;
    public storeID: any;
    public ServiceGetStore: any;
    public testimonial: any;
    public homeCategorySubcatList: any;
    public small_offer_banner_list:any;
    public big_offer_banner_list:any;
    public productList: any;
    public is_home_already_load: number = 0;
    public home_slider: any [];
    public image_url = this.rest.cdn_upload_url;
    public currency = this.rest._currency;
    public is_cart_empty: any = 0;
    // Placeholders
    public product_placeholder: any = 'assets/image/placeholders/product.jpg';
    public home_banner_placeholder: any = 'assets/image/placeholders/home_banner.jpg';
    public recipe_placeholder: any = 'assets/image/placeholders/recipe.jpg';
    public category_placeholder: any = 'assets/image/placeholders/category.jpg';
    public category_banner_placeholder: any = 'assets/image/placeholders/cat_banner.jpg';
    public subcategory_placeholder: any = 'assets/image/placeholders/subcategory.jpg';
    public banner_placeholder: any = 'assets/image/placeholders/banner.jpg';
    public common_placeholder: any = 'assets/image/placeholders/common.jpg';
    public testimonial_placeholder: any = 'assets/image/placeholders/testimonial.jpg';
    public small_banner_placeholder: any = 'assets/image/placeholders/small_offer_banner.jpg';
    public big_banner_placeholder: any = 'assets/image/placeholders/big_offer_banner.jpg';
    
    //Configuration for each Slider
    slideOptsOne = {
        initialSlide: 0,
        slidesPerView: 1,
        autoplay: true,
    };
    slideOptsTwo = {
        initialSlide: 1,
        slidesPerView: 2.5,
        loop: false,
        centeredSlides: false
    };
    slideOptsThree = {
        initialSlide: 0,
        slidesPerView: 3
    };
    
    constructor(
        private rest: RestService,
        private navCtrl: NavController,
        public storage: Storage,
        public alertController: AlertController,
        public router: Router,
        public events: Events,
        public platform: Platform,
        public menuCtrl: MenuController,
        private Event: SafeEventService,
        animationService: AnimationService, 
        private elementRef: ElementRef
    ) {
        this.animator = animationService.builder();
        this.storage.set('new', '1')
        this.storage.set('reloads_intro', "1");
        this.storage.set('reloads', "");
        this.events.subscribe('ProfileData', (data) => {
            if (data) {
                this.user_id = data;
                this.PDataGetStoreDetail.user_id = data;
                // this.GetCartNotification();
            } else {
                this.PDataGetStoreDetail.user_id = "";
                // this.GetCartNotification();
            }
        });

        this.events.subscribe('cart_product_update', (data) => {
            // console.log("cart_product_update1", data);
            if (data) {
                // console.log("cart_product_update2", data);
                // console.log("1 featured_product", this.featured_product);
               
                if(data.is_cart > 0)
                {
                    $(".home_featured_product_"+data.product_id+' .product_quantity_count').text(data.is_cart);
                    $(".home_featured_product_"+data.product_id+' .update_btn').show();
                    $(".home_featured_product_"+data.product_id+' .add_btn').hide();
                }
                else{
                    $(".home_featured_product_"+data.product_id+' .add_btn').show();
                    $(".home_featured_product_"+data.product_id+' .update_btn').hide();
                }
            }
        });

        this.events.subscribe('cart_empty_update', (status) => {
            console.log("cart_empty_update", status);
            this.is_cart_empty = status.is_empty;
            $(' .add_btn').show();
            $(' .update_btn').hide();
            // $(' .add_to_cart_btn_out_stock').hide();

        });

        platform.ready().then(() => {

            this.platform.backButton.subscribe(() => {
                // alert(this.router.url);
                if (this.router.url == "/home") {
                    this.presentConfirm();
                }
            })
        });

        this.sliderOne =
        {
            isBeginningSlide: true,
            isEndSlide: false
        };
        //Item object for Food
        this.sliderTwo =
        {
            isBeginningSlide: true,
            isEndSlide: false
        };
        //Item object for Fashion
        this.sliderThree =
        {
            isBeginningSlide: true,
            isEndSlide: false
        };
    }

    chekBlock(user_id) {
        this.PDataGetStoreDetail.user_id = user_id;
        this.rest.userBlock(this.PDataGetStoreDetail).subscribe((result) => { });
    }

    presentConfirm() {
        navigator['app'].exitApp();
    }

    slideChanged() {
        console.log("slide changed.");
        this.slides.startAutoplay();
    }

    ionViewWillEnter() {
        console.log("slide ionViewWillEnter.");
        this.rest.present();
        this.get_home_page();
        this.rest.dismiss();
        this.storage.get('cart_count').then((saved_cart_count) => {
            if (saved_cart_count) {
                this.events.publish("cart_count", saved_cart_count);
            }
            else {
                this.storage.get('id').then((saved_user_id) => {
                    if (saved_user_id) {
                        this.events.publish("cart_count_update", 1);
                    }
                });
            }
        });
    }

    ionViewDidEnter() {
        if (this.slides) {
            console.log("slide ionViewDidEnter.");
            this.slides.startAutoplay();
        }
        
        this.storage.get('address').then((address) => {
            if (address != '' && address != null) {
                this.user_address = address;
            }
        });

        this.storage.get('id').then((save_user_id) => {
            if (save_user_id != '' && save_user_id != null) {
                this.user_id = save_user_id;
                this.PData.user_id = save_user_id;
                this.PDataGetStoreDetail.user_id = save_user_id;
                this.addtocart_data.user_id = save_user_id;
                this.load_variant_data.user_id = save_user_id;
            }
        });
        this.nextTimeSlot();
        this.extra_cat_subcat();
        // this.get_featured_products();
        // this.animator.setType('animate__fadeInRight').show(this.catAnim.nativeElement);
        // this.animator.setType('animate__fadeInRight').show(this.searchbarElem.nativeElement);

        setTimeout(function(){
            // $(".category_type").addClass('go');
            // console.log('category_container', $(".category_container").html());
        }, 1000)
    }

    ionViewWillLeave() {
        console.log("slide ionViewWillLeave.");
        this.slides.stopAutoplay();
    }

    animateElem() {
        // this.animator.setType('animate__fadeInUp').show(this.catAnim.nativeElement);
    }

    async ngOnInit() {

        var save_user_id = await this.storage.get('id');
        if (save_user_id) {
            
            await this.get_store_id(save_user_id);
            this.rest.get_app_version();
            // this.get_user_profile();
            // await this.get_featured_products();

        } else {
            this.storage.set('reloads2', '0');
            this.events.publish('ProfileData', "");
            this.events.publish('Profileuser_pic', "");
            this.events.publish('Profileuser_name', "");
            await this.get_store_id();
            this.rest.get_app_version();
            // this.nextTimeSlot();
            // await this.get_featured_products();
        }
    }

    async get_store_id(save_user_id = null) {
        return Promise.resolve((() => {
            this.rest.GlobalPHit(this.PDataGetStoreDetail, '/User/get_store_id').subscribe((result) => {
                
                if (result.status == '1') {
                    this.storeID = result.store_id;
                    this.storage.set('storeID', this.storeID);
                    this.PData.store_id = this.storeID;
                    this.addtocart_data.store_id = this.storeID;
                    this.load_variant_data.store_id = this.storeID;
                    console.log("this.PData", this.PData);
                    this.get_featured_products();
                    this.nextTimeSlot();
                    if(save_user_id)
                    {
                        this.get_user_profile();
                    }
                }
                else{
                    this.get_featured_products();
                }
                
            }, (err) => {
                console.log(err);
            });
        })());
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
        this.checkisBeginning(object, slideView);
        this.checkisEnd(object, slideView);
    }

    checkisBeginning(object, slideView) {
        slideView.isBeginning().then((istrue) => {
            object.isBeginningSlide = istrue;
        });
    }

    checkisEnd(object, slideView) {
        slideView.isEnd().then((istrue) => {
            object.isEndSlide = istrue;
        });
    }

    async get_home_page() {

        this.is_home_already_load += 1;
        if (this.is_home_already_load == 2 || this.is_home_already_load % 2 === 0) {
            // return false;
        }

        this.storage.set('reloads', "");
        var home_slider_data = await this.storage.get('home_slider_data');
        var shop_by_category_data = await this.storage.get('shop_by_category_data');

        if (shop_by_category_data != '' && shop_by_category_data != null) {

            this.PData.shop_by_category_cache_metadata = shop_by_category_data.cache_metadata;

            if(this.shop_by_category == null)
            {
                this.shop_by_category = shop_by_category_data.data;
                console.log('--------------',this.shop_by_category)
            }
            
        }

        if (home_slider_data != '' && home_slider_data != null) {
            this.PData.home_slider_cache_metadata = home_slider_data.cache_metadata;
            if(this.home_slider == null)
            {
                this.home_slider = home_slider_data.data;
            }
        }

        // this.rest.present();
        this.rest.GlobalPHit(this.PData, 'Home_page/index').subscribe((result) => {
            // this.ServiceData = result;
            if (result.status == 1) {

                if (result.data.home_slider.responseType == 2) {
                    this.storage.set('home_slider_data', { data: result.data.home_slider.data, cache_metadata: result.data.home_slider.cache_metadata });
                    this.home_slider = result.data.home_slider.data;
                }

                if (result.data.shop_by_category.responseType == 2) {
                    this.storage.set('shop_by_category_data', { data: result.data.shop_by_category.data, cache_metadata: result.data.shop_by_category.cache_metadata });
                    this.shop_by_category = result.data.shop_by_category.data;
                }

                if (this.shop_by_category.length >= 5) {
                    this.show = '1';
                }
            }

            if (result.status == 0) {
                this.rest.showAlert(result.message);
            }

        }, (err) => {
            console.log(err);
        });
        
    }

    async nextTimeSlot() {
        if(this.PData.store_id && this.PData.store_id != null )
        {
            this.rest.GlobalPHit(this.PData, 'Timeslot/get_next_timeslot').subscribe((result) => {
                if (result.responseStatus == 'success' && result.responseCode == 200) {
                    this.nextTimeSlotData = result.data;
                }
            }, (err) => {
                console.log("nextTimeSlot Error", err);
            });
        }
    }

    async extra_cat_subcat() {

        var small_offer_banner = await this.storage.get('small_offer_banner_data');
        
        if (small_offer_banner != '' && small_offer_banner != null) {
            this.PData.sm_banner_cache_metadata = small_offer_banner.cache_metadata;
            if (this.small_offer_banner_list == null) {
                this.small_offer_banner_list = small_offer_banner.data;
            }
        }
        console.log("small_offer_banner", small_offer_banner);
        var big_offer_banner = await this.storage.get('big_offer_banner_data');
        if (big_offer_banner != '' && big_offer_banner != null) {
            this.PData.lg_banner_cache_metadata = big_offer_banner.cache_metadata;
            if (this.big_offer_banner_list == null) {

                this.big_offer_banner_list = big_offer_banner.data;
            }
        }

        var home_catsubcat_data = await this.storage.get('home_catsubcat_data');
        // console.log("home_catsubcat_data", home_catsubcat_data);
        if (home_catsubcat_data != '' && home_catsubcat_data != null && this.homeCategorySubcatList == null) {
            this.PData.cat_subcat_cache_metadata = home_catsubcat_data.cache_metadata;
            this.homeCategorySubcatList = home_catsubcat_data.data;
        }

        this.rest.GlobalPHit(this.PData, 'Home_page/category').subscribe((result) => {
            if (result.responseStatus == 'success' && result.responseCode == 200) {

                if (result.responseType == 2) {
                    this.storage.set('home_catsubcat_data', { data: result.data, cache_metadata: result.cache_metadata });
                    this.homeCategorySubcatList = result.data;
                }

                if (result.small_offer_banner && result.small_offer_banner.responseType == 2) {
                    this.storage.set('small_offer_banner_data', { data: result.small_offer_banner.data, cache_metadata: result.small_offer_banner.cache_metadata });
                    this.small_offer_banner_list = result.small_offer_banner.data;
                    // this.homeCategorySubcatList = this.homeCategorySubcatList;
                    this.homeCategorySubcatList = JSON.parse(JSON.stringify(this.homeCategorySubcatList));
                }
                else if (result.small_offer_banner && result.small_offer_banner.responseType == 3) {
    
                    this.storage.get('small_offer_banner_data').then((data) => {
                        if (data) {
                            this.storage.remove('small_offer_banner_data');
                            this.small_offer_banner_list = null;
                            this.homeCategorySubcatList = JSON.parse(JSON.stringify(this.homeCategorySubcatList));
                        }
                    });
                }
    
                if (result.big_offer_banner && result.big_offer_banner.responseType == 2) {
                    this.storage.set('big_offer_banner_data', { data: result.big_offer_banner.data, cache_metadata: result.big_offer_banner.cache_metadata });
                    this.big_offer_banner_list = result.big_offer_banner.data;
                    // this.homeCategorySubcatList = this.homeCategorySubcatList;
                    this.homeCategorySubcatList = JSON.parse(JSON.stringify(this.homeCategorySubcatList));
                }
                else if (result.big_offer_banner && result.big_offer_banner.responseType == 3) {
    
                    this.storage.get('big_offer_banner_data').then((data) => {
                        if (data) {
                            this.storage.remove('big_offer_banner_data');
                            this.big_offer_banner_list = null;
                            this.homeCategorySubcatList = JSON.parse(JSON.stringify(this.homeCategorySubcatList));
                        }
                    });
    
    
                }
            }

        }, (err) => {
            console.log("HomePageCategory Error", err);
        });
    }

    async get_featured_products() {
        console.log("this.PData.store_id get_featured_products", this.PData.store_id);
        this.rest.GlobalPHit(this.PData, 'Home_page/top_featured_products').subscribe((result) => {
            if (result.responseStatus == 'success' && result.responseCode == 200) {
                if (result.responseType == 1) {
                    this.productList = result.data;
                    console.log("productList", this.productList);
                }
            }
        }, (err) => {
            console.log("get_featured_products Error", err);
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

    addToCart(product_id, prefix) {
        
        this.rest.present();
        this.addtocart_data.product_id = product_id;
        this.addtocart_data.qnty = 1;
        this.addtocart_data.action = 'add';
        this.addtocart_data.weightid = Number($("."+prefix+" .variant_data").val());
        this.rest.GlobalPHit(this.addtocart_data, 'Cart/add').subscribe((result) => {
            if (result.status == 'success') {
                $("."+prefix+" .product_quantity_count").text(1);
                $("."+prefix+" .add_btn").hide();
                $("."+prefix+" .update_btn").show();
                this.rest.presentToast(result.message);
                this.events.publish("cart_count", result.totalitems);
            } else {
                if(result.status == 'exist' && result.quantity && result.quantity > 0)
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
        this.addtocart_data.action = action;
        this.addtocart_data.qnty = quantity;
        this.addtocart_data.product_id = product_id;
        this.addtocart_data.weightid = Number($("."+prefix+" .variant_data").val());
        this.rest.GlobalPHit(this.addtocart_data, 'Cart/update').subscribe((result) => {
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

    get_user_profile() {
        
        this.PData.user_id = this.user_id;
        // this.PData.store_id = this.storeID;
        console.log("PData", this.PData);
        this.rest.GlobalPHit(this.PData, 'User/my_profile').subscribe((result) => {
            if (result.status == 1) {

                if (result.user_profile.status != 1 || result.user_profile.is_blocked != 1) {
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
        }, (err) => {
            console.log(err);
        });
    }

    download_image(event, file_name, upload_url, extra_url) {
    event = this.Event.normalize(event);
        if (this.platform.is('ios')) {
            if (event.target && event.target.className != 'loaded') {
                this.rest.save_image(upload_url + '/' + extra_url + '/' + file_name, event);
    
            }
        }
        else{
            if (event.path[0] && event.path[0].className != 'loaded') {
                this.rest.save_image(upload_url + '/' + extra_url + '/' + file_name, event);
    
            }
            
        }
    }
    
    route_search() {
        this.navCtrl.navigateForward('/search');
    }

    route_cart() {
        this.navCtrl.navigateForward('/cart');
    }

    route_product_view(product_id, product_name) {
        this.navCtrl.navigateForward(['/product-view', { ProductID: product_id, ProductName: product_name }]);

    }

    route_category() {
        this.navCtrl.navigateForward('/category');

    }

    route_subcategory() {
        this.navCtrl.navigateForward('/subcategory');
    }

    goto_dynamic_page(SbName, cat_id = 0, subcat_id = 0) {

        if (cat_id && subcat_id) {

            this.navCtrl.navigateForward(['/subcategory', { title: SbName, category_id: cat_id, subcategory_id: subcat_id }]);
        }
        else if (cat_id) {

            this.navCtrl.navigateForward(['/category-view', { title: SbName, category_id: cat_id }]);
        }
    }

    route_subcategoryview() {
        this.navCtrl.navigateForward('/subcategory-view');

    }

    go_rec_listing() {
        this.navCtrl.navigateForward('/recipe-listing');

    }

    recipe_details(rid) {
        this.storage.set('receipe_id', rid);
        this.navCtrl.navigateForward('/recipe-details');
    }

    smart_details(rid) {
        this.navCtrl.navigateForward(['/smart-way-detail', { sid: rid }]);
    }

    go_to_url(category_id, category_name) {
        if (category_id && category_id != '0' && category_id !=null) {
            this.navCtrl.navigateForward(['/subcategory', { title: category_name, category_id: category_id }]);
        }
    }

    goto_category_page(category_id, title) {
        
        if (category_id && category_id != '0') {
            this.storage.set('c_type', 1);
            this.navCtrl.navigateForward(['/subcategory', { category_id: category_id, title: title, c_type:1 }]);
        }
    }

    goto_subcategory_page(category_id, subcategory_id, title ) {
        
        if (category_id && subcategory_id) {
            this.navCtrl.navigateForward(['/subcategory', { category_id: category_id, subcategory_id: subcategory_id, title: title, c_type:1 }]);
        }
    }
    
    routeLogin()
    {
        this.rest.presentToast('Please Login First');
        this.navCtrl.navigateForward('/sign-in');
    }
}
