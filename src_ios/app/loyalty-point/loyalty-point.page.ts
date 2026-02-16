import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-loyalty-point',
  templateUrl: './loyalty-point.page.html',
  styleUrls: ['./loyalty-point.page.scss'],
})
export class LoyaltyPointPage implements OnInit {
  public PModel={};
  @Input() PData = {apikey: this.rest.APIKey, user_id:'' , store_id:'' };
  public ServiceData;


  constructor(private rest:RestService ,private navCtrl: NavController, public storage:Storage,public alertController: AlertController,
    public router:ActivatedRoute, private statusBar: StatusBar, private spinner: NgxSpinnerService,) {  
     
    }

  ngOnInit() {
      this.storage.get('user_id').then(val =>{
        this.PData.user_id = val;
        this.storage.get('id').then((val) => {
          if(val!='' && val!=null){
           this.chekBlock()
          }
         });
        this.storage.get('storeID').then((storeID) =>{
          this.PData.store_id  = storeID;
          this.GetLoyalityPoints();
        })
      });
  }

  chekBlock(){
    this.storage.get('id').then((val) => {
     let key={
      "user_id": this.PData.user_id,
      "apikey":this.PData.apikey
     }
      this.rest.userBlock(key).subscribe((result) => {});
    });
  }

  GetLoyalityPoints(){
   // this.rest.present();
      
     this.spinner.show();

    this.rest.GlobalPHit(this.PData, '/User/loyalty_points').subscribe((result) => {
      this.ServiceData = result;
      if(this.ServiceData.status== 1){
        this.spinner.hide();//  this.rest.dismiss();
      }else{
        this.ErrorAlert();
        this.spinner.hide();//this.rest.dismiss()
      }
    }, (err) => {
      console.log(err);
    });
}
ClickRedeem(){
  this.spinner.show();//this.rest.present();
  this.rest.GlobalPHit(this.PData, '/User/redeem_loyality').subscribe((result) => {
    this.ServiceData = result;
    if(this.ServiceData.status== 1){
      this.spinner.hide();// this.rest.dismiss();
      this.SaveAlert();
      }else{
      this.ErrorAlert();
      this.spinner.hide();// this.rest.dismiss()
    }
  }, (err) => {
    console.log(err);
  });
}

async ErrorAlert() {
  const alert = await this.alertController.create({
    message:this.ServiceData['message'],
    buttons: ['OK']
  });
  await alert.present();
}
async SaveAlert() {
  const alert = await this.alertController.create({
    message:this.ServiceData['message'],
    buttons: [
       { text: 'OK',
        handler: () => { this.GetLoyalityPoints(); }}] });
          await alert.present();
  }

}