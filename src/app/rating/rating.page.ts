import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.page.html',
    styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {

    @Input() PData: any = { apikey: this.rest.APIKey, user_id: '', store_id: '', order_id: '', message: '', description: '', count: 0 };
    public PModel = {};
    public ServiceData;
    public ServiceData2;
    public ErrorDescription;
    public number = 0;
    public number_original = 0;
    public items;
    public items2;
    public rating_title:any = '';

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: ActivatedRoute) { }

    ngOnInit() {
        this.PData.order_id = this.router.snapshot.paramMap.get('orderID');
        this.storage.get('id').then((userid) => {
            this.PData.user_id = userid;
            if (userid != '' && userid != null) {
                this.chekBlock()
            }

            this.storage.get('storeID').then((storeID) => {
                this.PData.store_id = storeID;
                // this.PData['ProductIssue']="1";
                // this.CheckDiliveryBoyOrNot();
            });
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

    ionViewWillEnter() {

        this.get_rateing();
    }

    createRange(number, nmber_original) {

        // console.log("number", number);
        
        this.number_original = Number(nmber_original) + Number(number);
        //alert( this.number_original);
        this.items = [];
        this.items2 = [];
        for (var i = 1; i <= this.number_original; i++) {
            this.items.push(i);
        }

        for (var y = 1; y <= (5 - this.number_original); y++) {
            this.items2.push(y);
        }
        if(this.items && this.items.length == 1)
        {
            this.rating_title = 'Bad';
        }
        else if(this.items && this.items.length == 2)
        {
            this.rating_title = 'Ok';
        }
        else if(this.items && this.items.length == 3)
        {
            this.rating_title = 'Good';
        }
        else if(this.items && this.items.length == 4)
        {
            this.rating_title = 'Very Good';
        }
        else if(this.items && this.items.length == 5)
        {
            this.rating_title = 'Awesome';
        }
        //return items;
    }

    get_rateing() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'User/get_rating_review').subscribe((result) => {
            this.ServiceData2 = result;
            if (this.ServiceData2.status == 1) {
                if (this.ServiceData2.data.rating) {
                    //  this.number_original=this.ServiceData2.data.rating;
                    this.createRange(this.ServiceData2.data.rating, 0);
                    this.PData.description = this.ServiceData2.data.rating_review;
                } else {
                    this.createRange(0, 0);
                }
                //   this.ErrorAlert();
                // this.ConfirmAlert();
                this.rest.dismiss();
            } else {
                this.createRange(0, 0);
                this.ErrorAlert();
                this.rest.dismiss();
            }
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    ThreadSubmit() {
        this.PData['description'] = $("#comment_review").val();
        // alert(this.PData['description']);
        if (!this.PData['description']) {
            // this.ErrorDescription = "Description must be required";
        } if (this.number_original == 0) {
            this.ErrorAlert2();
        }

        if (this.number_original != 0) {
            // if(this.PData['description'] && this.number_original!=0){
            this.PData.message = this.PData['description'];
            this.PData.count = this.number_original;
            this.rest.present();
            this.rest.GlobalPHit(this.PData, 'User/rating_review').subscribe((result) => {
                this.ServiceData = result;
                if (this.ServiceData.status == 1) {
                    this.ErrorAlert();
                    // this.ConfirmAlert();
                    this.rest.dismiss();
                    this.navCtrl.pop();
                    // this.navCtrl.navigateForward(['/order-detail',{orderID:this.PData.order_id }]);
                } else {
                    this.ErrorAlert();
                    this.rest.dismiss();
                }
            }, (err) => {
                console.log(err);
            });
        }
    }

    async ErrorAlert2() {
        const alert = await this.alertController.create({
            message: "Please Select Rating !",
            buttons: ['OK']
        });
        await alert.present();
    }

    Cancel(orderID) {
        this.navCtrl.navigateForward(['/order-detail', { orderID: orderID }]);
    }

    async ErrorAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

}
