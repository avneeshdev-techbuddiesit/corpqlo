import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.page.html',
    styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

    @Input() PData2 = { apikey: this.rest.APIKey, user_id: '', store_id: '', type: '1' };
    @Input() PData = { apikey: this.rest.APIKey, message: '', email: '', mobile_number: '', last_name: '', first_name: '', listStore: '' };

    public user_id: any;
    public ServiceData;
    public ErrorLName;
    public ErrorName;
    public ServiceData3;
    public ErrorMobile;
    public ErrorEmail;
    public ErrorMsg;
    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router) { }

    ngOnInit() {
        this.GetPreferenceListing2();
        this.storage.get('id').then((val) => {
            if (val != '' && val != null) {
                this.chekBlock()
            }
        })
    }

    chekBlock() {
        this.storage.get('id').then((val) => {
            let key = {
                "user_id": this.PData2.user_id,
                "apikey": this.PData2.apikey
            }
            this.rest.userBlock(key).subscribe((result) => { });
        });
    }

    GetPreferenceListing2() {
        this.rest.present();

        this.rest.GlobalPHit(this.PData2, '/User/order_type').subscribe((results) => {
            this.ServiceData3 = results;
            // console.log(this.ServiceData3);
            if (this.ServiceData3.status == 1) {

            } else {
                this.ErrorAlert();
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    ChangeName() {
        this.PData.first_name = this.PData.first_name.replace(/\s/g, "");
        if (this.PData.first_name) {
            this.ErrorName = "";
        }
        if (!this.PData.first_name) {
            this.ErrorName = "First Name Field Is Required";
        }
    }

    ChangeName2() {
        this.PData.last_name = this.PData.last_name.replace(/\s/g, "");
        if (this.PData.last_name) {
            this.ErrorLName = "";
        }
        if (!this.PData.last_name) {
            this.ErrorLName = "Last Name Field Is Required";
        }
    }

    ChangeMSg() {


        if (this.PData.message) {
            this.ErrorMsg = "";

        }
        if (!this.PData.message) {
            this.ErrorMsg = "Message Field Is Required";
        }
    }
    ChangeMobile() {
        //this.PData.mobile_number =  this.PData.mobile_number.replace(/\s/g, "");

        console.log("change--click--" + this.PData.mobile_number)
        if (this.PData.mobile_number.toString().length >= 10) {
            this.ErrorMobile = "";
        }
        if (!this.PData.mobile_number || this.PData.mobile_number.toString().length < 10) {
            this.ErrorMobile = "Mobile number should be 10 numbers";
        }
    }


    Submit() {
        //alert(this.PData.mobile_number);
        this.PData.email = this.PData.email.replace(/\s/g, "");
        this.PData.email = this.PData.email;
        this.ErrorName = "";
        this.ErrorLName = "";
        this.ErrorMobile = "";
        this.ErrorEmail = "";
        this.ErrorMsg = "";
        this.ChangeEmail3();
        //  this.PData.mobile_number =  this.PData.mobile_number.replace(/\s/g, "");

        this.PData.last_name = this.PData.last_name.replace(/\s/g, "");
        this.PData.first_name = this.PData.first_name.replace(/\s/g, "");
        var eml = this.PData.email.includes("@");
        var eml2 = this.PData.email.includes(".");
        // var eml3 = this.PData.email.includes(" ");
        var filter = "/^[w-.+]+@[a-zA-Z0-9.-]+.[a-zA-z0-9]{2,4}$/";

        if (!this.PData.first_name && !this.PData.mobile_number && !this.PData.email && !this.PData.last_name && !this.PData.message) {
            this.ErrorSubmit();
        }
        else if (!this.PData.first_name && !this.PData.mobile_number && !this.PData.email && !this.PData.last_name) {
            this.ErrorName = "First Name Field Is Required";
            this.ErrorLName = "Last Name Field Is Required";
            this.ErrorMobile = "Mobile number should be 10 numbers";
            this.ErrorEmail = "Email Eg: p@gmail.com";

        }
        else if (!this.PData.mobile_number && !this.PData.email && !this.PData.last_name && !this.PData.message) {
            this.ErrorLName = "Last Name Field Is Required";
            this.ErrorMobile = "Mobile number should be 10 numbers";
            this.ErrorEmail = "Email Eg: p@gmail.com";
            this.ErrorMsg = "Message Field Required !";
        }
        else if (!this.PData.first_name && !this.PData.mobile_number && !this.PData.email && !this.PData.message) {
            this.ErrorName = "First Name Field Is Required";
            this.ErrorEmail = "Email Eg: p@gmail.com";
            this.ErrorMobile = "Mobile number should be 10 numbers";
            this.ErrorMsg = "Message Field Required !";;

        }
        else if (!this.PData.first_name) {
            this.ErrorName = "First Name Field Is Required";
        }
        else if (!this.PData.last_name) {
            this.ErrorLName = "Last Name Field Is Required";
        }
        else if (!this.PData.mobile_number) {
            this.ChangeMobile();
            //this.ErrorMobile="Mobile Number Accept upto 10 digits";
        }
        else if (!this.PData.email) {
            this.ErrorEmail = "Email Eg: p@gmail.com";
        }
        else if (!eml || !eml2) {
            //  alert(eml +"-"+eml2 +"-"+eml3);
            this.ErrorEmail = "Please Enter a correct Email !";
        }
        else if (!this.PData.message) {
            this.ErrorMsg = "Message Field Required !";
        }
        else if (this.PData.mobile_number.toString().length < 10) {
            // alert(2);
            this.ErrorMobile = "Mobile number should be 10 numbers";
        }

        else {

            // alert(this.ErrorEmail);
            if (this.ErrorEmail == "") {

                this.ErrorEmail = "";
                this.rest.present()
                this.rest.GlobalPHit(this.PData, 'User/contact_us').subscribe((result) => {

                    this.ServiceData = result;
                    // console.log(this.ServiceData);
                    if (this.ServiceData.status == 1) {

                        this.SuccessAlert();
                        this.navCtrl.navigateBack("/home");
                    }
                    if (this.ServiceData.status == 0) {

                        this.ErrorAlert();

                    }
                    this.rest.dismiss()
                }, (err) => {
                    this.rest.dismiss()
                    console.log(err);
                });
            }
        }
    }

    ChangeEmail() {
        this.PData.email = this.PData.email.replace(/\s/g, "");
       
        if (this.PData.email) {
            this.ErrorEmail = "";
        }
        if (!this.PData.email) {
            this.ErrorEmail = "Email Eg: p@gmail.com";
        }
    }

    ChangeEmail3() {
        this.PData.email = this.PData.email.replace(/\s/g, "");
        

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
        this.ErrorName = "First Name Field Is Required";
        this.ErrorLName = "Last Name Field Is Required";
        this.ErrorMobile = "Mobile number should be 10 numbers";
        this.ErrorEmail = "Email Eg: p@gmail.com";
        this.ErrorMsg = "Message Field Required !";

    }

}
