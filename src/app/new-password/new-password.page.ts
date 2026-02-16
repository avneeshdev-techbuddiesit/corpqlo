import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-new-password',
    templateUrl: './new-password.page.html',
    styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {
    public username;
    public userid;
    public ServiceData;

    @Input() PData = {
        apikey: this.rest.APIKey, user_id: '', old_password: '',
        new_password: '',
        confirm_password: ''
    };
    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: Router) { }

    ngOnInit() {
        this.storage.get('id').then((ival) => {
            this.userid = ival;
            // this.get_confirm_page();
        });

        this.storage.get('username').then((val) => {
            this.username = JSON.stringify(val);
        });
    }

    get_confirm_page() {

        this.rest.present()
        this.PData.user_id = this.userid;
        this.rest.GlobalPHit(this.PData, 'User/change_password').subscribe((result) => {
            this.ServiceData = result;
            // console.log(this.ServiceData);
            if (this.ServiceData.status == 1) {
                this.rest.dismiss();
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
    
    route_back() {
        this.navCtrl.pop();
    }
}
