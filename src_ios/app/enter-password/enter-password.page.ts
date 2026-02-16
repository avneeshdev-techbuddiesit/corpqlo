import { Component, OnInit, Input } from '@angular/core';
import { AlertController, NavController, Events } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-enter-password',
    templateUrl: './enter-password.page.html',
    styleUrls: ['./enter-password.page.scss'],
})
export class EnterPasswordPage implements OnInit {
    @Input() PData = { apikey: this.rest.APIKey, pwd: '', mobile: '', username: '', user_id: '', store_id: '', last_name: '' };
    @Input() PDataGetStoreDetail = { apikey: this.rest.APIKey, user_id: '' };

    public ErrorPwd: any;
    public ServiceData;
    public ServiceGetStore;
    public Mrss;


    constructor(private rest: RestService, private navCtrl: NavController, private events: Events, public storage: Storage, public alertController: AlertController,
        public router: Router) { }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.PData.pwd = '';
        this.storage.get('mobile').then((val) => {
            this.PData.mobile = JSON.stringify(val);
            if (this.PData.mobile == '""') {
                this.navCtrl.navigateBack("/home");
            }
        });

        this.storage.get('username').then((val) => {
            if (val) {
                //alert();
                this.PData.username = val;
            }

        });

        this.storage.get('last_name').then((valsd) => {
            this.PData.last_name = valsd;
        });

        this.storage.get('user_id').then((val_id) => {
            this.PData.user_id = val_id;
            this.PDataGetStoreDetail.user_id = val_id;
            this.GetStoreID();
        });

        this.storage.get('gender').then((val_iddd) => {
            if (val_iddd) {
                if (val_iddd == "male") {
                    this.Mrss = 'Mr.';
                } if (val_iddd == "female") {

                    this.Mrss = 'Miss.';
                }
            }
        });
    }

    pwd_submit() {

        this.ErrorPwd = "";

        if (!this.PData.pwd) {
            this.ErrorSubmit();
        }

        else {
            this.rest.present()
            this.rest.GlobalPHit(this.PData, 'Auth/loginauth').subscribe((result) => {
                this.ServiceData = result;
                if (this.ServiceData.status == 1) {
                    this.PData.pwd = "";
                    this.storage.set('mobile', '');
                    this.PData.mobile = "";
                    this.storage.set('id', this.ServiceData.data.id);
                    this.storage.set('user_name', this.ServiceData.data.first_name + " " + this.ServiceData.data.last_name);
                    this.storage.set('city', this.ServiceData.data.city);
                    this.storage.set('country', this.ServiceData.data.country);
                    this.storage.set('phone', this.ServiceData.data.mobile);
                    this.storage.set('email_address', this.ServiceData.data.email_address);
                    // this.storage.set('address', this.ServiceData.data.address);
                    this.storage.set('address', this.ServiceData.user_pref_address);
                    this.storage.set('reloads', this.ServiceData.data.id);
                    if (this.ServiceData.status == 1) {
                        this.PData.mobile = "";
                        this.events.publish('ProfileData', this.ServiceData.data.id);
                        this.events.publish('Profileuser_pic', this.ServiceData.data.thumbnail);
                        this.events.publish('Profileuser_name', this.ServiceData.data.first_name + " " + this.ServiceData.data.last_name);

                        if (this.ServiceData.data2_set == "") {

                            this.navCtrl.navigateForward('/my-address');
                        }
                        if (!this.ServiceData.data_setpf && this.ServiceData.data2_set) {

                            this.navCtrl.navigateForward('/shopping-preferenes');

                        }
                        if (this.ServiceData.data_setpf && this.ServiceData.data2_set) {

                            this.navCtrl.navigateForward('/home');
                        }
                    }
                }
                if (this.ServiceData.status == 0) {

                    this.ErrorAlert();
                    
                }
                this.rest.dismiss();
            }, (err) => {
                this.rest.dismiss()
                console.log(err);
            });
        }
    }

    GetStoreID() {
        //this.rest.present();
        this.rest.GlobalPHit(this.PDataGetStoreDetail, '/User/get_store_id').subscribe((result) => {
            this.ServiceGetStore = result;
            if (this.ServiceGetStore.status == 1) {
                this.storage.set('storeID', this.ServiceGetStore['store_id']);
                this.PData.store_id = this.ServiceGetStore['store_id'];

                //this.rest.dismiss();
            }
            if (this.ServiceGetStore.status == 0) {

                //this.ErrorAlert();
                // this.rest.dismiss();
            }
        }, (err) => {
            console.log(err);
        });

    }



    route_back() {
        //this.navCtrl.pop();
        this.navCtrl.navigateBack("/sign-in");
    }
    async SuccessAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

    async ErrorAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

    ErrorSubmit() {
        this.ErrorPwd = "Password Field Is Required";
    }

    route_forgot() {
        this.navCtrl.navigateBack("/forgot-password");
    }


}
