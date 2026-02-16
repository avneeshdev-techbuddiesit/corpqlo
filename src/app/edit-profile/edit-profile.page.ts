import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController, Events } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import * as $ from 'jquery';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NgxSpinnerService } from "ngx-spinner";
import { ElementRef } from '@angular/core';
interface HTMLElementTagNameMap {
    name2: any;
    "input": HTMLInputElement;
}

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.page.html',
    styleUrls: ['./edit-profile.page.scss'],
})


export class EditProfilePage implements OnInit {

    public username;
    public userid;
    public ServiceData;

    public mobile;
    public address;
    public gender;
    public email;
    public dob;
    public ErrorLName;
    public ErrorName;
    public maritals;
    public kids_name = [];
    public kids_dob = [];
    //  public name2:any;
    public Erroruser_dob;
    public ErrorAnnDOb;
    public ErrorSpouse;
    public ErrorMobile;
    public ErrorEmail;
    public types;


    @Input() PData = {
        apikey: this.rest.APIKey, user_id: '', marital_status: '', first_name: '', kids_name: '', kids_name_new: '',
        last_name: '', mobile: '', email_address: '', gender: '', user_dob: '', anniversary_date: '', spouse_dob: '', no_of_kids: '', kids_dob: '', kids_dob_new: ''
    };
    @Input() PData2 = { apikey: this.rest.APIKey, user_id: '' };

