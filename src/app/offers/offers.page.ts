import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { OfferListPage } from '../offer-list/offer-list.page';
import * as $ from 'jquery';

@Component({
    selector: 'app-offers',
    templateUrl: './offers.page.html',
    styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
    @Input() PData = { apikey: this.rest.APIKey, category_id: '', parent_id: '', user_id: '', store_id: '' };

    public oofname;
    public PModel = {};
    public GramSelectedArray = [];
    public featureImageUrl = this.rest.cdn_product_compress_url;
    public BaseImageURL = this.rest.cdn_upload_url;
    public BaseImageURL2 = this.rest.cdn_base_url;
    public ServiceData;
    public off_ban;
    public off_cat;
    public offrs;
    public nodata;
    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: ActivatedRoute, private modalCtrl: ModalController) {
        this.oofname = this.router.snapshot.paramMap.get('oofname');
    }

    slideOpts = {
        loop: true,
        // effect: "flip",
        autoplay: {
            delay: 3000
        }
    };

    ngOnInit() {
        console.log(this.oofname)
        if (this.oofname == '0') {
            this.get_offer_detail();
        }

        if (this.oofname == '1') {
            this.storage.get('storeID').then((storeID) => { this.PData.store_id = storeID })
            this.storage.get('id').then((val) => {
                if (val) {
                    this.PData.user_id = val;
                    if (val != '' && val != null) {
                        this.chekBlock()
                    }
                    this.get_my_offer_detail();

                }
            });

        }
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

    GoCondition(cat_url_exist, SbName, category_id, multi_cat_url, catmain_id, subcat_name) {
        if (cat_url_exist == '0') {

        }
        if (cat_url_exist == '1') {
            var chek = 1
            this.navCtrl.navigateForward(['/subcategory', { SbName: SbName, category_id: category_id, catmain_id: catmain_id, subcat_name: subcat_name, pmyoffer: true, chek: chek }]);
        }
        if (cat_url_exist == '2') {
            this.OpenModel(cat_url_exist, SbName, category_id, catmain_id, multi_cat_url, subcat_name);
        }
    }

    async OpenModel(cat_url_exist, SbName, category_id, catmain_id, multi_cat_url, subcat_name) {
        const Update_Status = await this.modalCtrl.create({
            component: OfferListPage,
            componentProps: { Listing: multi_cat_url },
            cssClass: 'modalCss'
        });
        Update_Status.onDidDismiss()
            .then((data) => {
                if (data.data[0].subcat_name) {
                    var chek = 1
                    console.log("get===>" + JSON.stringify(data.data[0]))
                    this.navCtrl.navigateForward(['/subcategory', { SbName: data.data[0].SbName, category_id: data.data[0].category_id, catmain_id: data.data[0].catmain_id, subcat_name: data.data[0].subcat_name, pmyoffer: true, chek: chek }]);
                } else { }
            });
        return await Update_Status.present();
    }

    get_offer_detail() {
        this.rest.present();

        this.rest.GlobalPHit(this.PData, 'User/offers').subscribe((result) => {
            this.ServiceData = result;
                console.log('----------------',this.ServiceData.data);
            if (this.ServiceData.status == 1) {
                if (this.ServiceData.data.offer_banner) {
                    this.off_ban = this.ServiceData.data.offer_banner;
                }
                if (this.ServiceData.data.category_data) {
                    this.off_cat = this.ServiceData.data.category_data;
                }

                if (this.ServiceData.data.offers) {
                    this.offrs = this.ServiceData.data.offers;
                }

            } else {
                this.ErrorAlert();
                this.nodata = "No Data Found !";

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

    weightSelected(abcd12) {
        // console.log('abcd12===============>' + JSON.stringify(abcd12))
    }

    got_again(caid) {
        //alert("new_"+caid);
        this.PData.category_id = caid;
        this.rest.present();//this.rest.present()

        this.rest.GlobalPHit(this.PData, 'User/offers').subscribe((result) => {
            $(".abc").removeClass("active");
            //	$("#new_0").removeClass("active");
            this.ServiceData = result;
            if (this.ServiceData.status == 1) {
                // console.log(this.ServiceData.data);

                if (this.ServiceData.data.offer_banner) {
                    //	this.off_ban=this.ServiceData.data.offer_banner;
                }
                if (this.ServiceData.data.category_data) {
                    //	this.off_cat=this.ServiceData.data.category_data;
                }

                if (this.ServiceData.data.offers) {
                    this.offrs = this.ServiceData.data.offers;
                }
                $("#new_caid").addClass("active");

            } else {
                this.ErrorAlert();
                this.nodata = "No Data Found !";

            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    got_prev(caid) {
        this.PData.category_id = "";
        this.rest.present();

        this.rest.GlobalPHit(this.PData, 'User/offers').subscribe((result) => {
            this.ServiceData = result;
            if (this.ServiceData.status == 1) {
                // console.log(this.ServiceData.data);
                if (this.ServiceData.data.offer_banner) {
                    // this.off_ban=this.ServiceData.data.offer_banner;
                }
                if (this.ServiceData.data.category_data) {
                    //	this.off_cat=this.ServiceData.data.category_data;
                }

                if (this.ServiceData.data.offers) {
                    this.offrs = this.ServiceData.data.offers;
                }

                $(".abc").removeClass("active");

                $("#new_0").addClass("active");

            } else {
                this.ErrorAlert();
                this.nodata = "No Data Found !";

            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    get_my_offer_detail() {
        this.rest.present();

        this.rest.GlobalPHit(this.PData, 'User/my_offer').subscribe((result) => {
            this.ServiceData = result;
            if (this.ServiceData.status == 1) {
                // console.log(this.ServiceData.data);
                this.rest.dismiss();

                if (this.ServiceData.data) {
                    this.offrs = this.ServiceData.data;
                }

            } else {
                this.ErrorAlert();
                this.nodata = "No Data Found !";

            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    route_sub_category_view(pid, ProductName) {
        //alert();
        this.storage.set('pid', pid);
        this.navCtrl.navigateForward(['/product-view', { ProductID: pid, ProductName: ProductName }]);

    }

    go_to_cat(param1 = null) {

    }

}
