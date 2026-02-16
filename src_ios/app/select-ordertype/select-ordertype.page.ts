import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-select-ordertype',
    templateUrl: './select-ordertype.page.html',
    styleUrls: ['./select-ordertype.page.scss'],
})

export class SelectOrdertypePage implements OnInit {

    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store_id: '', type: '', address_id: ''};
    public PModel = { select: null, listStore: null, listing: null, listAddress: null };
    public orderOptions = [{ id: '1', name: 'Pickup From Store' }, { id: '2', name: 'Delivery At Your Place' }]
    public ServiceData;
    public image_url;
    public url;
    public orderType:any = 2;
    public MessageError;
    public MessageError2;
    public MessageError3;
    public storeList;
    public addressList;
    public userPref = {order_type:'',order_preference_store:'',order_preference_address:''};
    public is_home:boolean = false;
    public is_office:boolean = false;
    public is_other:boolean = false;
    public refresh:any = false;

    constructor(
        public activatedRoute: ActivatedRoute, 
        private rest: RestService, 
        private navCtrl: NavController, 
        public storage: Storage, 
        public alertController: AlertController,
        public router: Router
        ) {
        this.url = this.activatedRoute.snapshot.paramMap.get('url');
        this.refresh = this.activatedRoute.snapshot.paramMap.get('refresh');
    }

    ngOnInit() {
        this.storage.get('id').then((userid) => {
            
            if (userid != '' && userid != null) {
                let key = {
                    "user_id": userid,
                    "apikey": this.PData.apikey
                }
                
                this.rest.userBlock(key).subscribe((result) => { });
            }
        });
    }

    ionViewWillEnter()
    {
        console.log("SelectOrdertypePage ionViewWillEnter");
        this.storage.get('id').then((userid) => {
            this.PData.user_id = userid;
            this.get_shopping_pref();
            if (userid == '' || userid == null) {
                this.navCtrl.navigateRoot('sign-in');
            }
        }, (err) => {
            this.navCtrl.navigateRoot('sign-in');
        });
    }

    ionViewDidEnter()
    {
        if(this.refresh == 1)
        {
            // this.get_shopping_pref();
        }
    }
    
    selectOrderType(type)
    {
        this.orderType = type;
        this.PData.type = type;
        if(this.userPref)
        {
            this.userPref.order_type = type;
        }
        // this.ListingHit();
    }

    get_shopping_pref() {

        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'User_pref/shopping_pref').subscribe((result) => {
            this.ServiceData = result;
            if (result.responseType == 1 && result.responseCode == 200) {
                this.storeList = result.all_stores;
                this.addressList = result.all_address;
                if(result.shopping_pref && result.shopping_pref != '')
                {
                    this.userPref = result.shopping_pref;
                    this.orderType = result.shopping_pref.order_type;
                    this.PData.type = result.shopping_pref.order_type;
                    this.PData.store_id = result.shopping_pref.order_preference_store;
                    this.PData.address_id = result.shopping_pref.order_preference_address;
                }
                if(this.addressList)
                {
                    this.addressList.forEach((item, index) => {
                        if (item.addr_type == 'home') {
                            this.is_home = true;
                        }
                        if (item.addr_type == 'office') {
                            this.is_office = true;
                        }
                        if (item.addr_type == 'other') {
                            this.is_other = true;
                        }
                    });
                }
            } else {
                this.userPref = {order_type:'',order_preference_store:'',order_preference_address:''}
                if (result.storeResponseType == 1 && result.responseCode == 200) {
                    this.storeList = result.all_stores;
                    this.addressList = result.all_address;
                }
                else
                {
                    this.rest.showAlert('Server error');
                }
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    select_option(type, store_id='', address_id='')
    {
        if(type == 1)
        {
            this.PData.store_id = store_id;
            this.PData.type = '1';
            this.userPref.order_type = '1';
            this.userPref.order_preference_store = store_id;
        }
        else if(type == 2)
        {
            this.PData.address_id = address_id;
            this.PData.store_id = store_id;
            this.PData.type = '2';
            this.userPref.order_type = '2';
            this.userPref.order_preference_address = address_id;
        }
    }

    SaveDefaultAddress() {

        this.MessageError = "";
        this.MessageError2 = "";
        this.MessageError3 = "";
        var z = 0;
        console.log("userPref", this.userPref);
        if (!this.userPref.order_type) {
            z = 1;
            this.MessageError3 = "Select Order Type.";
        }

        if (this.userPref.order_type == '1') {
            if (!this.userPref.order_preference_store) {
                z = 1;
                this.MessageError = "Select Default Store.";
            }
        }

        if (this.userPref.order_type == '2') {

            if (!this.userPref.order_preference_address) {
                z = 1;
                this.MessageError2 = "Select Default Address.";
            }
        }

        if (z == 0) {
            this.MessageError = "";
            this.MessageError2 = "";
            this.MessageError3 = "";
            this.rest.present();
            this.rest.GlobalPHit(this.PData, 'User_pref/updateMyPref').subscribe((result) => {
                this.rest.dismiss();
                if (result.status == 1) {
                    this.storage.set('storeID', result.store_id);
                    this.storage.set('address', result.user_pref_address);
                    
                    this.rest.presentToastBottomFull(result.message);
                    if (this.url && this.url != '') {
                        this.navCtrl.navigateRoot(this.url);
                    }

                } else {
                    this.rest.showAlert(result.message);
                    
                }
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        }
    }

    edit_address(type, address_id = '')
    {
        
        this.navCtrl.navigateForward(['/add-address', {address_id:address_id,address_type:type, backto:'select-ordertype'}]);
        
    }
}
