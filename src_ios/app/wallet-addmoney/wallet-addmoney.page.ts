import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';

@Component({
    selector: 'app-wallet-addmoney',
    templateUrl: './wallet-addmoney.page.html',
    styleUrls: ['./wallet-addmoney.page.scss'],
})
export class WalletAddmoneyPage implements OnInit {

    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store_id: '', };
    @Input() PDataPlaceOrder = { apikey: this.rest.APIKey, user_id: '', store_id: '', payment_method: '', amount: '' };
    @Input() PDataConfirmOrder = { apikey: this.rest.APIKey, user_id: '', store_id: '', amount: '', txn_id: '', txn_status: '' };

    public ServiceData;
    public BaseUrl = this.rest.cdn_assets_url;
    public ErrorMsg;
    public amount;
    public pay_button = '';
    public pay_button_color = 'pay_button_color_default';

    constructor(
        private rest: RestService, 
        public storage: Storage,
        public router: ActivatedRoute,
        private navCtrl: NavController,
        public alertController: AlertController, 
        private inAppBrowser: InAppBrowser
        ) {
    }

    ngOnInit() {
        this.storage.get('id').then((userID) => {
            this.PData.user_id = userID;
            this.PDataPlaceOrder.user_id = userID;
            this.PDataConfirmOrder.user_id = userID;
            if (userID != '' && userID != null) {
                this.chekBlock()
            }
            this.storage.get('storeID').then((storeID) => {
                this.PData.store_id = storeID;
                this.PDataPlaceOrder.store_id = storeID;
                this.PDataConfirmOrder.store_id = storeID;
            })
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

    ionViewWillEnter() {
        this.amount = '';
        this.pay_button = '';
        this.storage.get('id').then((userID) => {
            if (userID != '' && userID != null) {
                this.chekBlock()
            }
        })
    }

    invalid_amount_message() {
        if (this.amount) { this.ErrorMsg = "" }
    }

    valid_amount(e) {
        this.amount = this.amount.replace(/[^0-9]/g, '')
        return;
    }

    change_pay_method(method = null) {

        this.pay_button = method;
        this.pay_button_color = "pay_button_color";
    }

    async common_alert(message = "Select Payment Method") {
        const alert = await this.alertController.create({
            header: "Alert",
            message: message,
            buttons: ['OK']
        });
        await alert.present();
    }

    add_money() {

        if (!this.amount) {
            this.ErrorMsg = "Enter a valid amount"
        }
        else if (!this.pay_button) {
            this.common_alert("Select Payment Method");
        } else {

            // this.PDataPlaceOrder.amount = this.amount;
            this.PDataPlaceOrder.payment_method = 'paytm';
            const url = this.rest.BaseUrl + 'Wallet/add_money_paytm' + '?user_id=' + this.PDataPlaceOrder.user_id + '&amount=' + this.amount;
            let browser = this.inAppBrowser.create(url, '_blank', 'clearcache=yes,clearsessioncache=yes,location=no,hardwareback=no,zoom=no,toolbar=no');
            browser.on('loadstart').subscribe((event: InAppBrowserEvent) => {
                console.log("inAppBrowser loadstart", event.url);
                
                var success = event.url.indexOf("success=true");
                var fail = event.url.indexOf("success=false");
                if (success > 0) {
                    browser.close();
                    this.navCtrl.navigateRoot(['/wallet', { status: 1 }]);
                }
                if (fail > 0) {
                    browser.close();
                    this.navCtrl.navigateRoot(['/wallet', { status: 0 }]);
                }
            });

            browser.on('loadstop').subscribe((event: InAppBrowserEvent) => {

                console.log("loadstop event", event);
            });

            browser.on('loaderror').subscribe((event: InAppBrowserEvent) => {
                browser.close();
                alert("Something went wrong.");
            });
        }
    }

}

