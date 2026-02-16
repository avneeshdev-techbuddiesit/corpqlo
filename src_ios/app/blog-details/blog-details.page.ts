import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-blog-details',
    templateUrl: './blog-details.page.html',
    styleUrls: ['./blog-details.page.scss'],
})
export class BlogDetailsPage implements OnInit {

    public username;
    public userid;
    public ServiceData;
    public blog_id;
    public image_url;
    public blog_details;
    public blog_recent;
    public date_blog;
    public n_image;
    public n_title;
    public n_date_added;
    public n_detail;
    CartNotification;

    @Input() PData = { apikey: this.rest.APIKey, blog_id: '', store_id: '', user_id: '' };

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router) { }

    ngOnInit() {
        this.storage.get('id').then((val) => {
            this.PData.user_id = val;
            if (val != '' && val != null) {
                this.chekBlock()
            }
            this.storage.get('storeID').then((storeID) => {
                this.PData.store_id = storeID;
            });
        })
        this.storage.get('blogid').then((val) => {
            this.image_url = this.rest.cdn_product_compress_url;
            this.PData.blog_id = val;
            // this.Mobile4 =  this.PData.username.substring(6, 10);
            this.blog_detail();
        });

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


    blog_detail() {
        
        this.rest.present()
        //  this.PData.user_id=this.userid;
        this.rest.GlobalPHit(this.PData, 'User/blog_detail').subscribe((result) => {
            this.ServiceData = result;
            // console.log(this.ServiceData);
            if (this.ServiceData.status == 1) {
                this.blog_details = this.ServiceData.blog_data;
                this.blog_recent = this.ServiceData.recent_blogs;
                this.n_image = this.blog_details.news_image;
                this.n_title = this.blog_details.title;
                this.n_date_added = this.blog_details.date_added;
                this.n_detail = this.blog_details.detail;
                this.GetCartNotification();

            } else {
                this.ErrorAlert();
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

    go_todetail(blog_idss) {
        this.PData.blog_id = blog_idss;
        this.blog_detail();

    }

    GetCartNotification() {
        // this.rest.present();
        this.rest.GlobalPHit(this.PData, 'Cart/count_cart').subscribe((result2) => {
            this.CartNotification = result2;
            if (this.CartNotification['status'] == '1') {
                //this.rest.dismiss();
            } else {
                //this.ErrorAlert2();
                //this.rest.dismiss()
            }
        }, (err) => {
            console.log(err);
        });
    }

}
