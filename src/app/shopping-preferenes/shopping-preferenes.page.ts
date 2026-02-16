import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-shopping-preferenes',
    templateUrl: './shopping-preferenes.page.html',
    styleUrls: ['./shopping-preferenes.page.scss'],
})
export class ShoppingPreferenesPage implements OnInit {
    public PModel = {};
    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store_id: '', type: '' };
    @Input() PDataGetStoreDetail = { apikey: this.rest.APIKey, user_id: '' };
    @Input() PDataSet = { apikey: this.rest.APIKey, user_id: '', store_id: '', address_id: '', catPref: '', Day: '', Time: '', order_type: '', order_preference_store: '', order_preference_address: '' };

    public basketName;
    public ServiceData;
    public ServiceData2;
    public ServiceData3;
    public day;
    public delivery_address;
    public order_type;
    public order_preference_store;
    public store_address;
    public time;
    public ServiceGetStore;
    public stores2 = [];
    public address2 = [];
    public address_ls = [];
    public image_url = this.rest.cdn_upload_url + 'category/';
    public imageProduct = this.rest.cdn_product_compress_url;
    public orderType = [{ id: '1', name: 'Pickup From Store' }, { id: '2', name: 'Delivery At Your Place' },]
    public MessageError;
    public SelectedArr2;
    public userPrefn;
    public SelectedArr = [];
    public Days = [];
    public MessageCateError;
    public MessageDayError;
    public MessageTimeError;
    public MessageOrderPrefError;

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: ActivatedRoute) {
        this.SelectedArr = [];
        $(".category_div").removeClass('added');
        this.userPrefn = [];
    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.SelectedArr = [];
        $(".category_div").removeClass('added');
        this.userPrefn = [];
        $(document).on("click", ".category_div", function () {
            //  $(this).toggleClass("added");
        });

        this.storage.get('id').then((userid) => {

            this.PDataGetStoreDetail.user_id = this.PDataSet.user_id = this.PData.user_id = userid;


            if (userid != '' && userid != null) {
                this.chekBlock()
            }
        });
        this.storage.get('storeID').then((storeid) => {

            if (storeid) {
                this.PDataSet.store_id = this.PData.store_id = storeid;
            } else {
                this.GetStoreID();
            }

            if (this.PData.store_id) {
                this.GetPreferenceListing();
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
        this.navCtrl.navigateForward('/home');
    }

    AddedMultiCategoryID2(id, vls) {
        var index = this.SelectedArr.indexOf(id);
        if (index >= 0) {
            $("#adds" + id).removeClass('added');
            this.SelectedArr.splice(index, 1);
        }
        if (index == -1) {
            $("#adds" + id).addClass('added');
            this.SelectedArr.push(id);
        }
    }

    GetPreferenceListing() {
        this.SelectedArr = [];
        $(".category_div").removeClass('added');
        this.userPrefn = [];
        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/User/shopping_preferences').subscribe((result) => {
            this.ServiceData = result;
            console.log('prefered list',this.ServiceData);
            if (this.ServiceData.status == 1) {

                this.delivery_address = this.ServiceData['data']['userpref'].delivery_address;
                this.PModel['select'] = this.order_type = this.ServiceData['data']['userpref'].order_type;

                if (this.ServiceData['data']['userPreferences']) {
                    this.userPrefn = this.ServiceData['data']['userPreferences'];
                    this.ServiceData['data']['userPreferences'].forEach(item => {
                        this.SelectedArr.push(item.id);
                    });
                    this.rest.dismiss();

                } else {
                    this.rest.dismiss();
                }

                this.order_preference_store = this.ServiceData['data']['userpref'].order_preference_store;
                this.store_address = this.ServiceData['data']['userpref'].store_address;
                this.PModel['Time'] = this.time = this.ServiceData['data']['userpref'].time;
                this.PModel['Day'] = this.ServiceData['data']['userpref'].day;
                this.PModel['listAddress'] = this.ServiceData['data']['userpref'].order_preference_address;
                this.PModel['listStore'] = this.ServiceData['data']['userpref'].order_preference_store;
                this.stores2 = this.ServiceData['data']['stores'];
                this.address2 = this.ServiceData['data']['userAddress'];

            } else {
                this.ErrorAlert();
                this.rest.dismiss();
            }
        }, (err) => {
            console.log(err);
        });
    }

    UpdatePreferenceListing() {
        this.MessageOrderPrefError = "";
        this.PDataSet.catPref = this.SelectedArr.toString();
        // alert(this.PModel['Day']);
        if (!this.PModel['Day'] || this.PModel['Day'] == '') {

            this.MessageDayError = "Preferred Dilivery Day is required !";
        }
        if (!this.PModel['Time'] || this.PModel['Time'] == '') {
            this.MessageTimeError = "Preferred Dilivery Time is required !";
        }
        if (!this.PModel['select']) {
            this.MessageOrderPrefError = " Order Prefrence is required !";
        }
        else {

            if (this.PModel['select'] == 1) {
                this.PDataSet.order_type = this.PModel['select'];
                this.PDataSet.order_preference_address = "";
                this.PDataSet.order_preference_store = this.PModel['listStore'];
                if (this.PModel['listStore'] == '' || !this.PModel['listStore']) {
                    this.MessageOrderPrefError = "Store Address is required !";
                }

            }
            if (this.PModel['select'] == 2) {
                this.PDataSet.order_type = this.PModel['select'];
                this.PDataSet.order_preference_address = this.PModel['listAddress'];
                // console.log(this.PModel['listAddress']);
                if (this.PModel['listAddress'] == '' || !this.PModel['listAddress']) {
                    this.MessageOrderPrefError = "Delivery Address is required !";
                }
            }

            if (this.MessageOrderPrefError == "") {

                this.rest.present();
                this.rest.GlobalPHit(this.PDataSet, '/User/update_shopping_pref').subscribe((result2) => {
                    this.SelectedArr = [];
                    $(".category_div").removeClass('added');
                    this.userPrefn = [];
                    this.ServiceData2 = result2;
                    console.log(this.ServiceData2);
                    if (this.ServiceData2.status == 1) {

                        this.ErrorAlert34();
                        this.rest.dismiss();
                        this.storage.set('storeID', this.ServiceData2['data']['order_preference_store']);
                        this.GetPreferenceListing();

                    } else {
                        this.ErrorAlert();
                        this.rest.dismiss();
                    }
                }, (err) => {
                    console.log(err);
                });
            }
        }
    }

    PreferDateTime() {
        if (this.PModel['Day']) {
            this.MessageDayError = "";
        }
        if (this.PModel['Time']) {
            this.MessageTimeError = "";
        }
        this.PDataSet.Time = this.PModel['Time'];
        this.PDataSet.Day = this.PModel['Day'];
    }

    GetListing() {
        if (this.PModel['select'] == '1') {
            this.PDataSet.order_type = '1';
            this.PData.type = "1";
            this.MessageOrderPrefError = "";
            this.ListingHit();
        }
        else if (this.PModel['select'] == '2') {
            this.PDataSet.order_type = '2';
            this.PData.type = "2";
            this.MessageOrderPrefError = "";
            this.ListingHit();
        }
    }

    go_to() {
        this.SelectedArr = [];
        $(".category_div").removeClass('added');
        this.userPrefn = [];

        this.navCtrl.navigateForward('/add-preference');
    }

    GetPreferenceListing2() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/User/shopping_preferences').subscribe((results) => {
            this.ServiceData = results;
            console.log(this.ServiceData);
            if (this.ServiceData.status == 1) {
                this.rest.dismiss();
            } else {
                this.ErrorAlert();
                this.rest.dismiss();
            }
        }, (err) => {
            console.log(err);
        });
    }

    ListingHit() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'User/order_type').subscribe((result2) => {
            this.ServiceData = result2;
            if (this.ServiceData.status == 1) {
                this.address_ls = result2.addresses;
                console.log(this.address_ls);
                this.rest.dismiss();
            } else {
                this.ErrorAlert();
                this.rest.dismiss();
            }
        }, (err) => {
            console.log(err);
        });
    }

    GetSelected(type) {

        this.MessageError = "";
        this.PDataSet.order_type = type;
        if (type == 1) {
            this.PDataSet.order_preference_store = this.PDataSet.store_id = this.PModel['listStore'];
        }
        else if (type == '2') {
            this.PDataSet.address_id = this.PModel['listAddress'];
            this.PDataSet.order_preference_address = this.PModel['listAddress'];
        }
    }

    async ErrorAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

    async ErrorAlert34() {
        const alert = await this.alertController.create({
            message: "Shopping Preference Updated SuccessFully.",
            buttons: ['OK']
        });
        await alert.present();
    }

    GetStoreID() {
        // this.rest.present();
        this.rest.present();
        this.rest.GlobalPHit(this.PDataGetStoreDetail, '/User/get_store_id').subscribe((result) => {
            this.ServiceGetStore = result;
            if (this.ServiceGetStore.status == 1) {
                this.storage.set('storeID', this.ServiceGetStore['store_id']);
                this.PDataSet.store_id = this.PData.store_id = this.ServiceGetStore['store_id'];
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

}
