import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-recipe-details',
    templateUrl: './recipe-details.page.html',
    styleUrls: ['./recipe-details.page.scss'],
})
export class RecipeDetailsPage implements OnInit {
    @Input() PDataAddToCart: any = { apikey: this.rest.APIKey, user_id: '', store_id: '', pid: '', qnty: '', weightid: '', basketChk: 'false', }; //variant id = wegth id
    @Input() PData2: any = { apikey: this.rest.APIKey, user_id: '', varient_id: '', store_id: '' };
    @Input() PData = { apikey: this.rest.APIKey, recipe_id: '', store_id: '', user_id: '' };
    @Input() PDatavr: any = { apikey: this.rest.APIKey, product_id: '', user_id: '', store_id: '', varient_id: '' };

    public GramSelectedArray = [];
    public featureImageUrl = this.rest.cdn_product_compress_url;
    public flagUrl = this.rest.cdn_upload_url + 'country_flag/';
    public username;
    public userid;
    public ServiceData;
    public ServiceData4;
    public recipe_data;
    public image_url;
    public receipe_ids;
    public image_url2;
    public rec_pr;
    public rec_img;
    public CartNotification;
    public item_qty = 0;
    public chk_qty;
    public quant;
    public offers_data_f;
    public offers_data_sub;
    public off_type_featured;
    public off_type_sub;

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router) {

    }

    ngOnInit() {
        this.storage.get('receipe_id').then((val) => {
            this.storage.get('id').then((id) => {
                this.PData.user_id = id;
                this.PData2.user_id = id;
                this.PDataAddToCart.user_id = id;
                this.PDatavr.user_id = id;
                if (id != '' && id != null) {
                    this.chekBlock()
                }
            })

            if (val) {
                this.receipe_ids = val;
                this.storage.get('storeID').then((storeid) => {
                    this.PData.store_id = storeid;
                    this.PData2.store_id = storeid;
                    this.PDatavr.store_id = storeid;

                    this.PDataAddToCart.store_id = storeid;

                    this.get_receipe_page();
                    this.GetCartNotification();
                })

            } else {
                this.receipe_ids = "";

            }
        });
        this.image_url = this.rest.cdn_upload_url;
        this.image_url2 = this.rest.cdn_base_url;
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
        this.PData.recipe_id = this.receipe_ids;
        this.rest.GlobalPHit(this.PData, 'User/recipe_detail').subscribe((result) => {
            this.ServiceData = result;
            //  console.log(this.ServiceData);
            if (this.ServiceData.status == 1) {
                // console.log(this.ServiceData);
                this.recipe_data = this.ServiceData.recipe_data;
                if (this.recipe_data.recipe_product) {
                    this.rec_pr = this.recipe_data.recipe_product;
                }
                if (this.recipe_data.recipe_image) {
                    this.rec_img = this.recipe_data.recipe_image;
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

    async ErrorAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

    slideOptsTwo = {
        initialSlide: 0,
        slidesPerView: 1.5,
        loop: false,
        centeredSlides: false,
        pagination: false
    };


    inc2(pr_id2, wids3) {
        this.item_qty = Number($(".count_2" + pr_id2).first().text());
        this.item_qty += 1;
        $(".count_2" + pr_id2).text('');
        $(".count_2" + pr_id2).text(this.item_qty);
        this.AddToCartPlus2("up", pr_id2, wids3);
    }

    dec2(pr_id2, wids4) {
        this.item_qty = Number($(".count_2" + pr_id2).first().text());
        if (this.item_qty - 1 < 1) {
            this.item_qty = 0;
            $(".after_2" + pr_id2).hide();
            $(".new_2" + pr_id2).show();
            $(".count_2" + pr_id2).text('');
            $(".count_2" + pr_id2).text(this.item_qty);
            this.AddToCartPlus2("down", pr_id2, wids4);
        }
        else {
            this.item_qty -= 1;
            $(".count_2" + pr_id2).text(this.item_qty);
            this.AddToCartPlus2("down", pr_id2, wids4);
        }
    }

    AddToCartPlus2(qty, pr_id, wids5) {
        this.PDataAddToCart.qnty = qty;
        this.PDataAddToCart.pid = pr_id;//
        this.PDataAddToCart.weightid = $("#varient_id_" + wids5 + "_" + pr_id).val();
        this.rest.present();;
        this.rest.GlobalPHit(this.PDataAddToCart, '/Cart/updateQnty').subscribe((result) => {
            this.ServiceData = result;
            // console.log(this.ServiceData);
            if (this.ServiceData.status == 1) {
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

    add_to_cart2(pr_ids, wids2) {
        this.item_qty = 1;
        $(".count_2" + pr_ids).text(1);
        this.AddToCart2(pr_ids, wids2);
    }

    AddToCart2(pr_id, wids2) {
        // this.PDataAddToCart.pid= this.PData.product_id;//
        this.PDataAddToCart.pid = pr_id;
        this.PDataAddToCart.qnty = '1';

        this.PDataAddToCart.weightid = $("#varient_id_" + wids2 + "_" + pr_id).val();
        this.item_qty = 1;
        this.quant = this.item_qty;

        this.rest.present();;
        this.rest.GlobalPHit(this.PDataAddToCart, '/Cart/add_cart').subscribe((result) => {
            this.ServiceData = result;
            console.log(this.ServiceData);
            if (this.ServiceData.status == 1) {
                $(".after_2" + pr_id).show();

                $(".new_2" + pr_id).hide();
                this.ErrorAlert();
                
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

    route_sub_category_view(pid, ProductName) {
        this.storage.set('pid', pid);
        this.navCtrl.navigateForward(['/product-view', { ProductID: pid, ProductName: ProductName }]);

    }

    add_to_cart2_for_login() {
        this.ErrorAlert2();
        this.navCtrl.navigateForward('/sign-in');
    }

    async ErrorAlert2() {
        const alert = await this.alertController.create({
            message: "Please Login First !",
            buttons: ['OK']
        });
        await alert.present();
    }

    route_variant4(prid, vr = null) {

        var prodid = $("#varient_id_4_" + prid).val();
        this.PDatavr.varient_id = prodid;
        this.PDatavr.product_id = prid;
        this.rest.present();
        this.rest.GlobalPHit(this.PDatavr, 'User/product_varient').subscribe((result) => {
            this.ServiceData = result;
            // console.log(this.ServiceData.data);
            
            if (this.ServiceData.status == 1) {
                $("#price_fills_" + prid).text('');
                $("#price_fills_" + prid).text(this.ServiceData.data.price_for_print);
                if (this.ServiceData.data.product_price != this.ServiceData.data.price_for_print) {
                    $("#price_fills_2" + prid).text('');
                    $("#price_fills_2" + prid).text(this.ServiceData.data.product_price);
                }
                if (this.ServiceData.data.product_price == this.ServiceData.data.price_for_print) {
                    $("#price_fills_" + prid).text('');
                    $("#price_fills_" + prid).text(this.ServiceData.data.price_for_print);

                }
                this.chk_qty = 0;
                console.log(this.recipe_data);
                this.recipe_data.recipe_product.forEach(item => {

                    if (item.product_id == prid) {
                        this.recipe_data.recipe_product[this.chk_qty]['in_cart_quantity'] = this.ServiceData.data.in_cart_quantity;
                        this.recipe_data.recipe_product[this.chk_qty]['is_in_stock'] = this.ServiceData.data.is_in_stock;
                        this.recipe_data.recipe_product[this.chk_qty]['is_in_wishlist'] = this.ServiceData.data.is_in_wishlist;
                    }
                    this.chk_qty++;

                });

            } else {
                this.ErrorAlert();
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    add_whislist(pid, wisCode, opt) {
        if (opt) {
            pid = opt + "_" + pid;
        }
        if (wisCode == 0) {
            if (this.PData2.user_id) {
                this.AddedWishlist(pid)
            } else {
                this.ErrorAlert2();
            }
        }
        if (wisCode == 1) {
            if (this.PData2.user_id) {
                this.RemoveWishlist(pid)
            } else {
                this.ErrorAlert2();
            }
        }
    }

    AddedWishlist(pid) {
        var abc = "varient_id_" + pid;
        this.PData2.varient_id = $("#" + abc).val();
        if (this.PData2.varient_id) {
            this.rest.present();
            this.rest.GlobalPHit(this.PData2, 'User/add_wishlist').subscribe((result4) => {
                this.ServiceData4 = result4.data;
                this.get_receipe_page();
                // console.log(this.ServiceData4);
                if (this.ServiceData4.status == 1) {

                }

                this.rest.dismiss();
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        } else {
            this.ErrorAlert3();
        }
    }

    RemoveWishlist(pid) {
        var abc = "varient_id_" + pid;
        this.PData2.varient_id = $("#" + abc).val();
        if (this.PData2.varient_id) {
            this.rest.present();
            this.rest.GlobalPHit(this.PData2, 'User/delete_wishlist').subscribe((result4) => {
                this.ServiceData4 = result4;
                this.get_receipe_page();
                this.rest.dismiss();
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });

        } else {
            this.ErrorAlert3();
        }
    }

    GetCartNotification() {
        this.rest.GlobalPHit(this.PData, 'Cart/count_cart').subscribe((result) => {
            this.CartNotification = result;
            
        }, (err) => {
            console.log(err);
        });
    }

    async ErrorAlert3() {
        const alert = await this.alertController.create({
            message: "Please Select varient First !",
            buttons: ['OK']
        });
        await alert.present();
    }

}
