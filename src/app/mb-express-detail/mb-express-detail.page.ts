  import { Component, OnInit,Input,ViewChild } from '@angular/core';
  import { AlertController, NavController } from '@ionic/angular';
  import { ActivatedRoute, Router, } from '@angular/router';
  import { HttpClient } from '@angular/common/http';
  import { Storage } from '@ionic/storage';
  import { RestService } from '../rest.service';
  import { StatusBar } from '@ionic-native/status-bar/ngx';
  
  @Component({
    selector: 'app-mb-express-detail',
    templateUrl: './mb-express-detail.page.html',
    styleUrls: ['./mb-express-detail.page.scss'],
  })
  export class MbExpressDetailPage implements OnInit {
    public PModel={};
    @Input() PData = {apikey: this.rest.APIKey, basket_id:''  };
    basketName;
    public ServiceData;
    // public image_url = this.rest.ImageBasketUrl;
    // public imageProduct = this.rest.featureImageUrl;
    public image_url = this.rest.cdn_assets_url;
    public imageProduct = this.rest.cdn_assets_url;
    user_id

    constructor(private rest:RestService ,private navCtrl: NavController, public storage:Storage,public alertController: AlertController,
      public router:ActivatedRoute, private statusBar: StatusBar) {  
        this.PData.basket_id = this.router.snapshot.paramMap.get('basketID');
        this.basketName = this.router.snapshot.paramMap.get('basketName');
      }
  
  
    ngOnInit() {
      if( this.PData.basket_id){
        this.GetListing();
      }

      this.storage.get('id').then((val) => {
        this.user_id = val;
          if(val!='' && val!=null){
            this.chekBlock()
           }
      });
    }

    chekBlock(){
      this.storage.get('id').then((val) => {
       let key={
        "user_id": this.user_id,
        "apikey":this.PData.apikey
       }
        this.rest.userBlock(key).subscribe((result) => {});
      });
    }


  
    GetListing(){
      // console.log('-------------->'+JSON.stringify(this.PModel['select']))
    this.rest.present();
    this.rest.GlobalPHit(this.PData, '/User/basket_detail').subscribe((result) => {
      this.ServiceData = result;
      console.log(this.ServiceData);
      if(this.ServiceData.status== 1){
        this.rest.dismiss();
      }else{
        this.ErrorAlert();
        this.rest.dismiss()
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
  
  
  }
  