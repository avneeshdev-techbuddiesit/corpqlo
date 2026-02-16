import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-order-sucess',
  templateUrl: './order-sucess.page.html',
  styleUrls: ['./order-sucess.page.scss'],
})
export class OrderSucessPage implements OnInit {

    public total_amount: any;
    public order_id: any;
    public order_status: any;
    public order_number: any;
    public order_success_icon: any = '../assets/image/order/order-success.png';
    public order_fail_icon: any = '../assets/image/order/order-fail.png';

    constructor(
      public router: ActivatedRoute,
        private navCtrl: NavController,
        private modalCtrl: ModalController
    ) {
        // this.total_amount = this.router.snapshot.paramMap.get('total_amount') || 0;
        // this.order_id = this.router.snapshot.paramMap.get("order_id") || 0;
        // this.order_status = this.router.snapshot.paramMap.get("order_status") || 0;
        // this.order_number = this.router.snapshot.paramMap.get("order_number") || 0;
  }

    ngOnInit() {
      console.log(this.order_status, this.total_amount, this.order_id, this.order_number)
  }
    
    routeOrderDetails() {
            this.navCtrl.navigateRoot('order-list');
            this.modalCtrl.dismiss()
    }

    routeHome() {
        this.navCtrl.navigateRoot('/home');
        this.modalCtrl.dismiss()
    }

}
