import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-smart-way-detail',
    templateUrl: './smart-way-detail.page.html',
    styleUrls: ['./smart-way-detail.page.scss'],
})
export class SmartWayDetailPage implements OnInit {
    @Input() PData = { apikey: this.rest.APIKey, smart_way_id: '' };

    public user_id: any;
    public ServiceData;
    public image_data;
    public featureImageUrl = this.rest.cdn_upload_url;

    public ErrorMsg;
    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: ActivatedRoute) {

        this.PData.smart_way_id = this.router.snapshot.paramMap.get('sid');
    }

    ngOnInit() {
        if (this.PData.smart_way_id) {
            this.GetListing();
        }
    }

    GetListing() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/User/smart_way_detail').subscribe((result) => {
            this.ServiceData = result;
            // console.log(this.ServiceData);
            if (this.ServiceData.status == 1) {
                this.image_data = this.ServiceData.data.landing_image;
               
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

}
