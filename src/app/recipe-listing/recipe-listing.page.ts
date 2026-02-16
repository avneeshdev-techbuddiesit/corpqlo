import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-recipe-listing',
    templateUrl: './recipe-listing.page.html',
    styleUrls: ['./recipe-listing.page.scss'],
})
export class RecipeListingPage implements OnInit {
    public username;
    public userid;
    public ServiceData;
    public CartNotification;
    public receipe_list;
    public image_url = this.rest.cdn_product_compress_url;
    @Input() PData = { apikey: this.rest.APIKey, address_id: '', user_id: '', store_id: '' };
    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router) {

    }

    ngOnInit() {
        this.storage.get('id').then((val) => {
            this.PData.user_id = val;
            if (val != '' && val != null) {
                this.chekBlock()
            }
            this.storage.get('storeID').then((storeID) => {
                this.PData.store_id = storeID;
                this.get_receipe_page();

            });
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

    get_receipe_page() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'User/all_recipes_list').subscribe((result) => {
            this.ServiceData = result;
            if (this.ServiceData.status == 1) {
                this.receipe_list = this.ServiceData.all_recipes_list;
                this.GetCartNotification();
            } 
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
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

    GetCartNotification() {
        this.rest.GlobalPHit(this.PData, 'Cart/count_cart').subscribe((result) => {
            this.CartNotification = result;
           
        }, (err) => {
            console.log(err);
        });
    }

    recipe_details(id) {
        this.storage.set('receipe_id', id);
        this.navCtrl.navigateForward('/recipe-details');
    }

}
