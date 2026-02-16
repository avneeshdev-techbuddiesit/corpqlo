import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.page.html',
  styleUrls: ['./my-tickets.page.scss'],
})
export class MyTicketsPage implements OnInit {

  constructor(
      private navCtrl: NavController,
      public toastController: ToastController
  ) { }

  ngOnInit() {
  }

    async presentToast() {
    const toast = await this.toastController.create({
      message: 'Please Select An Order',
        duration: 3000,
        position: 'top',
        cssClass: 'my-custom-class',
      animated:true
    });
    toast.present();
  }
    
  orderissue(){
    this.navCtrl.navigateForward(['order-issue', {chek:'2'}]);
  }
    
    raiseticket() {
        this.navCtrl.navigateForward("/raise-ticket")
    }

    aaddticket() {
        this.navCtrl.navigateForward('/order-list').then(() => {
            this.presentToast();
        })
    }

}
