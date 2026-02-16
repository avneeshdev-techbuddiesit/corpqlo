import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, IonContent, IonInfiniteScroll, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { SafeEventService } from '../services/safe-event.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-category',
    templateUrl: './category.page.html',
    styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

    @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
    @ViewChild('IonContent', { static: false }) content: IonContent;
    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store_id: '',all_cat_subcat_cache_metadata:'' };
    
    public username;
    public is_api_request: boolean = false;
    public userid;
    public category_list: any = [];
    public category_list_temp: any = [];
    public image_url = this.rest.cdn_upload_url;
    public CartNotification;
    public cat_banner_placeholder: any = 'assets/image/placeholders/cat_banner.jpg';
    public cat_placeholder: any = 'assets/image/placeholders/category.jpg';
    public subcat_placeholder: any = 'assets/image/placeholders/subcategory2.jpg';
    public isLoaded: boolean = false;

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router,
    private Event: SafeEventService) { }


    ngOnInit() {

        this.get_category_page();
    }

    ionViewWillEnter() {
        this.storage.get('storeID').then((storeid) => {
            this.PData.store_id = storeid;
        })

        this.storage.get('id').then((saved_user_id) => {
            if (saved_user_id) {
                this.PData.user_id = saved_user_id;
            }
        });
    }

    // async get_category_page() {

    //     var all_cat_subcat_data = await this.storage.get('all_cat_subcat_data');
    //     if (all_cat_subcat_data != '' && all_cat_subcat_data != null && all_cat_subcat_data.data && all_cat_subcat_data.cache_metadata) {

    //         this.PData.all_cat_subcat_cache_metadata = all_cat_subcat_data.cache_metadata;

    //         if (this.category_list.length == 0) {
    //             this.category_list_temp = all_cat_subcat_data.data;

    //             for (let i = 0; i < this.category_list_temp.length; i++) {
    //                 if (i < 10) {
    //                     this.category_list.push(this.category_list_temp[i]);
    //                 }
    //                 else {
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    //     else {
    //         this.rest.present();
    //     }
 
    async get_category_page() { 

        var all_cat_subcat_data = await this.storage.get('all_cat_subcat_data');
        if (all_cat_subcat_data != '' && all_cat_subcat_data != null && all_cat_subcat_data.data && all_cat_subcat_data.cache_metadata) {
        
        this.PData.all_cat_subcat_cache_metadata = all_cat_subcat_data.cache_metadata;
        
        if (this.category_list.length == 0) {
        this.category_list = all_cat_subcat_data.data;
        }
        }
        else {
        this.rest.present();
        }

        this.rest.GlobalPHit(this.PData, 'Home_page/categories').subscribe((result) => {
            this.is_api_request = true;
            if (result.responseStatus == 'success' && result.responseCode == 200) {
                if (result.responseType == 2) {
                    this.storage.set('all_cat_subcat_data', { data: result.data, cache_metadata: result.cache_metadata });
                    this.category_list_temp = result.data;

                    for (let i = 0; i < this.category_list_temp.length; i++) {
                        if (i < 10) {
                            this.category_list.push(this.category_list_temp[i]);
                        }
                        else {
                            break;
                        }
                    }

                }
            } else {
                this.rest.showAlert(result.message);
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }


    
    category_page(category_id, subcategory_id, category_name) {

        if (subcategory_id && subcategory_id != null) {
            this.navCtrl.navigateForward(['/subcategory', { category_id: category_id, subcategory_id: subcategory_id, title: category_name }]);
        }
        else {
            this.navCtrl.navigateForward(['/subcategory', { category_id: category_id, title: category_name }]);
        }
    }

    download_image(event, file_name, upload_url, extra_url, prefix = null) {
        event = this.Event.normalize(event);
        if (event.path[0] && event.path[0].className != 'loaded') {
            if (prefix) {
                file_name = prefix + file_name;
            }

            this.rest.save_image(upload_url + '/' + extra_url + '/' + file_name, event);

        }
    }

    openSubcategory(id) {

        if ($(".subcategory_list_bg_" + id).hasClass('new-bg')) {
            $(".all_subcategory_hide").not(".subcategory_hide_" + id).hide();
            $(".subcategory_hide_" + id).slideUp();
            $(".subcategory_list_bg_" + id).removeClass('new-bg');
            $(".subcategory_list_bg_" + id + ' .category-toggle i').addClass('fa-angle-down');
            $(".subcategory_list_bg_" + id + ' .category-toggle i').removeClass('fa-angle-up');
        }
        else {

            // Close other open category
            $(".all_subcategory_hide").hide();
            $(".all_subcategory_list_bg").removeClass('new-bg');
            $(".all_subcategory_list_bg" + ' .category-toggle i').addClass('fa-angle-down');
            $(".all_subcategory_list_bg" + ' .category-toggle i').removeClass('fa-angle-up');

            $(".subcategory_hide_" + id).slideDown();
            $(".subcategory_list_bg_" + id).addClass('new-bg');
            $(".subcategory_list_bg_" + id + ' .category-toggle i').removeClass('fa-angle-down');
            $(".subcategory_list_bg_" + id + ' .category-toggle i').addClass('fa-angle-up');
            var _this = this;
            $(".subcategory_list_bg_" + id + ' .subcategory-wrapper img').each(function (event) {
                var src = $(this).attr('id');
                // var url = _this.rest.check_image(this, src);
                $(this).attr('src', src);
                // console.log("url", url);

            });
        }
    }
    
    async loadData(event) {

        for (let i = 0; i < this.category_list_temp.length; i++) {
            if (i >= 10) {
                this.category_list.push(this.category_list_temp[i]);
            }
        }
        // this.category_list = this.category_list_temp;
        // this.category_list = JSON.parse(JSON.stringify(this.category_list_temp));
        event.target.complete();
        this.isLoaded = true;
    }

    scrollUp(x_num = 100) {
        let that = this;
        setTimeout(() => {
            that.content.scrollToPoint(0, x_num, 200);
        }, 500);
        // console.log("Scroll worked");
    }
}
