import { Component, OnInit, Input } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { RestService } from '../rest.service';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.page.html',
    styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

    @Input() PData = { apikey: this.rest.APIKey, first_name: '', last_name: '', user_email: '', user_mobile: '', password:'', cpassword:'',  referral_code: '' };

    public ErrorName;
    public ErrorLName;
    public ErrorMobile;
    public ErrorEmail;
    public ErrorPassword;
    public ErrorCPassword;
    public Code;
    public Msg;

    constructor(
        private navCtrl: NavController,
        public rest: RestService, 
        private storage: Storage,
        public alertController: AlertController
        ) { }

    ngOnInit() {
        
    }

    ionViewWillEnter() {
        this.storage.get('user_id').then(save_user_id => {
            if(save_user_id && save_user_id != "")
            {
                this.navCtrl.navigateForward('/home');
            }
        })
    }

    ChangeName() {

        this.ErrorName = "";
        if (this.PData.first_name) {
            this.ErrorName = "";
        }
        else{
            this.ErrorName = "First name is required";
        }
    }

    ChangeName2() {
        this.ErrorLName = "";
        if (this.PData.last_name) {
            this.ErrorLName = "";
        }
        if (!this.PData.last_name) {
            this.ErrorLName = "Last name is required";
        }
    }

    ChangeEmail() {

        this.PData.user_email = this.PData.user_email.replace(/\s/g, "");
        var eml = this.PData.user_email.includes("@");
        var eml2 = this.PData.user_email.includes(".");
        if (!this.PData.user_email) {
            this.ErrorEmail = "Enter valid email";
        }
        else if (!eml || !eml2) {
            this.ErrorEmail = "Enter valid email";
        }
        else{
            this.ErrorEmail = "";
        }
    }

    ChangeMobile() {
       
        this.ErrorMobile = "";
        if (!this.PData.user_mobile) {
            this.ErrorMobile = "Mobile number required";
        }
        else{
            this.ErrorMobile = "";
        }
        
    }

    ChangePassword() {
       
        this.ErrorPassword = "";
        if (this.PData.password.toString().length > 5) {
            this.ErrorPassword = "";
        }
        else if (!this.PData.password || this.PData.password.toString().length < 6) {
            this.ErrorPassword = "Password should be more than 6";
        }
    }

    ChangeCPassword() {
       
        this.ErrorCPassword = "";
        if (this.PData.password != this.PData.cpassword) {
            this.ErrorCPassword = "Confirm password must be same as password";
        }
        else{
            this.ErrorCPassword = "";
        }
    }

    Submit() {

        this.ErrorName = "";
        this.ErrorLName = "";
        this.ErrorMobile = "";
        this.ErrorEmail = "";
        this.ErrorPassword = "";
        this.ErrorCPassword = "";
        var flag = 0;

        if (!this.PData.first_name) {
            flag++;
            this.ErrorName = "First name is required";
        }
        if (!this.PData.last_name) {
            flag++;
            this.ErrorLName = "Last name is required";
        }
        var eml = this.PData.user_email.includes("@");
        var eml2 = this.PData.user_email.includes(".");

        if (!this.PData.user_email) {
            flag++;
            this.ErrorEmail = "Email required";
        }
        else if (!eml || !eml2) {
            flag++;
            this.ErrorEmail = "Enter valid email";
        }
        if (!this.PData.user_mobile) {

            flag++;
            this.ErrorMobile = "Mobile number required";
        }
        // if (!this.PData.user_mobile) {
        //     flag++;
        //     this.ErrorMobile = "Mobile number should be 10 digit";
        // }
        // if (this.PData.user_mobile.toString().length > 10) {
        //     flag++;
        //     this.ErrorMobile = "Mobile number should not be more than 10 digit.";
        // }
        if (!this.PData.password) {
            flag++;
            this.ErrorPassword = "Password is required";
        }
        if (!this.PData.cpassword) {
            flag++;
            this.ErrorCPassword = "Confirm password is required";
        }
        if (this.PData.cpassword != this.PData.cpassword) {
            flag++;
            this.ErrorCPassword = "Password should be more than 6";
        }
        if (flag == 0) {

            this.rest.present();
            this.rest.GlobalPHit(this.PData, 'Auth/signup').subscribe((result) => {
                if (result.status == 1) {
                   this.rest.dismiss();
                    this.rest.presentToastTop(result.message);
                    this.navCtrl.navigateBack("/sign-in");
                }
               else {
                    this.rest.showAlert(result.message);
                   this.rest.dismiss();
                }
            }, (err) => {
                console.log(err);
            });
        }
    }

    ErrorSubmit() {
        this.ErrorName = "First name field is required";
        this.ErrorLName = "Last name field is required";
        this.ErrorMobile = "Mobile number should be 10 number";
        this.ErrorPassword = "Password reuired";
        this.ErrorCPassword = "Confirm password reuired";
        this.ErrorEmail = "Email Eg: username@example.com";

    }
    
    ErrorSubmitClear() {
        this.ErrorName = "";
        this.ErrorLName = "";
        this.ErrorMobile = "";
        this.ErrorEmail = "";
    }

}
