import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';


@Component({
    selector: 'app-blog-listing',
    templateUrl: './blog-listing.page.html',
    styleUrls: ['./blog-listing.page.scss'],
})
export class BlogListingPage implements OnInit {

    public username;
    public userid;
    public ServiceData;
    public CartNotification;
    public blog_list;
    public image_url = this.rest.cdn_upload_url;

    @Input() PData = { apikey: this.rest.APIKey, store_id: '', user_id: '' };

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router) { }

    ngOnInit() {

    }

    ionViewWillEnter() {

        this.storage.get('id').then((val) => {
            this.PData.user_id = val;
            if (val != '' && val != null) {
                this.chekBlock()
            }
            this.storage.get('storeID').then((storeID) => {
                this.PData.store_id = storeID;
                this.get_category_page();

            });
        })
    }

    chekBlock() {
        this.storage.get('id').then((val) => {
            let key = {
                "user_id": this.PData.user_id,
                "apikey": this.PData.apikey
            }
            this.rest.userBlock(key).subscribe((result) => { });
        });
    }

    get_category_page() {
        this.rest.present()
        this.rest.GlobalPHit(this.PData, 'User/all_blogs_list').subscribe((result) => {
            this.ServiceData = result;
            // console.log(this.ServiceData);
            if (this.ServiceData.status == 1) {
                this.blog_list = this.ServiceData.all_blog_data;
                this.GetCartNotification();

            } else {
                this.blog_list = '';
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

    go_to_detail(bid) {
        this.storage.set('blogid', bid);
        this.navCtrl.navigateForward("/blog-details");
    }

}
