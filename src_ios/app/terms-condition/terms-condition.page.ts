import { Component, OnInit, Input } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-terms-condition',
    templateUrl: './terms-condition.page.html',
    styleUrls: ['./terms-condition.page.scss'],
})
export class TermsConditionPage implements OnInit {

    @Input() PData = { apikey: this.rest.APIKey, user_id: '', store_id: '', type: 'term' };
    public ServiceData;
    public ErrorStore;
    public ErrorVisit_date;
    public ErrorDescription;
    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: ActivatedRoute) {

    }

    ngOnInit() {
        this.storage.get('id').then((val) => {
            this.PData.user_id = val;
            if (val != '' && val != null) {
                this.chekBlock()
            }
        })
        this.storage.get('storeID').then((storeID) => {
            this.PData.store_id = storeID;

        });
        this.GetAboutUs();
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

    GetAboutUs() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, '/User/cms_data').subscribe((result) => {
            this.ServiceData = result;
            
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
