import { Component, OnInit, Input, ViewChild, NgZone } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-raise-ticket',
    templateUrl: './raise-ticket.page.html',
    styleUrls: ['./raise-ticket.page.scss'],
})
export class RaiseTicketPage implements OnInit {
    public PModel = {};
    @Input() PDataStore = { apikey: this.rest.APIKey, user_id: '', store_id: '', type: '1', };
    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store: '', visit_date: '', description: '' };

    public ServiceData;
    public ErrorStore;
    public ErrorVisit_date;
    public ErrorDescription;
    public let_store;
    public minDate;
    public date;
    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router, private zone: NgZone) {

        this.date = new Date();
        this.minDate = new Date().toISOString();
    }

    formatDate(date) {
        let d = new Date(date),
            day = '' + d.getDate(),
            month = '' + (d.getMonth() + 1),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [day, month, year].join('-');
    }

    ngOnInit() {
        this.storage.get('id').then((val) => {
            this.PData.user_id = val;
            this.PDataStore.user_id = val;
            if (val != '' && val != null) {
                this.chekBlock()
            }

        })
        this.storage.get('storeID').then((storeID) => {
            this.PDataStore.store_id = storeID;
            this.GetListingStore();
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

    GetListingStore() {
        this.rest.present();
        this.rest.GlobalPHit(this.PDataStore, '/User/Order_type').subscribe((result) => {
            this.ServiceData = result;
            // console.log(this.ServiceData);
            if (this.ServiceData.status == '1') {
                if (this.ServiceData.stores && this.ServiceData.stores.length >= 0) {
                    this.let_store = this.ServiceData.stores;
                    this.PData['store'] = this.ServiceData.stores['0'].store_id;
                }
            } else {
                this.ErrorAlert();
                
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    Cancel() {
        this.navCtrl.navigateBack('/store-issue');
    }

    Submit() {
        if (!this.PData.store) {
            this.ErrorStore = "Store Is Required !";
        }
        if (!this.PData.description) {
            this.ErrorDescription = "Description Is Required !";
        }
        if (!this.PData.visit_date) {
            this.ErrorVisit_date = "Date Of Visit Is Required !";
        }
        if (this.PData.store && this.PData.description && this.PData.visit_date) {
            this.rest.present();
            this.rest.GlobalPHit(this.PData, '/User/add_store_issue').subscribe((result) => {
                this.ServiceData = result;
                console.log(this.ServiceData);
                if (this.ServiceData.status == 1) {
                    
                    this.SaveAlert();
                    this.clearError();
                } else {
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

    async SaveAlert() {

        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.navCtrl.navigateBack('/store-issue');
                        console.log('Confirm Okay');
                    }
                }
            ]
        });

        await alert.present();
    }

    clearError() {
        this.ErrorStore = "";
        this.ErrorDescription = "";
        this.ErrorVisit_date = "";
    }

    Change() {
        if (this.PData.store) {
            this.ErrorStore = "";
        }
        if (this.PData.description) {
            this.ErrorDescription = "";
        }
        if (this.PData.visit_date) {
            this.ErrorVisit_date = "";
        }
    }

}
