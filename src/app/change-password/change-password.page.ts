import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.page.html',
    styleUrls: ['./change-password.page.scss'],
})

export class ChangePasswordPage implements OnInit {

    @Input() PData = {
        apikey: this.rest.APIKey, user_id: '', old_password: '', type: '',
        new_password: '',
        confirm_password: ''
    };

    public username;
    public userid;
    public ServiceData;
    public ErrorOpwd;
    public ErrorNpwd;
    public ErrorCpwd;
    public storeID;

    constructor(
        private rest: RestService,
        private navCtrl: NavController,
        public storage: Storage, public alertController: AlertController,
        public router: Router,
        public router2: ActivatedRoute,

    ) {

        this.PData.type = this.router2.snapshot.paramMap.get('type');
        if(!this.PData.type)
        {
            this.PData.type = '1';
        }
    }

    ngOnInit() {
        this.storage.get('id').then((ival) => {
            this.userid = ival;
            // this.get_confirm_page();
        });
        this.storage.get('storeID').then((storeID) => { this.storeID = storeID })
        this.storage.get('username').then((val) => {
            this.username = JSON.stringify(val);
        });
    }


    Changenpwd() {

        this.PData.new_password = this.PData.new_password.replace(/\s/g, "");
        if (this.PData.new_password.length >= 6) {
            this.ErrorNpwd = "";
        }
        if (!this.PData.new_password) {

            this.ErrorNpwd = "New Password Field Is Required";
        }
        if (this.PData.new_password.length < 6) {

            this.ErrorNpwd = "New password mustbe 6 digit or greater then 6 digit !";
        }
    }

    Changencwd() {
        this.PData.confirm_password = this.PData.confirm_password.replace(/\s/g, "");
        if (this.PData.confirm_password.length >= 6) {
            this.ErrorCpwd = "";
        }

        if (!this.PData.confirm_password) {
            this.ErrorCpwd = "New Password Field Is Required";
        }
        if (this.PData.confirm_password.length < 6) {
            this.ErrorCpwd = "Confirm password mustbe 6 digit or greater then 6 digit !";
        }
    }

    get_confirm_page() {

        this.PData.confirm_password = this.PData.confirm_password.replace(/\s/g, "");
        this.PData.new_password = this.PData.new_password.replace(/\s/g, "");

        if (!this.PData.old_password && !this.PData.new_password && !this.PData.confirm_password) {
            this.ErrorSubmit();
        }
        else if (!this.PData.old_password && !this.PData.new_password) {
            this.ErrorOpwd = "Current Password Field Is Required";
            this.ErrorNpwd = "New Password Field Is Required";
            this.ErrorCpwd = "";
        }
        else if (!this.PData.confirm_password && !this.PData.new_password) {
            this.ErrorNpwd = "New Password Field Is Required";
            this.ErrorCpwd = "Confirm Password Field Is Required";
            this.ErrorOpwd = "";
        }
        else if (!this.PData.confirm_password && !this.PData.old_password) {

            this.ErrorOpwd = "Current Password Field Is Required";
            this.ErrorCpwd = "Confirm Password Field Is Required";
            this.ErrorNpwd = "";

        }
        else if (!this.PData.old_password) {
            this.ErrorOpwd = "Current Password Field Is Required";
            this.ErrorNpwd = "";
            this.ErrorCpwd = "";
        }
        else if (!this.PData.new_password) {
            this.ErrorNpwd = "New Password Field Is Required";
            this.ErrorOpwd = "";
            this.ErrorCpwd = "";
        }
        else if (!this.PData.confirm_password) {
            this.ErrorCpwd = "Confirm Password Field Is Required";
            this.ErrorOpwd = "";
            this.ErrorNpwd = "";
        } else if (this.PData.confirm_password.length < 6) {
            this.ErrorCpwd = "Confirm Password must be 6 digit or greater then 6 digit !";

        }
        else if (this.PData.new_password.length < 6) {
            this.ErrorNpwd = "New Password must be 6 digit or greater then 6 digit !";

        }
        else {
            this.ErrorOpwd = "";
            this.ErrorNpwd = "";
            this.ErrorCpwd = "";

            this.rest.present();
            this.PData.user_id = this.userid;
            this.rest.GlobalPHit(this.PData, 'User/change_password').subscribe((result) => {
                this.ServiceData = result;
                // console.log(this.ServiceData);
                if (this.ServiceData.status == 1) {
                    this.rest.dismiss();
                    //this.navCtrl.navigateBack("/my-account");
                    this.navCtrl.navigateBack("/my-account");
                    this.SuccessAlert();

                } else {
                    this.ErrorAlert();
                    this.rest.dismiss()
                }
            }, (err) => {
                console.log(err);
            });
        }
    }

    ErrorSubmit() {
        this.ErrorOpwd = "Current Password Field Is Required";
        this.ErrorNpwd = "New Password Field Is Required";
        this.ErrorCpwd = "Confirm Password Field Is Required";

    }

    async ErrorAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

    async SuccessAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: [{
                text: "OK",
                handler: () => {
                }
            }]
        });
        await alert.present();
    }

    get_confirm_page2() {
       
        this.ErrorOpwd = "";
        this.PData.confirm_password = this.PData.confirm_password.replace(/\s/g, "");
        this.PData.new_password = this.PData.new_password.replace(/\s/g, "");


        if (!this.PData.new_password && !this.PData.confirm_password) {
            this.ErrorNpwd = "New Password Field Is Required";
            this.ErrorCpwd = "Confirm Password Field Is Required";
        }
        else if (!this.PData.new_password) {

            this.ErrorNpwd = "New Password Field Is Required";
            this.ErrorCpwd = "";
        }

        else if (!this.PData.confirm_password) {

            // this.ErrorOpwd="Current Password Field Is Required";
            this.ErrorCpwd = "Confirm Password Field Is Required";
            this.ErrorNpwd = "";
        }

        else if (this.PData.confirm_password.length < 6) {
            this.ErrorCpwd = "Confirm Password must be 6 digit or greater then 6 digit !";

        }

        else if (this.PData.new_password.length < 6) {
            this.ErrorNpwd = "New Password must be 6 digit or greater then 6 digit !";
        }

        else {
            this.ErrorOpwd = "";
            this.ErrorNpwd = "";
            this.ErrorCpwd = "";
            this.rest.present()
            this.PData.user_id = this.userid;
            this.rest.GlobalPHit(this.PData, 'User/change_password').subscribe((result) => {
                this.ServiceData = result;
                // console.log(this.ServiceData);
                if (this.ServiceData.status == 1) {
                   this.rest.dismiss();
                    this.navCtrl.navigateBack("/my-account");
                    this.SuccessAlert();

                } else {
                    this.ErrorAlert();
                    this.rest.dismiss()
                }
            }, (err) => {
                console.log(err);
            });
        }
    }






    route_back() {
        this.navCtrl.pop();
    }
}
