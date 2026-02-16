import { Component, OnInit, Input } from '@angular/core';
import { AlertController, NavController, Platform, Events } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
// import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.page.html',
    styleUrls: ['./sign-in.page.scss'],

})
export class SignInPage implements OnInit {

    @Input() PData = { apikey: this.rest.APIKey, mobile: '', password:'', login_type: '',  devide_id: '', device_token: '', device_type: this.rest._platform };

    public ErrorMobile = "";
    public ErrorPassword = "";
    public devide_id: any;
    public device_token: any;

    constructor(
        private rest: RestService,
        private navCtrl: NavController,
        public alertController: AlertController,
        public platform: Platform,
        public router: Router,
        private storage: Storage,
        private events: Events,
        // private fcm: FCM
    ) {

        this.events.publish('ProfileData', "");
        this.events.publish('Profileuser_pic', "");
        this.events.publish('Profileuser_name', "");
        this.devide_id = '11111';
        if(this.platform.is('cordova'))
        {
            // this.fcm.getToken().then(token => {
            //     this.device_token = token;
            // });
            // this.fcm.requestPushPermission();
        }
    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.storage.get('id').then(save_user_id => {
            if(save_user_id && save_user_id != "")
            {
                this.navCtrl.navigateForward('/home');
            }
        })
    }

    Login() {

        this.ErrorMobile = "";
        this.ErrorPassword = "";
        this.PData.mobile = this.PData.mobile.replace(/\s/g, "");
        if (!this.PData.mobile) {
            this.ErrorMobile = "Enter email or mobile";
        }
        else if (!this.PData.password) {
            this.ErrorPassword = "Enter password";
        }
        else {

            var eml = this.PData.mobile.includes("@");
            var eml2 = this.PData.mobile.includes(".");
            
            if (eml || eml2) {
                this.ErrorMobile = "";
                if (eml && eml2) {
                    this.login_me('email');
                } else {
                    this.ErrorMobile = "Enter valid email";
                }
            } else {

                this.ErrorMobile = ""
                this.login_me('mobile');
            }
        }
    }

    login_me(values) {

        this.PData.login_type = values;
        this.PData.devide_id = this.devide_id;
        this.PData.device_token = this.device_token;
        this.rest.present();

        this.rest.GlobalPHit(this.PData, 'Auth/login').subscribe((result) => {
           
            if (result.status == 1) {

                this.storage.set('id', result.data.user_id);
                this.storage.set('user_name', result.data.user_name);
                this.storage.set('first_name', result.data.first_name);
                this.storage.set('last_name', result.data.last_name);
                this.storage.set('mobile', result.data.mobile);
                this.storage.set('email_address', result.data.email_address);
                this.storage.set('address', result.data.user_pref_address);
                this.storage.set('cart_count', result.data.cart_count);
                this.storage.set('user_all_data', result.data);
                this.events.publish('ProfileData', result.data.user_id);
                this.events.publish('Profileuser_pic', result.data.short_name);
                this.events.publish('Profileuser_name', result.data.user_name);

                if (result.data.user_address == 0) {

                    this.navCtrl.navigateForward('/my-address');
                }
                else if (result.data.user_preference == 0 ) {

                    this.navCtrl.navigateForward('/shopping-preferenes');

                }
                else if (result.data.user_preference && result.data.user_address) {

                    this.navCtrl.navigateForward('/home');
                }
                else{
                    // this.navCtrl.navigateForward('/home');
                }
            }
            else{
                this.rest.presentToast(result.message);
            }

            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    route_forgot() {
        this.navCtrl.navigateBack("/forgot-password");
    }
    
}
