import { Component, OnInit, Input, ViewChild, NgZone } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-my-address',
    templateUrl: './my-address.page.html',
    styleUrls: ['./my-address.page.scss'],
})
export class MyAddressPage implements OnInit {
    
    @Input() PDataGetStoreDetail = { apikey: this.rest.APIKey, user_id: '' };
    @Input() PData = { apikey: this.rest.APIKey, user_id: '' };
    @Input() PData2 = { apikey: this.rest.APIKey, address_id: '',user_id: '' };
    @Input() PData3 = { apikey: this.rest.APIKey, user_id: '', default_address_id: '' };
    
    public username;
    public userid;
    public ServiceData;
    public homes;
    public offices;
    public others;
    public ServiceGetStore;
    public is_api_request:boolean = false;

    constructor(
        public rest: RestService, 
        private navCtrl: NavController, 
        public storage: Storage, 
        public alertController: AlertController,
        public router: Router
    ) {

    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.storage.get('id').then((save_user_id) => {
            
            if (save_user_id != '' && save_user_id != null) {

                this.PData2.user_id = save_user_id;
                this.PData3.user_id = save_user_id;
                this.userid = save_user_id;
                let key = {
                    "user_id": save_user_id,
                    "apikey": this.PData.apikey
                }
                this.rest.userBlock(key).subscribe((result) => { });
                this.get_addresses();
            }
            else{
                this.navCtrl.navigateForward("/sign-in");
            }
        });
    }

    get_addresses() {

        this.rest.present();
        this.PData.user_id = this.userid;
        this.rest.GlobalPHit(this.PData, 'My_account/my_address').subscribe((result) => {
            this.is_api_request = true;
            if (result.status == 1) {
                if(result.data.home)
                {
                    this.homes = result.data.home;
                }
                if(result.data.office)
                {
                    this.offices = result.data.office;
                }
                if(result.data.other)
                {
                    this.others = result.data.other;
                }

            } else {
                this.homes = "";
                this.offices = "";
                this.others = "";
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    get_addressesWithoutLoader() {

        this.PData.user_id = this.userid;
        this.rest.GlobalPHit(this.PData, 'My_account/my_address').subscribe((result) => {
            this.is_api_request = true;
            if (result.status == 1) {
                if(result.data.home)
                {
                    this.homes = result.data.home;
                }
                if(result.data.office)
                {
                    this.offices = result.data.office;
                }
                if(result.data.other)
                {
                    this.others = result.data.other;
                }

            } else {
                this.homes = "";
                this.offices = "";
                this.others = "";
            }
        }, (err) => {
            console.log(err);
        });
    }

    delete_address(id) {
        this.rest.present()
        this.PData2.address_id = id;
        this.rest.GlobalPHit(this.PData2, 'My_account/delete_address').subscribe((result) => {
            if (result.status == 1) {
                this.get_addresses();
                this.rest.showAlert(result.message);

            } else {
                this.rest.showAlert(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    add_address(address_type) {
        this.navCtrl.navigateForward(["/add-address", {address_type:address_type}]);
    }
    
    edit_address(address_id, address_type) {
        
        this.navCtrl.navigateForward(["/add-address", {address_id:address_id,address_type:address_type}]);
    }

    set_default(adress_id, idf, display_address = '') {
        this.rest.present()
        this.PData3.default_address_id = adress_id;
        this.rest.GlobalPHit(this.PData3, 'My_account/default_address').subscribe((result) => {
            if (result.status == 1) {
                if (result.data.order_type == 2) {
                    this.storage.set('storeID', result.data.store_id);
                    this.storage.set('address', display_address);
                }
                this.get_addressesWithoutLoader();

            } else {
                this.rest.showAlert(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });

    }
}
