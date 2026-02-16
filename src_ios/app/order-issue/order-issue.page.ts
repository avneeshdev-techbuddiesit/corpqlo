import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-order-issue',
    templateUrl: './order-issue.page.html',
    styleUrls: ['./order-issue.page.scss'],
})
export class OrderIssuePage implements OnInit {
    @Input() PData = { apikey: this.rest.APIKey, user_id: '' };
    
    public PModel = {};
    public basketName;
    public ServiceData;
    public image_url = this.rest.cdn_upload_url+'basket';
    public imageProduct = this.rest.cdn_product_compress_url;
    public chek: any;
    public router_nav: any;

    constructor(public routers: ActivatedRoute, private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router) {
        this.chek = this.routers.snapshot.paramMap.get('chek');
        if (this.chek == 1) {
            this.router_nav = 'order-list'
        } else {
            this.router_nav = 'my-tickets'
        }
    }

    ngOnInit() {

    }


    ionViewWillEnter() {

        this.storage.get('id').then((val) => {
            this.PData.user_id = val;
            if (val != '' && val != null) {
                this.chekBlock()
            }
            this.GetListing();
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

    GetListing() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/User/order_ticket').subscribe((result) => {
            this.ServiceData = result;
            // console.log(this.ServiceData);
            if (this.ServiceData.status == 1) {
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
    
    ViewOrder(ticket_id) {
        this.navCtrl.navigateForward(["/view-ticket", { type: "order", ticket_id: ticket_id }]);
    }

    aaddticket() {

        this.navCtrl.navigateForward('/order-list');
    }
    

}
