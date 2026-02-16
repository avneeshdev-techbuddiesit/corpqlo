import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    currentItems: any[];
    items: any;

    public image_url;
    public item_qty;
    public p_list;
    public product_list = [];
    public my_search_tag = [];

    voice_text: any;
    @Input() PData = { apikey: this.rest.APIKey, search_data: '', store_id: '' };

    constructor(
        private rest: RestService, 
        private navCtrl: NavController, 
        public storage: Storage, 
        public alertController: AlertController,
        public router: Router, 
        private speechRecognition: SpeechRecognition,
        private cd: ChangeDetectorRef
        ) {
            
        this.storage.get('get_search_value').then((search_vals) => {
            if (search_vals.length >= 0) {
                search_vals.forEach(item => {
                    this.my_search_tag.push(item);

                });
            }
        });
        this.image_url = this.rest.cdn_upload_url;
    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.PData.search_data = "";
        
        this.storage.get('storeID').then((storeID) => {
            this.PData.store_id = storeID;
        });
    }

    check_voice_permission() {
        this.speechRecognition.hasPermission()
            .then((hasPermission: boolean) => {
                if (!hasPermission) {
                    this.speechRecognition.requestPermission()
                        .then()
                }
            })
    }

    //  Speech voice search
    voice() {
        this.check_voice_permission()
        this.speechRecognition.startListening().subscribe((speeches) => {
            this.voice_text = speeches[0];
            this.PData.search_data = this.voice_text;
            this.cd.detectChanges()
        })
    }

    getItems(itemsd = null) {
        
        var checks = this.PData.search_data.replace(/\s/g, "");
        if (checks.length > 2) {
            this.rest.GlobalPHit(this.PData, 'Search_product').subscribe((result) => {
                if (result.responseCode == 200 && result.responseType == 1) {
                    this.product_list = result.data.product_list;
                    this.p_list = "1";

                } else {
                    this.p_list = "";
                }
            }, (err) => {
                this.p_list = "";
                console.log(err);
            });

        } else {
            this.p_list = "";
            this.product_list = [];
        }
    }

    route_product_view(pid, ProductName) {
        this.navCtrl.navigateForward(['/product-view', { ProductID: pid, ProductName: ProductName }]);
    }

    searchItems(event)
    {
        if (event && event.key === "Enter") {
            this.route_search_detail_with_tag_save();
        }
    }

    route_search_detail_with_tag_save(itemsd = null) {
        
        var checks = this.PData.search_data;
        var checks2 = this.PData.search_data.replace(/\s/g, "");
        if (checks2.length > 2) {

            this.item_qty = 1;
            if (this.my_search_tag && this.my_search_tag.length >= 0) {

                if (this.my_search_tag.length <= 9) {
                    if(this.my_search_tag.indexOf(checks) === -1){
                        this.my_search_tag.unshift(checks);
                    }
                    
                } else {
                    if(this.my_search_tag.indexOf(checks) === -1){
                        this.my_search_tag.forEach(item245 => {
                            this.item_qty++;
                            if (this.item_qty > 9) {
                                this.my_search_tag.unshift(checks);
                                this.my_search_tag = this.my_search_tag.splice(0, 10);
                            }
                        });
                    }
                }

                this.storage.set('get_search_value', this.my_search_tag);
                this.navCtrl.navigateForward(['/search-detail', { stringquer: this.PData.search_data }]);
            } else {
                this.my_search_tag = [];
                this.my_search_tag.push(checks);
                this.storage.set('get_search_value', this.my_search_tag);
                this.navCtrl.navigateForward(['/search-detail', { stringquer: this.PData.search_data }]);
            }
        }
    }
    
    route_search_detail(keywords) {
        this.navCtrl.navigateForward(['/search-detail', { stringquer: keywords }]);
    }


}