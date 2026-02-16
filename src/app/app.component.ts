import { Component, enableProdMode } from '@angular/core';
import { AlertController, NavController, Events, MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from './rest.service';
// import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';

@Component({
    selector: 'app-root',
    styleUrls: ['./app.scss'],
    templateUrl: 'app.component.html',
    providers: [LocalNotifications]

})
export class AppComponent {
    ServiceData35: any;
    user_id_login: any;
    user_login_name: any;
    user_pic: any;
    sp_id: any;
    b_id: any;
    showSubmenuMyAccount: boolean = false;
    showSubmenuMbProduct: boolean = false;
    showSubmenuContact: boolean = false;
    showSubmenuBlog: boolean = false;
    constructor(
        public platform: Platform,
        public splashScreen: SplashScreen,
        public navCtrl: NavController,
        public rest: RestService,
        public storage: Storage,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public events: Events,
        // public fcm: FCM,
        public localNotifications: LocalNotifications,
        public menuController: MenuController
    ) {

        this.initializeApp();
        this.events.subscribe('ProfileData', (data) => {
            if (data) {
                this.user_id_login = data;
                this.storage.set('id', data);
            } else {
                this.user_id_login = '';
                this.storage.set('id', '');
                this.storage.set('user_id', '');
                this.storage.set('cart_count', '');
                this.storage.set('mobile', '');
                this.storage.set('email_address', '');
                this.storage.set('user_name', '');
                this.storage.set('first_name', "");
                this.storage.set('last_name', "");
                this.storage.set('address', '');
                this.storage.set('user_all_data', "");
            }
        });

        this.events.subscribe('Profileuser_name', (user_name) => {
            if (user_name) {
                this.user_login_name = user_name;
                this.storage.set('user_name', user_name);
            }
            else{
                this.user_login_name = '';
                this.storage.set('user_name', '');
            }
        });

        this.events.subscribe('Profileuser_pic', (user_pic) => {
            if (user_pic) {
                this.user_pic = user_pic;
                this.storage.set('Profileuser_pic', user_pic);
            }
            else{
                this.user_pic = '';
                this.storage.set('Profileuser_pic', '');
            }
        });
    }

    ngOnInit() {
        // this.get_total_cart_count("ngOnInit");
    }

    ionViewDidEnter()
    {
        // this.get_total_cart_count("ionViewDidEnter");
    }

    initializeApp() {

        this.platform.ready().then(() => {
            this.splashScreen.hide();
            this.fcm_initialize();
            // this.app_update_fcm_token();
            document.addEventListener("offline", onOffline, false);
            function onOffline() {
                // Handle the offline event
                alert("No Network connection !");
                navigator['app'].exitApp();
                // this.rest.noInternet('No Network connection');
            }
        });

        this.storage.get('id').then((val) => {
            if (val) {
                this.user_id_login = val;
            }
        });

        this.storage.get('Profileuser_pic').then((profile_user_pic) => {
            if (profile_user_pic) {
                this.user_pic = profile_user_pic;
            }
        });

        this.storage.get('user_name').then((user_name) => {
            if (user_name) {
                this.user_login_name = user_name;
            }
        });
    }

    fcm_initialize() {
        console.log("fcm_initialize");
        // if (this.platform.is('cordova')) {
        //     this.fcm.getToken().then((token: string) => {
        //         console.log("FCM getToken", token);
        //     });

        //     this.fcm.onTokenRefresh().subscribe(token => {
        //         console.log("FCM onTokenRefresh", token);
        //         this.storage.get('id').then((user_id) => {
        //             console.log('user id storage get', user_id);
        //             if (user_id) {
        //                 console.log('user id storage get2', user_id);
        //                 this.rest.GlobalPHit({ 'device_token': token, 'user_id': user_id }, 'Auth/updateuserdevicetoken').subscribe((result) => {
        //                     console.log("updateuserdevicetoken", result);
        //                 }, (err) => {
        //                     console.log(err);
        //                 });
        //             }
        //         });

        //     });

        //     this.fcm.onNotification().subscribe(data => {
        //         console.log("onNotification", data);
        //         if (data.wasTapped) {
        //             console.log('Received in background');
        //             //this.router.navigate([data.landing_page, data.price]);
        //         } else {
        //             console.log('Received in foreground');
        //             //this.router.navigate([data.landing_page, data.price]);
        //             this.localNotifications.schedule({
        //                 id: 1,
        //                 title: data.title,
        //                 text: data.body,
        //                 // icon: "http://modernbazaar.online/assets/images/favicon.ico",
        //                 sound: 'file://www/assets/tone/sound.mp3'
        //             });
        //         }
        //     });

        //     this.fcm.requestPushPermission();
        //     this.fcm.subscribeToTopic('offer');
        //     this.fcm.subscribeToTopic('app_update');
        //     this.fcm.subscribeToTopic('guest');
        // }
    }

    clickSub: any;
    unsub() {
        this.clickSub.unsubscribe();
    }

    initializeApp2() {
        // this.platform.ready().then(() => {
        //     this.fcm.subscribeToTopic('people');
        //     this.fcm.getToken().then(token => {
        //     });

        //     this.fcm.onNotification().subscribe(data => {
        //         // alert(JSON.stringify(data));
        //         if (data.wasTapped) {
        //             this.localNotifications.schedule({
        //                 id: 1,
        //                 // icon: "http://modernbazaar.online/assets/images/favicon.ico",
        //                 title: data.title,
        //                 text: data.body,
        //                 data: { mydata: data.body },
        //                 trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
        //                 foreground: true
        //             });
        //         } else {
        //             this.localNotifications.schedule({
        //                 id: 1,
        //                 // icon: "http://modernbazaar.online/assets/images/favicon.ico",
        //                 title: data.title,
        //                 text: data.body,
        //                 data: { mydata: data.body },
        //                 trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
        //                 foreground: true
        //             });
        //         }
        //     });

        //     this.fcm.onTokenRefresh().subscribe(token => { });

        //     this.fcm.unsubscribeFromTopic('marketing');
        // });
    }

    go_my_account() {
        this.navCtrl.navigateForward('/my-account');

    }

    category_page() {
        // alert(catid+" - "+type);
        if (this.b_id) {
            this.storage.set('cat_id', this.b_id);
            this.storage.set('c_type', 1);
            //  this.router.navigateByUrl('/subcategory');
            this.navCtrl.navigateForward(['/subcategory', { SbName: "Inhouse Products" }]);
        }
    }

    category_page_speciality() {
        // alert(catid+" - "+type);
        // this.storage.set('cat_id','285');
        if (this.sp_id) {
            this.storage.set('cat_id', this.sp_id);
            this.storage.set('c_type', 1);
            //this.router.navigateByUrl('/subcategory');
            this.navCtrl.navigateForward(['/subcategory', { SbName: "FNG Speciality" }]);
        }
    }

    offer(idg) {
        
        this.navCtrl.navigateForward(['/offers', { oofname: idg }]);

    }
    myOffer() {
            this.storage.set('c_type', 1);
            this.navCtrl.navigateForward(['/subcategory', { category_id: "359", title: "My Offers", c_type:1 }]);
    }

    mb_express() {
        // this.navCtrl.navigateForward(['/subcategory', { category_id: 343,title:'FNG Express',c_type:1 }]);
            this.storage.set('c_type', 1);
            this.navCtrl.navigateForward(['/subcategory', { category_id: "293", title: "FNG Express", c_type:1 }]);
    }

    goto_logout() {

        this.events.publish("ProfileData", '');
        this.events.publish("Profileuser_pic", '');
        this.events.publish("Profileuser_name", '');
        this.events.publish("cart_count", '');
        this.events.publish("cart_empty_update", '');
        this.navCtrl.navigateForward('/sign-in');
    }

    goto_prof() {
        this.navCtrl.navigateForward("/my-address");
    }

    go_to_submit353() {
        return false;
        var PData3 = {apikey: this.rest.APIKey};
        this.rest.GlobalPHit(PData3, 'User/get_popular_services').subscribe((result123) => {
            this.ServiceData35 = result123;
            // console.log(this.ServiceData35);
            if (this.ServiceData35.status == 1) {
                this.sp_id = this.ServiceData35.speciality;
                this.b_id = this.ServiceData35.brand;
            } else {
                //  this.ErrorAlert();
                //  this.spinner.hide()
            }
        }, (err) => {
            console.log(err);
        });
    }

    menuItemHandler(type = null) {
        // console.log("menuController", this.menuController);
        if (type == 'account') {
            this.showSubmenuMyAccount = !this.showSubmenuMyAccount;
        }
        else if (type == 'mb_product') {
            this.showSubmenuMbProduct = !this.showSubmenuMbProduct;
        }
        else if (type == 'contact') {
            this.showSubmenuContact = !this.showSubmenuContact;
        }
        else if (type == 'blog') {
            this.showSubmenuBlog = !this.showSubmenuBlog;
        }
    }
    
    menuClosed() {

        this.showSubmenuMyAccount = false;
        this.showSubmenuMbProduct = false;
        this.showSubmenuContact = false;
        this.showSubmenuBlog = false;
        
    }

}
