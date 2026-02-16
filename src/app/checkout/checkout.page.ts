import { async } from '@angular/core/testing';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController, Events, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';
import * as $ from 'jquery';
import { SafeEventService } from '../services/safe-event.service';
// import { time } from 'console';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.page.html',
    styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
    
    @Input() PData_order = { apikey: this.rest.APIKey, user_id: '', store_id: '', promocode:'', promocode_data: [], express_delivery_status:0, express_delivery_price: 0, check_wallet: 0,  wallet_pin: null, timeslot_time:'', pickup_timeslot:'', paymethod: 'COD', comments: '', login_by: this.rest._platform, order_type: 0, shipping_charge: 0 ,mb_express:''};
    
    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store_id: '', Wallet: false };

    @Input() PData_var = { apikey: this.rest.APIKey, user_id: '', wallet_pin: '', payamount: '' };

    @Input() PData_promo = { apikey: this.rest.APIKey,store_id:'', user_id: '', cart_subtotal: '', total_product: '', action: '', promocode: ''};
    
    public pickup_timeslot;
    public Wallet_pin;
    public CartNotification;
    public slots;
    public paymoney_amount;
    public nw_amounts;
    public ServiceData;
    public ReviewOrder;
    public amount;
    public mb_express;
    public mb_amount;
    //public Changemb;
    public verify_now;
    public pin_now;
    public discountamount;
    public o_tp;
    public mbexpress_status;
    public is_express = false;
    public wallet_message = '';
    public PaymentModeShow = false;
    public VerifyPinShow: boolean;
    public promo_message;
    public order_id;
    public last_inserted_id;
    public pay_button = 'COD';
    public step = 0;
    public promocode;
    public wallet_amount: any = 0;
    public promo_discount_amount: any = 0;
    public activeTabBilling = 1;
    public activeTabDelivery = 0;
    public activeTabReview = 0;
    public activeTabPayment = 0;
    public order_type = 0;
    public cart_subtotal = 0;
    public shipping_address = '';
    public checkout_data:any = [];
    public cart_products:any = [];
    public cart_products_combo:any = [];
    public timeslots:any = [];
    public imageUrl = this.rest.cdn_upload_url + 'product/';
    public currency = this.rest._currency;
    public time_slot_day:any = [];
    public reduced_time_slot_day: any = [];
    public week_id: any = [];
    public avil_slots: any = [];
    public current: any = 0;


    
    constructor(
        private rest: RestService, 
        private events:Events, 
        private navCtrl: NavController,
        public storage: Storage, 
        public alertController: AlertController,
        public activatedRoute: ActivatedRoute,
        public router: Router,
        private platform: Platform,
        private inAppBrowser: InAppBrowser,
        private Event:SafeEventService
        ) {
    }

    ngOnInit() {
        // this.get_checkout_data();
        // this.getTimeSlot(1);
    }

    ionViewWillEnter() {
        
        this.storage.get('id').then((save_user_id) => {

            this.PData.user_id = save_user_id;
            this.PData_var.user_id = save_user_id;
            this.PData_promo.user_id = save_user_id;
            this.PData_order.user_id = save_user_id;
        });

        this.storage.get('storeID').then((storeID) => {
            this.PData.store_id = storeID;
            this.PData_promo.store_id = storeID;
            this.PData_order.store_id = storeID;
            this.get_checkout_data();
        });
    }

    get_checkout_data() {

        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'v2/Checkout').subscribe( async(result) => {
            console.log(result)
            if (result.status == 1) {
                this.rest.dismiss();
                this.checkout_data = result.data;
                this.time_slot_day = await result.data.store_data.timeslots;
                this.order_type = Number(this.checkout_data.user_preference.order_type);
                
                this.PData_order.order_type = this.order_type;
                this.cart_products = this.checkout_data.cart_products;
                this.cart_products_combo = this.checkout_data.cart_products_combo;
                this.cart_subtotal = this.checkout_data.cart_subtotal;
                this.week_id = this.time_slot_day.map(o => o.day_id)
                this.reduced_time_slot_day = this.time_slot_day.filter(({day_id}, index) => !this.week_id.includes(day_id, index + 1))


// ------------------------------vikas------------------------

                let obj = this.time_slot_day.find(o => o.is_disable === 0);
                this.getTimeSlot(obj.day_id);

// ------------------------------------------------------
                if(this.order_type == 1)
                {
                    this.shipping_address = this.checkout_data.store_data.store_address;
                    this.timeslots = this.checkout_data.store_data.pickup_timeslots;
                }
                else if(this.order_type == 2)
                {
                    this.shipping_address = this.checkout_data.user_address.full_address;
                    this.timeslots = this.checkout_data.store_data.timeslots;
                    this.o_tp = Number(this.checkout_data.user_preference.order_type)
                    
                }

            } else {
                this.rest.showAlert(result.message);
                
            }

        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });

    }

    next_tab(type = 0) {

        if(type == 1)
        {   
            this.activeTabBilling = 0;
            this.activeTabDelivery = 1;
            this.activeTabReview = 0;
            this.activeTabPayment = 0;
        }
        else if(type == 2)
        {
            console.log("this.PData_order.timeslot_time", this.PData_order.timeslot_time);
            if(this.order_type == 1 && !this.PData_order.pickup_timeslot)
            {

            }
            else if(this.order_type == 2 && !this.PData_order.timeslot_time)
            {
                console.log("this.PData_order.timeslot_time", this.PData_order.timeslot_time);
            }
            else{
                this.activeTabBilling = 0;
                this.activeTabDelivery = 0;
                this.activeTabReview = 1;
                this.activeTabPayment = 0;
            }
        }
        else if(type == 3)
        {
            this.activeTabBilling = 0;
            this.activeTabDelivery = 0;
            this.activeTabReview = 0;
            this.activeTabPayment = 1;
        }
    }

    back_tab(type = 0) {

        if(type == 1)
        {
            this.activeTabBilling = 1;
            this.activeTabDelivery = 0;
            this.activeTabReview = 0;
            this.activeTabPayment = 0;
        }
        else if(type == 2)
        {
            this.activeTabBilling = 0;
            this.activeTabDelivery = 1;
            this.activeTabReview = 0;
            this.activeTabPayment = 0;
        }
    }

    apply_promo(cart_subtotal, total_cart_item) {

        this.promo_message = "";
        this.PData_promo.action = 'add';
        this.PData_promo.promocode = this.promocode;
        this.PData_promo.cart_subtotal = cart_subtotal;
        this.PData_promo.total_product = total_cart_item;
        this.rest.present();
        this.rest.GlobalPHit(this.PData_promo, 'v2/Cart/check_promo').subscribe((result) => {
            
            if (result.data.status == 1) {
              
                this.promo_message = result.data.msg;
                this.discountamount = result.data.promo_data.discountamount;
                this.PData_order.promocode_data = result.data.promo_data;
                this.PData_order.promocode = result.data.promocode;
                // if(result.data.promo_data.discountamount)
                // {
                //     this.cart_subtotal = this.cart_subtotal-this.discountamount;
                // }

            } else {

                if(this.discountamount)
                {
                    this.cart_products = this.cart_products - this.discountamount;
                }
                this.discountamount = 0;
                this.promo_message = result.data.msg;
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    remove_promo(cart_subtotal, total_cart_item) {

        this.promo_message = "";
        this.PData_promo.action = 'remove';
        this.PData_promo.promocode = this.promocode;
        this.PData_promo.cart_subtotal = cart_subtotal;
        this.PData_promo.total_product = total_cart_item;
        this.rest.present();
        
        this.rest.GlobalPHit(this.PData_promo, 'Cart/apply_promocode').subscribe((result) => {

            if (result.status == 1) {
                this.promo_message = result.data.message;
                this.promo_discount_amount = result.data.promo_discount;
                this.PData_order.promocode_data = result.data.promo_data;
                this.PData_order.promocode = result.data.promocode;
                if(result.data.promo_discount)
                {
                    this.cart_products = this.cart_products+this.promo_discount_amount;
                }

            } else {

                if(this.promo_discount_amount)
                {
                    this.cart_products = this.cart_products - this.promo_discount_amount;
                }

                this.promo_discount_amount = 0;
                this.promo_message = result.data.message;
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    use_wallet(amounts) {

        if (this.PData.Wallet) {
            this.VerifyPinShow = true;
            this.wallet_message = "";
        } else {

            this.cart_subtotal = amounts;
            this.wallet_amount = "";
            this.VerifyPinShow = false
        }
    }

    verify_wallet_pin(amounts, sp_charges) {

        this.PData_var.wallet_pin = this.Wallet_pin;
        this.nw_amounts = amounts + Number(sp_charges);
        this.PData_var.payamount = this.nw_amounts;
        this.rest.present();
        this.rest.GlobalPHit(this.PData_var, 'Cart/validate_wallet_pin').subscribe((result) => {
            if (result.status == 1) {
                this.rest.dismiss();
                this.cart_subtotal = result.amount;
                this.wallet_amount = result.wallet;
                this.wallet_message = result.message;
                if (this.cart_subtotal == 0) {
                    this.PaymentModeShow = false
                    this.pay_button = "COD";
                }
            } else {
                this.rest.dismiss();
                this.rest.showAlert(result.message);
            }
        }, (err) => {
            console.log(err);
        });
    }

    choose_express_delivery(express_price) {

        if (this.PData_order.express_delivery_price == 0) {

            this.PData_order.express_delivery_price = express_price;
            this.cart_subtotal = Number(this.cart_subtotal) + Number(express_price);
            
        } else {
            
            this.PData_order.express_delivery_price = 0;
            this.cart_subtotal = Number(this.cart_subtotal) - Number(express_price);
        }
    }

    forgot_wallet_pin() {
        this.rest.present();
        
        this.rest.GlobalPHit(this.PData, 'Cart/send_wallet_pin').subscribe((result) => {
            console.log(result);
            if (result.status == 1) {
                this.rest.dismiss();
                this.rest.showAlert(result.message);
            } else {
                this.rest.dismiss();
                this.rest.showAlert(result.message);
            }
        }, (err) => {
            console.log(err);
        });
    }
    
    choose_payment_method(_paymenthod) {

        if (_paymenthod == "COD") {
            this.step = 0;
        } else {
            this.step = 1;
        }
        this.PData_order.paymethod = _paymenthod;
        this.pay_button = _paymenthod;
    }

    ConvertToInt(val) {
        return parseInt(val);
    }

    place_order() {

        if (this.wallet_amount) {
            this.PData_order.check_wallet = 1;
            this.PData_order.wallet_pin = this.Wallet_pin;
        } else {
            this.PData_order.check_wallet = 0;
            this.PData_order.wallet_pin = null;
        }
        if(!this.PData_order.order_type)
        {
            this.rest.presentToast('Please update your order preference');
            return false;
        }
        else if(this.PData_order.order_type == 1 && !this.PData_order.pickup_timeslot)
        {
            this.rest.presentToast('Please select timeslot');
            return false;
        }
        else if(this.PData_order.order_type == 2 && !this.PData_order.timeslot_time)
        {
            this.rest.presentToast('Please select timeslot');
            return false;
        }
        else{
            
            this.rest.present();
            this.rest.GlobalPHit(this.PData_order, 'v2/Place_order').subscribe((result) => {
                if (result.status == 1) {
                    this.rest.dismiss();
                    // this.rest.showAlert(result.message)
                    if (result.status == 1) {

                        if(result.data.PAYMENT_TYPE == 'COD')
                        {
                            this.navCtrl.navigateRoot('order-list');
                            this.events.publish("cart_count", 0);
                        }
                        else if(result.data.PAYMENT_TYPE == 'PAYTM')
                        {
                            this.last_inserted_id = result.data.PAYMENT_DATA.LAST_INSERTED_ID;
                            this.order_id = result.data.PAYMENT_DATA.ORDER_ID;;
                            this.paymoney_amount = result.data.PAYMENT_DATA.TXN_AMOUNT;
                            this.route_paytm(this.last_inserted_id, this.order_id, this.paymoney_amount);
                        }
                        else{
                            this.navCtrl.navigateRoot('order-list');
                            
                        }
                    }
                } else {
    
                    this.rest.dismiss();
                    this.rest.showAlert(result.message)
                    this.navCtrl.navigateForward('/cart');
                }
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        }
    }

    route_paytm(last_inserted_id, order_id, paymoney_amount) {

        this.PData_order.paymethod = "PAYTM";
        if (!this.PData_order.paymethod) {
            alert("Payment method required is required.");
           
        } else {
           
            const url = this.rest.domain + 'API/Paytm/paytm_checkout_pay' + '?user_id=' + this.PData_order.user_id + '&amount=' + paymoney_amount + '&order_id=' + order_id + '&last_inserted_id=' + last_inserted_id;

            let browser = this.inAppBrowser.create(url, '_blank', 'clearcache=yes,clearsessioncache=yes,location=no,hardwareback=no,zoom=no,toolbar=no');
            browser.on('loadstart').subscribe((event:InAppBrowserEvent)=>
            {
                console.log("inAppBrowser loadstart", event.url);

                var closeUrlSuccess = this.rest.domain+'API/Paytm/paytm_payment_status_success'; 
                var closeUrlFail = this.rest.domain+'API/Paytm/paytm_payment_status_fail'; 
                var closeUrlParamFail = this.rest.domain+'API/Paytm/paytm_payment_status_param_fail'; 

                console.log("closeUrlSuccess", closeUrlSuccess);
                console.log("closeUrlFail", closeUrlFail);
                console.log("closeUrlParamFail", closeUrlParamFail);
                if(event.url == closeUrlSuccess)
                {
                    browser.close();
                    this.navCtrl.navigateRoot('order-list');
                    this.events.publish("cart_count", 0);
                    // this.rest.showAlert("Invalid payment request");
                }
                else if(event.url == closeUrlFail)
                {
                    browser.close();
                    this.navCtrl.navigateRoot('order-list');
                    
                    // this.rest.showAlert("Invalid payment request");
                }
                else if(event.url == closeUrlParamFail)
                {
                    browser.close();
                    this.navCtrl.navigateRoot('order-list');
                    this.rest.showAlert("Invalid payment request");
                }

            });

            browser.on('loadstop').subscribe((event:InAppBrowserEvent)=>
            {
                // this.navCtrl.navigateForward('/home');
                console.log("loadstop event",event);

            });

            browser.on('loaderror').subscribe((event:InAppBrowserEvent)=>
            {
                browser.close();
                alert("Something went wrong.");
            });
        }
    }

    selectordertype(url = 'cart') {
        this.navCtrl.navigateForward(['/select-ordertype', { url: url }]);
    }

    download_image(event, file_name, upload_url, extra_url, prefix = null) {
        event = this.Event.normalize(event);
        if (event.path[0] && event.path[0].className != 'loaded') {
            if (prefix) {
                file_name = prefix + file_name;
            }
            this.rest.save_image(upload_url + '/' + extra_url + '/' + file_name, event);
        }
    }

    route_product_detail(pid, ProductName) {
        this.navCtrl.navigateForward(['/product-view', { ProductID: pid, ProductName: ProductName }]);
    }

    ChangeWallet(amounts) {
        if (this.PData['Wallet']) {
            this.VerifyPinShow = true;
            this.wallet_message = "";
        } else {
            this.amount = amounts;
            this.wallet_amount = "";

            this.VerifyPinShow = false
        }
    }

    Changemb(rs) {
         //alert(this.mb_express);
        //alert(this.PData_order.mb_express);
        if (this.mb_express) {
            this.mb_amount = rs;
            this.cart_subtotal = Number(this.cart_subtotal) + Number(rs);
            this.checkout_data.mb_express = rs;
            this.PData_order.mb_express = rs;
        } else {
            this.mb_amount = "";
            this.checkout_data.mb_express = "";
            this.cart_subtotal = Number(this.cart_subtotal) - Number(rs);
        }
    }

// ------------------------------vikas------------------------


    setTimeSlot(event) {
        this.PData_order.pickup_timeslot = event.detail.value;
        console.log('............',this.PData_order.pickup_timeslot)
    }

    // payment() {
    //     if(!this.PData_order.pickup_timeslot)
    //     {
    //         this.rest.presentToast('Please select timeslot');
    //         return false;
    //     } else {
    //         this.navCtrl.navigateForward(['/payment',{pick_timeslot:this.PData_order.pickup_timeslot}]);
    //     }
    // }

    payment() {
            this.navCtrl.navigateForward(['/payment']);
    }

    getTimeSlot(id) {
        console.log(id);
        this.current = id;
        this.avil_slots = this.time_slot_day.filter((item) => {
            return item.day_id == id;
        });
        console.log(this.avil_slots)
    }

    edit_address(address_id, address_type) {

        this.navCtrl.navigateForward(["/add-address", { address_id: address_id, address_type: address_type }]);
        console.log(address_id, address_type)
    }

// ------------------------------vikas------------------------


}
