import { Component, OnInit, Input } from '@angular/core';
import { AlertController, NavController, Events, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.page.html',
    styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

    public username;
    public userid;
    public ServiceData;
    public mobile;
    public address;
    public password;
    public last_name;
    public first_name;
    public thumnails;
    public gender = '-';
    public email;
    public dob = '-';
    public stats_bar = 0;

    @Input() PData = { apikey: this.rest.APIKey, user_id: '' };
    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router, private events: Events, private platform: Platform
    ) {

        platform.ready().then(() => {
            this.platform.backButton.subscribe(() => {
                //alert(this.router.url);
                if (this.router.url == "/my-account") {
                    // this.presentConfirm(); 
                    this.navCtrl.navigateRoot("/home");
                }
            })
        });
    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.storage.get('id').then((ival) => {
            this.userid = ival;
            if (ival != '' && ival != null) {
                this.chekBlock()
                this.get_home_page();
            }
            else {
                this.navCtrl.navigateRoot("/sign-in");
            }
        });

        this.storage.get('username').then((val) => {
            this.username = JSON.stringify(val);
        });
    }

    chekBlock() {
        this.storage.get('id').then((val) => {
            let key = {
                "user_id": this.userid,
                "apikey": this.PData.apikey
            }
            this.rest.userBlock(key).subscribe((result) => { });
        });
    }

    get_home_page() {

        this.rest.present()
        this.PData.user_id = this.userid;
        this.rest.GlobalPHit(this.PData, 'User/my_profile').subscribe((result) => {
            this.ServiceData = result;
            // console.log(this.ServiceData);

            this.stats_bar = this.ServiceData.completion_status_bar;
            if (this.ServiceData.status == 1) {

                if (this.ServiceData.user_profile.status != 1 || this.ServiceData.user_profile.is_blocked != 1) {
                    this.goto_logout();
                    //  this.ServiceData.user_profile.status
                } else {
                    this.userid = this.ServiceData.user_profile.id;
                    this.username = this.ServiceData.user_profile.user_name;
                    this.mobile = this.ServiceData.user_profile.mobile;
                    this.email = this.ServiceData.user_profile.email_address;
                    this.address = this.ServiceData.user_profile.address;
                    this.gender = this.ServiceData.user_profile.gender;
                    this.dob = this.ServiceData.user_profile.user_dob;
                    this.first_name = this.ServiceData.user_profile.first_name;
                    this.last_name = this.ServiceData.user_profile.last_name;
                    this.thumnails = this.ServiceData.user_profile.thumnail;
                    this.password = this.ServiceData.user_profile.password;
                    this.events.publish('Profileuser_pic', this.thumnails);
                }
            } else {
                this.ErrorAlert();
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    goto_logout() {
        this.storage.set('mobile', '');
        //this.user_id_login = "";
        //this.PData.mobile="";
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
        // this.navCtrl.navigateForward('/sign-in');
        this.navCtrl.navigateRoot('/home');
    }

    async ErrorAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

    goto_profile(type) {
        this.navCtrl.navigateForward(['/edit-profile', { types: type }]);
    }

    route_user(param)
    {
        if(param)
        {
            this.navCtrl.navigateForward([param]);

        }
    }

    edit_email(type) {
        this.navCtrl.navigateForward(['/edit-profile', { types: type }]);
    }

    edit_mobile(type) {
        this.navCtrl.navigateForward(['/edit-profile', { types: type }]);
    }

    got_to(type_p) {
        if (type_p) {

            this.navCtrl.navigateForward(['/change-password', { type: 1 }]);
        } else {
            this.navCtrl.navigateForward(['/change-password', { type: 0 }]);
        }

    }

}
