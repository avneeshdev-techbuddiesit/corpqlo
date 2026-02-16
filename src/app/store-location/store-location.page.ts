import { Component, OnInit, Input } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-store-location',
    templateUrl: './store-location.page.html',
    styleUrls: ['./store-location.page.scss'],
})
export class StoreLocationPage implements OnInit {
    
    @Input() PData = { apikey: this.rest.APIKey, user_id: '', type: '1' };
    public ServiceData;
    public stores_list;
    public coordss: any;
    public image_url = this.rest.cdn_base_url;

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router) { }
    ngOnInit() {

        this.ListingHit();
    }

    ListingHit() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'User/store_locations').subscribe((result) => {
            this.ServiceData = result;
            console.log(this.ServiceData);
            if (this.ServiceData.status == '1') {

                this.stores_list = this.ServiceData.data;
                // slist.coords
                this.coordss = this.stores_list[0].coords;
            } else {
                this.stores_list = ""
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    go_to_url(lat_long = null, store_location = null) {
        var pastess = "q=" + store_location;
        document.location.href = "https://maps.google.com/maps?" + pastess + "&hl=en&z=14&target='_blank'";
    }

}
