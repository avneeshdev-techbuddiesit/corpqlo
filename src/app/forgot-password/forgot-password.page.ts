import { Component, OnInit, Input } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
    @Input() PData = { apikey: this.rest.APIKey, username: '' };

    public Errormsg: any;
    public ServiceData;

    constructor(
        private rest: RestService,
        private navCtrl: NavController,
        public storage: Storage,
        public alertController: AlertController,
        public router: Router
    ) {

    }

    ngOnInit() {


    }

    pwd_forgot() {

        if (!this.PData.username) {
            this.ErrorSubmit();
        }
        else {
            if (this.Errormsg == "") {
                this.rest.present();
                this.rest.GlobalPHit(this.PData, 'Auth/forgetPassword').subscribe((result) => {
                    this.ServiceData = result;
                    // console.log(this.ServiceData);
                    if (this.ServiceData.status == 1) {

                        this.rest.dismiss();
                        this.ErrorAlert();
                        this.navCtrl.navigateForward("/sign-in");
                    }
                    if (this.ServiceData.status == 0) {

                        this.ErrorAlert();
                        this.rest.dismiss();
                    }
                }, (err) => {
                    console.log(err);
                });
            }
        }
    }

    ChangeMobile() {

        var len = this.PData.username.toString().length;
        var eml = this.PData.username.includes("@");
        var eml2 = this.PData.username.includes(".");

        if (eml || eml2) {
            this.Errormsg = "";
            if (eml && eml2) {
                if (len < 5) {
                    this.ErrorSubmit2();

                }
            } else {
                this.ErrorSubmit2();
            }
        } else {
            if (len == 10) {
                this.Errormsg = "";
            }
            if (!this.PData.username || len < 10 || len > 10) {
                this.Errormsg = "Mobile number should be 10 number";
            }
        }
    }

    ErrorSubmit2() {
        this.Errormsg = "Please enter correct email";
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
        this.Errormsg = "This field is required";
    }

    route_back() {
        this.navCtrl.navigateBack("/enter-password");
    }
}
