import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';


@Component({
  selector: 'app-subcategory-view',
  templateUrl: './subcategory-view.page.html',
  styleUrls: ['./subcategory-view.page.scss'],
})
export class SubcategoryViewPage implements OnInit {

  constructor(private navCtrl: NavController, private statusBar: StatusBar ) { }

  ngOnInit() {
  }
  route_sub_category_view(){
    // alert("he");    
     this.navCtrl.navigateForward('/product-view');
 
   }
   route_sub_category(){
    // alert("he");    
     this.navCtrl.navigateForward('/subcategory');
 
   }
 
}