    @Input() PData3 = { apikey: this.rest.APIKey, user_id: '', type: '', email_address: '', mobile: '' };

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: ActivatedRoute, private statusBar: StatusBar, private events: Events, private spinner: NgxSpinnerService,
    ) {

        this.types = this.router.snapshot.paramMap.get('types');
    }

    ngOnInit() {
        this.storage.get('id').then((ival) => {
            this.userid = ival;
            this.PData.user_id = this.userid;
            this.get_home_page();
        });

        this.storage.get('username').then((val) => {
            this.username = JSON.stringify(val);
        });
    }


    get_home_page() {

        // this.rest.present()
        this.rest.present()

        this.PData2.user_id = this.userid;
        this.rest.GlobalPHit(this.PData2, 'User/my_profile').subscribe((result) => {
            this.ServiceData = result;
            this.rest.dismiss();
            console.log(this.ServiceData);
            if (this.ServiceData.status == 1) {
                

                this.userid = this.ServiceData.user_profile.id;
                this.PData.first_name = this.username = this.ServiceData.user_profile.first_name;
                this.PData.last_name = this.username = this.ServiceData.user_profile.last_name;
                this.PData.mobile = this.mobile = this.ServiceData.user_profile.mobile;
                this.PData.email_address = this.email = this.ServiceData.user_profile.email_address;


                this.address = this.ServiceData.user_profile.address;

                this.PData.user_dob = this.dob = this.ServiceData.user_profile.new_user_dob;

                this.PData.spouse_dob = this.dob = this.ServiceData.user_profile.new_spouse_dob;

                this.PData.anniversary_date = this.dob = this.ServiceData.user_profile.new_anniversary_date;


                this.kids_name = this.ServiceData.user_profile.kids_name;
                this.kids_dob = this.ServiceData.user_profile.kids_dob;

                if (this.ServiceData.user_profile.gender) {
                    this.PData.gender = this.gender = this.ServiceData.user_profile.gender;
                } else {
                    this.PData.gender = this.gender = "";
                }

                //alert( this.PData.gender);

                if (this.ServiceData.user_profile.marital_status == 'yes') {
                    this.PData.marital_status = this.maritals = this.ServiceData.user_profile.marital_status;
                    // $("#mariatls").css("display","none");
                } else if (this.ServiceData.user_profile.marital_status == 'no') {
                    this.PData.marital_status = this.maritals = this.ServiceData.user_profile.marital_status;
                    // $("#mariatls").css("display","none");
                } else {
                    this.PData.marital_status = this.maritals = "no";
                    //$("#mariatls").css("display","none");

                }

                if (this.ServiceData.user_profile.no_of_kids) {
                    this.PData.no_of_kids = this.ServiceData.user_profile.no_of_kids;
                } else {
                    this.PData.no_of_kids = "";
                }
                //  alert(this.PData.marital);

            } else {
                this.ErrorAlert();
                this.rest.dismiss();
            }
        }, (err) => {
            console.log(err);
        });
    }

    async ErrorAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }


    ChangeName() {

        if (this.PData.first_name) {
            this.ErrorName = "";
        }
        if (!this.PData.first_name) {
            this.ErrorName = "First Name Field Is Required";
        }
    }

    ChangeName2() {

        if (this.PData.last_name) {
            this.ErrorLName = "";
        }
        if (!this.PData.last_name) {
            this.ErrorLName = "Last Name Field Is Required";
        }
    }

    Submit() {
        var z = 0;

        $(".error2").text("");
        this.ErrorSpouse = "";
        this.ErrorAnnDOb = "";
        this.ErrorName = "";
        this.ErrorLName = "";
        this.Erroruser_dob = "";

        // $(".error2").text("");
        var kids_names;
        var kids_dobs;

        if (this.PData.marital_status == 'yes') {
            //alert(this.PData.anniversary_date)

            if (!this.PData.anniversary_date || this.PData.anniversary_date == "0000-00-00" || this.PData.anniversary_date == "") {
                z = 1;
                this.ErrorAnnDOb = "Anniversary Field Is Required";
            }


            if (!this.PData.spouse_dob || this.PData.spouse_dob == "0000-00-00" || this.PData.spouse_dob == "") {
                z = 1;
                this.ErrorSpouse = "Spouse DOB Field Is Required";
            }
            this.PData.kids_name_new = kids_names;
            this.PData.kids_dob_new = kids_dobs;
        }


        if (!this.PData.first_name) {
            z = 1;
            this.ErrorName = "First Name Field Is Required";
        }
        if (!this.PData.last_name) {
            z = 1;
            this.ErrorLName = "Last Name Field Is Required";
        }

        if (!this.PData.user_dob) {
            z = 1;
            this.Erroruser_dob = "DOB Field Is Required";
        }

        if (z == 0) {
            //   console.log(this.PData);
            if (this.PData.marital_status == 'no') {
                this.PData.kids_name_new = "";
                this.PData.kids_dob_new = "";
                this.PData.anniversary_date = "";
                this.PData.spouse_dob = "";
            }
            this.rest.present();
            this.rest.GlobalPHit(this.PData, 'User/edit_profile').subscribe((result) => {
                this.rest.dismiss();
                this.ServiceData = result;
                console.log(this.ServiceData);
                if (this.ServiceData.status == 1) {
                    
                    this.storage.set('user_name', this.PData.first_name + " " + this.PData.last_name);
                    this.events.publish('Profileuser_name', this.PData.first_name + " " + this.PData.last_name);


                    this.SuccessAlert();
                    this.navCtrl.navigateBack("/my-account");
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

    async SuccessAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }


    kids: any[] = [1];

    onAdd() {
        // alert(this.kids);
        this.kids.push(this.kids)
    }

    onAdd2() {
        //alert(this.kids_name);
        this.kids_name.push(' ');
    }
    onDelete2(i) {
        console.log(i);
        this.kids_name.splice(i, 1)
    }

    onDelete(i) {
        console.log(i);
        this.kids.splice(i, 1)
    }

    optionsFn() {
        if (this.PData.marital_status == 'yes') {

            $("#mariatls").css("display", "block");

        }
        if (this.PData.marital_status == 'no') {
            $("#mariatls").css("display", "none");
        }
    }

    changeemail23() {
        var t = 0;
        this.PData.email_address = this.PData.email_address.replace(/\s/g, "");
        if (!this.PData.email_address) {
            t = 1;
            this.ErrorEmail = "Email Eg: p@gmail.com";
        }
        if (t == 0) {
            this.rest.present();
            this.PData3.email_address = this.PData.email_address;
            this.PData3.user_id = this.PData.user_id;
            this.PData3.type = '1';
            this.rest.GlobalPHit(this.PData3, 'User/edit_otp').subscribe((result) => {
                this.ServiceData = result;
                console.log(this.ServiceData.otp);
                if (this.ServiceData.status == 1) {
                    this.rest.dismiss();//  this.rest.dismiss();
                    this.storage.set('otp_new', this.ServiceData.otp);
                    this.storage.set('email_address', this.ServiceData.email_address);
                    this.navCtrl.navigateForward(['/otp', { OTP: this.ServiceData.otp, email_address: this.ServiceData.email_address, mobile: this.ServiceData.mobile }]);
                    this.SuccessAlert();
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

    changemobile23() {
        var m = 0;
        if (!this.PData.mobile || this.PData.mobile.toString().length < 10) {

            m = 1;
            this.ErrorMobile = "Mobile number should be 10 Digits";
        }
        if (!this.PData.mobile) {
            m = 1;
            this.ErrorMobile = "Mobile number should be 10 Digits";
        }
        if (this.PData.mobile.toString().length > 10) {

            m = 1;
            this.ErrorMobile = "Mobile number should not be more than 10 digits.";
        }
        if (m == 0) {
            this.rest.present();
            this.PData3.mobile = this.PData.mobile;
            this.PData3.user_id = this.PData.user_id;
            this.PData3.type = '2';
            this.rest.GlobalPHit(this.PData3, 'User/edit_otp').subscribe((result) => {
                this.ServiceData = result;
                // console.log(this.ServiceData);
                if (this.ServiceData.status == 1) {
                    this.rest.dismiss();
                    this.storage.set('otp_new', this.ServiceData.otp);
                    this.storage.set('mobile', this.ServiceData.mobile);
                    this.navCtrl.navigateForward(['/otp', { OTP: this.ServiceData.otp, email_address: this.ServiceData.email_address, mobile: this.ServiceData.mobile }]);
                    this.SuccessAlert();
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
    keyPressAlbet1(event) {
        let message = this.PData.first_name;;
        let letterMessage = message.replace(/[^a-zA-Z\s]/gm,"");
        this.PData.first_name = letterMessage;
      }
      keyPressAlbet(event) {
        let message = this.PData.last_name;;
        let letterMessage = message.replace(/[^a-zA-Z\s]/gm,"");
        this.PData.last_name = letterMessage;
      }

}
