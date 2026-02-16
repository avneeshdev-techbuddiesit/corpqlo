import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {
 @Input() PData = {apikey: this.rest.APIKey, user_id:'', store_id:'' ,type:'about' };
  public ServiceData;
  public ErrorStore;
  public ErrorVisit_date;
  public ErrorDescription;
  constructor(private rest:RestService ,private navCtrl: NavController, public storage:Storage,public alertController: AlertController,
    public router:ActivatedRoute, private statusBar: StatusBar,   private spinner: NgxSpinnerService,) {  
     
    }

  ngOnInit() {
    this.storage.get('id').then((val) =>{
      this.PData.user_id = val;
      if(val!='' && val!=null){
        this.chekBlock()
       }
     })
    this.storage.get('storeID').then((storeID) => {
      this.PData.store_id = storeID;
     
     });
     this.GetAboutUs();
    }

      chekBlock(){
        this.storage.get('id').then((val) => {
         let key={
          "user_id":this.PData.user_id,
          "apikey":this.PData.apikey
         }
          this.rest.userBlock(key).subscribe((result) => {});
        });
      }

  GetAboutUs(){
    
this.spinner.show();

   // this.rest.present();
    // this.rest.GlobalPHit(this.PData, '/User/about_us').subscribe((result) => {
      this.rest.GlobalPHit(this.PData, '/User/cms_data').subscribe((result) => {

        this.spinner.hide();
       this.ServiceData = result;
        if(this.ServiceData.status== 1){
       //  this.rest.dismiss();
       }else{
         this.ErrorAlert();
        // this.rest.dismiss()
       }
     }, (err) => {
      this.spinner.hide();
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

}
