import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController, Events, Platform } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-otp',
    templateUrl: './otp.page.html',
    styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
    @Input() PData = { apikey: this.rest.APIKey, user_id: '', type: '', email_address: '', mobile: '', send_otp: '', otp: '', };
    @Input() Cal = { otp1: '', otp2: '', otp3: '', otp4: '' };

    public otp2;
    public otp3;
    public otp4;
    public userid;
    public ServiceData;
    public ErrorOTP = "";

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router, public router2: ActivatedRoute, private events: Events, public platform: Platform) {

        this.PData.send_otp = this.router2.snapshot.paramMap.get('OTP');
        this.PData.mobile = this.router2.snapshot.paramMap.get('mobile');
        this.PData.email_address = this.router2.snapshot.paramMap.get('email_address');

        if (this.PData.email_address == 'undefined') {
            this.PData.email_address = '';
        }
        if (this.PData.mobile == 'undefined') {
            this.PData.mobile = '';
        }

        if (this.PData.email_address) {
            this.PData.type = '1';
        }
        if (this.PData.mobile) {
            this.PData.type = '2';
        }

        platform.ready().then(() => {
            this.platform.backButton.subscribe(() => {
                //  alert(this.router.url);
                if (this.router.url == "/otp") {
                    // this.presentConfirm(); 
                    this.navCtrl.navigateBack("/my-account");
                }
            })
        });
    }

    ngOnInit() {
        $('.otp > input').keyup(function () {
            var abc = $(this).val().toString().replace(/[^0-9]/g, '');
            $(this).val(abc);

            if ($(this).val() == $(this).attr("maxlength")) {
                $(this).next().focus();
            }
            else {
                $(this).prev().focus();
            }
        });

        this.storage.get('id').then((ival) => {
            this.userid = ival;
            if (ival != '' && ival != null) {
                this.chekBlock()
            }
            if (ival) {
                this.PData.user_id = this.userid;
            }
        });

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

    route_back() {
        this.navCtrl.navigateForward("/my-account");
    }

    send_otp2() {

        this.ErrorOTP = "";
        this.PData.otp = this.Cal.otp1.toString() + this.Cal.otp2.toString() + this.Cal.otp3.toString() + this.Cal.otp4.toString();
        console.log(this.PData.otp + '-->' + this.PData.otp.toString());
        if (!this.PData.otp || this.PData.otp.toString().length < 4) {
            this.ErrorSubmit();
        }
        if (this.PData.otp.toString().length == 4) {
            this.ErrorSubmitClear();

            this.rest.present();
            this.PData.email_address = this.PData.email_address;

            this.rest.GlobalPHit(this.PData, 'User/otp_verification').subscribe((result) => {
                this.ServiceData = result;
                if (this.ServiceData.status == 1) {
                    this.ErrorAlert();
                    this.navCtrl.navigateBack("/my-account");
                }
                if (this.ServiceData.status == 0) {

                    this.ErrorAlert();
                }
                this.rest.dismiss();
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        }
    }

    async ErrorAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

    changeOTP() {
        if (this.PData.otp == '4') {
            this.ErrorOTP = "";
        }
    }

    ErrorSubmit() {
        this.ErrorOTP = 'OTP field is required!';
    }

    ErrorSubmitClear() {
        this.ErrorOTP = "";
    }
    
    next(el: { setFocus: () => void; }) {
        el.setFocus();
    }

}
