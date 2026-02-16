import { Component, OnInit } from '@angular/core';
import { NavController, Events } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-intro',
    templateUrl: './intro.page.html',
    styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
    public user_id;
    constructor( private nav: NavController, public router: Router, public events: Events, private storage: Storage) { }

    ngOnInit() {

        this.storage.get('reloads_intro').then((valss) => {
            //  this.menuCtrl.enable(false);
            // if(valss){
            this.storage.set('reloads_intro', "1");
            //  this.nav.navigateForward("/home"); 
            // }else{
            this.storage.set('reloads_intro', "1");
            // set status bar to white
            this.storage.set('mobile', '');
            // this.user_id_login = "";
            //this.PData.mobile="";
            this.storage.set('id', '');
            this.storage.set('user_name', '');
            this.storage.set('city', '');
            this.storage.set('country', '');
            this.storage.set('phone', '');
            this.storage.set('email_address', '');
            this.storage.set('address', '');

            this.events.publish('ProfileData', "");
            this.events.publish('Profileuser_pic', "");
            this.events.publish('Profileuser_name', "");
        });

    }

}
