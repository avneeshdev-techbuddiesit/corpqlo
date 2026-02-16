import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController, Events } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.page.html',
    styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store_id: '', pin: '', otp: '', sessionotp: '' };
    public ServiceData;
    public ServiceData4;
    public ServiceData2;
    public PModel = { otp: '', pin: '', repin: '' };
    public RegenerateForm: boolean;
    public Pintext: boolean;
    public OpenFormbtn: boolean;
    public image_url = this.rest.cdn_upload_url;
    public ErrorMsgEnterOTP;
    public ErrorMsgEnterPIN;
    public ErrorMsgReEnterPIN;
    public wallet_add_money_status;
    public wallet_add_money_message;
    public wallet_add_money_status_class = '';

    constructor(
        private rest: RestService, 
        private navCtrl: NavController, 
        public storage: Storage, 
        public alertController: AlertController,
        public router: ActivatedRoute, 
        public events: Events
        ) {

        this.storage.set('otp', "");
        this.wallet_add_money_status = this.router.snapshot.paramMap.get('status');
        // this.wallet_add_money_status = 1;
        console.log("this.wallet_add_money_status", this.wallet_add_money_status);
        if (this.wallet_add_money_status == '1') {
            this.wallet_add_money_status_class = "success";
            this.wallet_add_money_message = "Amount added successfully";
        }
        else if (this.wallet_add_money_status == '0') {
            this.wallet_add_money_status_class = "error";
            this.wallet_add_money_message = "Amount could not be added";
        }
    }

    ngOnInit() {

    }

    ionViewWillEnter() {

        this.Pintext = true;
        this.OpenFormbtn = true;
        this.storage.get('id').then((val) => {
            this.PData.user_id = val;
            if (val != '' && val != null) {
                this.chekBlock()
            }
            this.GetLoad();
            this.get_home_page2();
        })
    }

    chekBlock() {
        this.storage.get('id').then((val) => {
            let key = {
                "user_id": val,
                "apikey": this.PData.apikey
            }
            this.rest.userBlock(key).subscribe((result) => { });
        });
    }

    GetLoad() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/User/my_wallet').subscribe((result) => {
            this.ServiceData = result;
            this.rest.dismiss();
            // console.log(this.ServiceData);
            if (this.ServiceData.status == 1) {
                
            } else {
                this.ErrorAlert();
            }
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    GetOTPOnSend() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/User/wallet_pin_otp').subscribe((result) => {
            this.ServiceData2 = result;
            // console.log(this.ServiceData2);
            this.rest.dismiss();
            if (this.ServiceData2.status == 1) {
                this.storage.set('otp', this.ServiceData2.otp);
                this.ErrorAlert3();
            } else {
                this.ErrorAlert2();
            }
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    async ErrorAlert3() {
        const alert = await this.alertController.create({
            message: "OTP send To Your Registered Mobile !",
            buttons: ['OK']
        });
        await alert.present();
    }

    OpenForm() {
        this.Pintext = false;
        this.OpenFormbtn = false;
        this.RegenerateForm = true;
    }

    GetGenerateNewPin() {
        if (this.PModel['sessionotp'] != this.PModel['otp']) {
            this.ErrorMsgEnterOTP = "Otp Doesn't match !";
        } if (this.PData.sessionotp == this.PModel['otp']) {
            // this.PData.otp = this.PModel['otp'];
            this.ErrorMsgEnterOTP = "";
        }
        if (!this.PModel['otp']) {
            this.ErrorMsgEnterOTP = "Otp required !"
        }
        if (!this.PModel['pin']) {
            this.ErrorMsgEnterPIN = "Pin required !"
        }
        if (!this.PModel['repin']) {
            this.ErrorMsgReEnterPIN = "Confirm Pin required !"
        }
        if (this.PModel['pin'] != this.PModel['repin']) {
            this.ErrorMsgReEnterPIN = "Pin and Confirm Pin Doesn't match !"
        }

        if (this.PModel['otp'] && this.PModel['pin'] && this.PData.sessionotp == this.PModel['otp'] && this.PModel['pin'] == this.PModel['repin']) {
            this.PData.pin = this.PModel['pin'];
            this.ErrorMsgReEnterPIN = "";
            this.rest.present();
            this.rest.GlobalPHit(this.PData, '/User/change_wallet_pin').subscribe((result) => {
                this.ServiceData = result;
                if (this.ServiceData.status == 1) {
                    this.rest.dismiss();
                    this.ErrorAlert();
                    this.CancelGetGeneratePin();
                    this.GetLoad();
                    this.storage.set('otp', "");
                } else {
                    this.ErrorAlert();
                    this.rest.dismiss();
                }
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        }
    }

    GoChange() {

        if (this.PModel['pin']) {
            this.ErrorMsgEnterPIN = "";
        }
        if (this.PModel['repin']) {
            this.ErrorMsgReEnterPIN = "";
        }

    }

    GoChangeOTP() {
        if (this.PModel['otp']) {
            // alert(this.PModel['otp'])
            this.ErrorMsgEnterOTP = "";
            this.PData.otp = this.PModel['otp'];
        }
        this.storage.get('otp').then((val) => {
            this.PData.sessionotp = val;
            // alert(val+this.PData.sessionotp)
        })
    }

    CancelGetGeneratePin() {
        this.RegenerateForm = false;
        this.Pintext = true;
        this.OpenFormbtn = true;
    }

    async ErrorAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

    async ErrorAlert2() {
        const alert = await this.alertController.create({
            message: this.ServiceData2['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

    GoAddMoney() {
        this.navCtrl.navigateForward('/wallet-addmoney');
    }

    get_home_page2() {
        // this.rest.present();
        // this.rest.present()
        this.PData.user_id = this.PData.user_id;
        this.rest.GlobalPHit(this.PData, 'User/my_profile').subscribe((result) => {
            this.ServiceData4 = result;
            // console.log(this.ServiceData4);
            //this.stats_bar =  this.ServiceData.completion_status_bar;
            // this.rest.dismiss(); 
            if (this.ServiceData4.status == 1) {
                if (this.ServiceData4.user_profile.status != 1) {
                    this.goto_logout();
                    //  this.ServiceData.user_profile.status
                }
            } else {
                // this.ErrorAlert4();
            }
        }, (err) => {
            // this.rest.dismiss();
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
        this.events.publish('ProfileData', "");
        this.events.publish('Profileuser_pic', "");
        this.events.publish('Profileuser_name', "");
        // this.navCtrl.navigateForward('/sign-in');
        this.navCtrl.navigateRoot('/home');
    }
}
