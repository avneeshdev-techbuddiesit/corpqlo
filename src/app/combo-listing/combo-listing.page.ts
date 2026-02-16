import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-combo-listing',
    templateUrl: './combo-listing.page.html',
    styleUrls: ['./combo-listing.page.scss'],
})
export class ComboListingPage implements OnInit {
    
    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store_id: '' };
    
    public image_url = this.rest.cdn_upload_url + 'combo/';
    public combo_list = [];
    public is_api_request:boolean = false;

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router
    ) { }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.storage.get('id').then((val) => {
            this.PData.user_id = val;
           
            this.storage.get('storeID').then((storeID) => {
                this.PData.store_id = storeID;
                this.GetListing();

            });
        })
    }

    GetListing() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/Combo/combo_list').subscribe((result) => {
            this.is_api_request = true;
            if (result.status == 1) {
                this.combo_list = result.data;
            } else {
                // this.rest.showAlert(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    route_combo_view(ComboID, ComboName) {
        this.navCtrl.navigateForward(['combo-details', { ComboID: ComboID, ComboName: ComboName }])
    }
}
