import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NgxSpinnerService } from "ngx-spinner";


import * as $ from 'jquery';
 
@Component({
  selector: 'app-basket-detail-page',
  templateUrl: './basket-detail-page.page.html',
  styleUrls: ['./basket-detail-page.page.scss'],
})
export class BasketDetailPagePage implements OnInit {
  public PModel={};
  //user_id
   // basket_id
   // duplicate_id
  
   @Input() PData_duplicate = {apikey: this.rest.APIKey, basket_id:'', user_id:'' ,duplicate_id:'' };
  @Input() PData2 = {apikey: this.rest.APIKey, basket_id:'', user_id:'' ,duplicate_basket:'',basket_variant_id:'' };
  @Input() PData = {apikey: this.rest.APIKey, store_id:'' , user_id:''  };
  @Input() PData_add = {apikey: this.rest.APIKey, store_id:'' ,user_id:'',basket_id:'',duplicate_basket:'',basket_variant_id:'',basket_size:'',basket_price:'',total_basket_amount:'',
   total_basket_items:'',basket_discount:'',ids:'',qnty:'',action:'',};
   @Input() PData_delete = {apikey: this.rest.APIKey,user_id:'',basketId:'',duplicate_basket:'',action:''}
   @Input() PData_upgrade = {apikey: this.rest.APIKey,user_id:'',basketId:'',duplicate_basket:'',action:'',basket_size:'',basket_price:''}
    basketName;
  public ServiceData;
  public srvice_dta;
  public image_url = this.rest.cdn_upload_url+'basket/';
  public imageProduct = this.rest.cdn_product_compress_url;
  public CartNotification = this.rest.cdn_product_compress_url;
  public pid =[];
  public pqty=[];
  public item_qty=0;
  public count_itm;
  public addNotification;
  public chk_cur_bsize;
  public chk_max;
  public total=0;
  public total2=0;
  public total_itm=0;
  public ready=0;
  public parent_id_upg;
  public basket_price_upg;
  public tot_bprice;
  public duplicate_basket2;
  public basket_variant_id;

  constructor(private rest:RestService ,private navCtrl: NavController, public storage:Storage,public alertController: AlertController,
    public router:ActivatedRoute, private statusBar: StatusBar,
    private spinner: NgxSpinnerService,) {  
     this.PData2.basket_id = this.router.snapshot.paramMap.get('basketID');
      this.basketName = this.router.snapshot.paramMap.get('basketName');
      this.PData_add.basket_variant_id =  this.PData2.basket_variant_id=  this.basket_variant_id = this.router.snapshot.paramMap.get('basket_variant_id');
     // duplicate_basket
    
    }


  ngOnInit() {
  }
    ionViewWillEnter(){



     // alert(  this.PData_add.duplicate_basket);
     this.PData2.basket_variant_id= "";
     this.PData_add.basket_variant_id="";
      this.pid =[];
              this.pqty=[];
            this.item_qty=0;
    this.storage.get('id').then((val) =>{
      this.PData.user_id = val;
      this.PData_add.user_id = val;
      this.PData2.user_id = val;
      this.PData_duplicate.user_id = val;
      this.PData_delete.user_id = val;
      this.PData_upgrade.user_id = val;
      this.PData_add.duplicate_basket="";
      this.PData2.duplicate_basket="";
      //duplicate_basket
      if(val!='' && val!=null){this.chekBlock()}
      this.duplicate_basket2 = this.router.snapshot.paramMap.get('duplicate_basket');
      this.PData_add.basket_variant_id =  this.PData2.basket_variant_id=  this.basket_variant_id = this.router.snapshot.paramMap.get('basket_variant_id');

     
      if(this.duplicate_basket2 && this.duplicate_basket2 !='undefined'){
        this.PData_delete.duplicate_basket =  this.duplicate_basket2 = this.router.snapshot.paramMap.get('duplicate_basket');
    
        this.PData_add.duplicate_basket =  this.duplicate_basket2 ;
        this.PData2.duplicate_basket = this.duplicate_basket2 ;
      }else{
        this.PData_delete.duplicate_basket =  this.duplicate_basket2 ="";

        this.PData_add.duplicate_basket =  this.duplicate_basket2 ="";
        this.PData2.duplicate_basket = "";
      }

      if(this.basket_variant_id && this.basket_variant_id !='undefined'){
        this.PData_add.basket_variant_id =  this.PData2.basket_variant_id= this.basket_variant_id;

      }else{
        this.PData2.basket_variant_id= "";
      }
   

      this.storage.get('storeID').then((storeID) => {
        this.PData.store_id = storeID;
       // this.GetListing();
       if( this.PData2.basket_id){
        this.GetListing();
      }
       
       });
    })
   
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

  /*$(document).ready(function(){
    $(".new_add_btn_2 > button").click(function(){
      $(this).parent(".new_add_btn_2").hide();
      $(this).parent(".new_add_btn_2").next(".product_qty").fadeIn();
    })
  });

  //custom basket

  $(document).ready(function(){
    $(".cstm_bskt_add_to_cart > button").click(function(){
      $(this).parent(".cstm_bskt_add_to_cart").hide();
      $(this).parent(".cstm_bskt_add_to_cart").next(".cstm_options").fadeIn();
    })
  });*/
  
  GetCartNotification(){
   // this.rest.present();
    this.rest.GlobalPHit(this.PData, 'Cart/count_cart').subscribe((result2) => {
      this.CartNotification = result2;
     if(this.CartNotification['status'] == '1'){
      //  this.rest.dismiss();
     }else{
        //this.ErrorAlert2();
       // this.rest.dismiss()
       
      }
    }, (err) => {
     // this.rest.dismiss()
      console.log(err);
    });
  }
  async ErrorAlert2() {
    const alert = await this.alertController.create({
      message:this.CartNotification['message'],
      buttons: ['OK']
    });
    await alert.present();
  }
  GetListing(){
    // console.log('-------------->'+JSON.stringify(this.PModel['select']))
  //this.rest.present();
  
 this.spinner.show();
 
  this.rest.GlobalPHit(this.PData2, '/User/basket_detail').subscribe((result) => {
    this.ServiceData = result;
    //this.rest.dismiss();
    this.spinner.hide();
    console.log(this.ServiceData);
    if(this.ServiceData.status== 1){
      this.chk_max = this.ServiceData.max_size;
      this.chk_cur_bsize = this.ServiceData.basket_data.current_basket_size;
      this.basket_price_upg = this.ServiceData.basket_data.basket_price;
      this.basketName =this.ServiceData.basket_data.title;
    //  this.parent_id_upg = this.ServiceData.basket_data.parent_id;
       this.parent_id_upg = this.ServiceData.basket_data.id;
      var total_basket_price =0;
      this.ServiceData.productList.forEach(items => {
        if(items.cart_qnty!=''){
        this.pid.push(items.vid);
        this.pqty.push(items.cart_qnty);
        total_basket_price += Number(items.product_prices) * Number(items.cart_qnty);
        }
      });


      this.tot_bprice = total_basket_price + Number(this.basket_price_upg);

      this.total_itm=0;
      this.ServiceData.basket_data.cart_item_qnty.forEach(items2 => {
        this.total_itm += Number(items2);
        });

      this.GetCartNotification();
                 //****************************//
                  //  $(".cstm_bskt_add_to_cart").hide();
                 //   $(".cstm_options").css("display","block");
                  //****************************//

    //  this.rest.dismiss();
    }else{
      this.ErrorAlert();
     
    }
  }, (err) => {
    this.spinner.hide();//this.rest.dismiss()
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


add_in_basketstock(pids,pvid,qty){
  this.item_qty = 1;
  this.total=0;


  this.pqty.forEach(item245 => {
    if(item245 !=''){
      this.total += Number(item245);
     // itemyy=1;
       // this.pqty[ite]=  this.item_qty;
    }
    ite++;
  });

  //alert(this.total);
if(this.total < this.chk_cur_bsize){
  this.total_itm=this.total+1;

   //************************************************************************************** */
   var ite=0;
   var itemyy=0;
   this.pid.forEach(item2 => {
   if(item2==pvid){
     itemyy=1;
       this.pqty[ite]=  this.item_qty;
   }
   ite++;
 });
 if(itemyy!=1){
   this.pid.push(pvid);
   this.pqty.push(this.item_qty);
 }
 console.log(this.pid);
 console.log(this.pqty);
//************************************************************************************** */
   var ick=0;
   var qc_ckh=0;
   
   this.pqty.forEach(item => {
   // alert(this.chk_cur_bsize +"_"+   this.chk_max);
     if(item!=''){
       //this.total += Number(item);
       if(this.total > this.chk_cur_bsize){
         qc_ckh=1;
         if(Number(this.chk_max) > Number(this.chk_cur_bsize)){
           var r = confirm("Do You want to updagrade Your Basket ?");
           if (r == true) {
             this.upgrade_basket();
           }
         }else{
           alert("You are using Max Basket Size");
         }
               
       }
     }
     ick++;
   });


   if(qc_ckh==0){
     $(".count_2"+pids).text(1);
     $(".after_2"+pids).show();
     $(".new_2"+pids).hide();
   }
 //************************************************************************************** */

}else{
  if(Number(this.chk_max) > Number(this.chk_cur_bsize)){
    var r = confirm("Do You want to updagrade Your Basket ?");
    if (r == true) {
      this.upgrade_basket();
    }
  }else{
    alert("You are using Max Basket Size");
  }
}
 
 
}

inc2(pr_id2,wids3){

  this.total=0;
  this.pqty.forEach(item4533 => {
    if(item4533!=''){
      this.total += Number(item4533);
     
    }
   // ick2++;
  });


  if(this.total < this.chk_cur_bsize){
  //  alert(this.total);
           //****************************************** */
    this.item_qty = Number($(".count_2"+pr_id2).first().text());
    this.item_qty += 1;

    this.total_itm= this.total_itm+1;
    var inm=0;
    this.pid.forEach(itemfg => {
      if(itemfg==wids3){
        this.pqty[inm]= this.item_qty;
      }
      console.log(this.pid);
      console.log(this.pqty);
      inm++;
    });
   console.log(this.pid);
   console.log(this.pqty);
     var ick2 = 0;
    
     this.ready=0;
    this.pqty.forEach(item45 => {
      if(item45!=''){
       // this.total += Number(item45);
        if(this.total > this.chk_cur_bsize){
              this.ready=1;
              //alert(this.chk_max+"_"+ this.chk_cur_bsize);
          //alert(this.total > this.chk_cur_bsize);
           if(Number(this.chk_max) > Number(this.chk_cur_bsize)){
           // alert("max size want to updaet");
           var r = confirm("Do You want to updagrade Your Basket ?");
            if (r == true) {
              this.upgrade_basket();
            }
           
           }else{
            alert("You are using Max Basket Size");
           }
                 
        }
      }
      ick2++;
    });
  
        if(this.ready==0){
            $(".count_2"+pr_id2).text('');
          $(".count_2"+pr_id2).text(this.item_qty);
         
        }
           //****************************************** */
  }else{
   // if(this.total > this.chk_cur_bsize){
     // this.ready=1;
   if(Number(this.chk_max) > Number(this.chk_cur_bsize)){
   var r = confirm("Do You want to updagrade Your Basket ?");
    if (r == true) {
      this.upgrade_basket();
    }
   
   }else{
    alert("You are using Max Basket Size");
   }
         
//}
  }


 
  }

 ////decrements item
dec2(pr_id2,wids4){
  this.item_qty = Number($(".count_2"+pr_id2).first().text());
  if(this.item_qty-1 < 1){
    this.item_qty = 0;
    if(this.total_itm ==1 || this.total_itm==0 ){
      this.total_itm = 0;
    }else{
      this.total_itm = this.total_itm-1;
    }
    

    
   $(".after_2"+pr_id2).hide();
  $(".new_2"+pr_id2).show();
  $(".count_2"+pr_id2).text('');
 //$(".count_2"+pr_id2).text(this.item_qty);

  var it=0;
  this.pid.forEach(item => {
   if(item==wids4){
     if(this.item_qty==0){
      this.pqty[it]= "";
     this.pid[it]= "";
     }
   }
   console.log(this.pid);
   console.log(this.pqty);
   it++;
 });
  
  }
  else{
    this.item_qty -= 1;
   // $(".count_2"+pr_id2).text(this.item_qty);

   this.total_itm = this.total_itm-1;

    var it=0;
    this.pid.forEach(item => {
     if(item==wids4){
       this.pqty[it]= this.item_qty;
     }
     console.log(this.pid);
     console.log(this.pqty);
     it++;
   });
  }


  var ick2 = 0;
  this.total2=0;
  var ready2=0;
 this.pqty.forEach(item456 => {
   if(item456!=''){
     this.total2 += Number(item456);
     if(this.total2 > this.chk_cur_bsize){
     //  alert(this.ready);
           ready2=1;
       //alert(this.total > this.chk_cur_bsize);
       if(Number(this.chk_max) > Number(this.chk_cur_bsize)){
        var r = confirm("Do You want to updagrade Your Basket ?");
        if (r == true) {
          this.upgrade_basket();
        }
        }else{
         alert("You are using Max Basket Size");
        }
              
     }
   }
   ick2++;
 });

  if(ready2==0){
    $(".count_2"+pr_id2).text('');
    $(".count_2"+pr_id2).text(this.item_qty);
 
}


  }


  add_cart_basket_final(baskt_id,var_id,bsize,bprice,bdiscount){
      
      var fbt = 0;
      var yt = 0;
      this.count_itm = 0;
    //**************************************************************************************** *//
      var ick2 = 0;
      this.total2=0;
      var ready2=0;
      this.pqty.forEach(item456 => {
     //    var abdnm = Number(item456);
      if(item456!=''){
        this.total2 += Number(item456);
        if(this.total2 > this.chk_cur_bsize){
              ready2=1;
          if(Number(this.chk_max) > Number(this.chk_cur_bsize)){
            var r = confirm("Do You want to updagrade Your Basket ?");
            if (r == true) {
              this.upgrade_basket();
            }
            }else{
            alert("You are using Max Basket Size");
            }       
        }
      }
      ick2++;
    });
 //**************************************************************************************** *//
  if(ready2==0){
          var total_basket_price =0;
        if(this.pid){
          this.pid.forEach(items => {
            if(items!=''){
              yt =1;
              this.PData_add.ids += items +",";
              this.PData_add.qnty += this.pqty[fbt] +",";

              this.ServiceData.productList.forEach(itemsp => {
                if(itemsp.vid == items){
                  total_basket_price += Number(itemsp.product_prices) * this.pqty[fbt];
                
                }
              });


              this.count_itm++;
            }
            fbt++;
          });
        }
              
       this.tot_bprice = total_basket_price + Number(bprice);
        //alert(this.tot_bprice);
        if(yt==0){
          this.ErrorAlertcustom();
        }else{
          $(".cstm_bskt_add_to_cart").hide();
          $(".cstm_options").css("display","block");
          this.PData_add.basket_id=baskt_id;
          this.PData_add.basket_variant_id=this.basket_variant_id;
          this.PData_add.basket_size=bsize;
         // this.PData_add.duplicate_basket="";
          this.PData_add.basket_price = bprice;
          this.PData_add.basket_discount = bdiscount;
          this.PData_add.total_basket_items = this.count_itm;
          this.PData_add.total_basket_amount =  this.tot_bprice;
          //this.rest.present();
          this.spinner.show();
          this.rest.GlobalPHit(this.PData_add, 'Cart/addToBasket').subscribe((result2) => {
            this.spinner.hide();
            this.addNotification = result2;
          if(this.addNotification['status'] == '1'){
            this.GetListing_after();
              this.GetCartNotification();
              //this.rest.dismiss();
          }else{
            this.spinner.hide();// this.rest.dismiss()
            }
          }, (err) => {
            console.log(err);
          });
        }
    }
  }

  async ErrorAlertcustom() {
    const alert = await this.alertController.create({
      message:"Add Item to Basket First !",
      buttons: ['OK']
    });
    await alert.present();
  }

  remove_basket(baskt_id){
    $(".cstm_bskt_add_to_cart").show();
    $(".cstm_options").css("display","none");
    this.PData_delete.basketId=baskt_id;
    this.PData_delete.action="delete";
   // this.rest.present();
   this.spinner.show();
   
    this.rest.GlobalPHit(this.PData_delete, 'Cart/remove_basket').subscribe((result23) => {
      this.spinner.hide();
      this.addNotification = result23;
     if(this.addNotification['status'] == '1'){
      this.pid=[];
      this.pqty=[];
      this.PData_add.duplicate_basket="";
     // var total_basket_price ="";
      this.PData_add.total_basket_amount = "";
      this.tot_bprice ="";

      if(this.duplicate_basket2){
        this.ServiceData.is_duplicate="";
        this.PData2.duplicate_basket =    this.duplicate_basket2 = "";
      }
      //this.PData2.duplicate_basket =    this.duplicate_basket2 = this.router.snapshot.paramMap.get('duplicate_basket');
      this.PData2.basket_id = this.router.snapshot.paramMap.get('basketID');
      this.basketName = this.router.snapshot.paramMap.get('basketName');
      this.PData2.basket_variant_id=  this.basket_variant_id = this.router.snapshot.paramMap.get('basket_variant_id');
      this.GetListing_after();
      this.GetCartNotification();
       // this.rest.dismiss();
     }else{
      this.spinner.hide();// this.rest.dismiss()
      }
    }, (err) => {
      this.spinner.hide();// this.rest.dismiss()
      console.log(err);
    });
  }



  update_cart_basket_final(baskt_id,var_id,bsize,bprice,bdiscount){
    console.log(this.pqty);
    var fbt = 0;
    var yt = 0;
    this.count_itm = 0;
  //**************************************************************************************** *//
      var ick2 = 0;
      this.total2=0;
      var ready2=0;
      this.pqty.forEach(item456 => {
      if(item456!=''){

      //  alert(item456);
        this.total2 += Number(item456);
       // alert();
        if(this.total2 > this.chk_cur_bsize){
              ready2=1;
             // alert(this.chk_max+"_"+ this.chk_cur_bsize);
              if(Number(this.chk_max) > Number(this.chk_cur_bsize)){
                var r = confirm("Do You want to updagrade Your Basket ?");
                if (r == true) {
                  this.upgrade_basket();
                }
            }else{
            alert("You are using Max Basket Size");
            }       
        }
      }
      ick2++;
    });
   // alert(this.total2);
 //**************************************************************************************** *//
  //  alert(ready2);
      if(ready2==0){
        var total_basket_price =0;
      if(this.pid){
        this.PData_add.ids="";
        this.PData_add.qnty="";
        this.pid.forEach(items => {
          if(items!=''){

           // alert(items);
            yt =1;
           // alert(fbt+"_"+items+"_"+this.pqty[fbt]);
            this.PData_add.ids += items +",";
            this.PData_add.qnty += this.pqty[fbt] +",";

            this.ServiceData.productList.forEach(itemsp => {
              if(itemsp.vid == items){
                total_basket_price += Number(itemsp.product_prices) * this.pqty[fbt];              
              }
            });
            this.count_itm++;
          }
          fbt++;
        });
      }
      this.tot_bprice = total_basket_price + Number(bprice);
      if(yt==0){
        this.ErrorAlertcustom();
      }else{
           // alert();
        $(".cstm_bskt_add_to_cart").hide();
        $(".cstm_options").css("display","block");
        this.PData_add.basket_id=baskt_id;
       // this.PData_add.basket_variant_id=var_id;
        this.PData_add.action="update";

        //alert(this.PData_add.duplicate_basket);
       // this.PData_add.duplicate_basket="";
        this.PData_add.basket_size=bsize;
        this.PData_add.basket_price = bprice;
        this.PData_add.basket_discount = bdiscount;
        this.PData_add.total_basket_items = this.count_itm;
        this.PData_add.total_basket_amount =   this.tot_bprice;
        //this.rest.present();
        this.spinner.show();
        this.rest.GlobalPHit(this.PData_add, 'Cart/addToBasket').subscribe((result2) => {
          this.addNotification = result2;
        if(this.addNotification['status'] == '1'){
          this.spinner.hide();//this.rest.dismiss();
        }else{
            //this.ErrorAlert2();
            this.spinner.hide();//this.rest.dismiss()
          }
        }, (err) => {
          console.log(err);
        });
      }

    }
  }


  upgrade_basket(){
    this.PData_upgrade.basketId=this.PData2.basket_id;
    //this.PData_upgrade.basketId=this.parent_id_upg;
    this.PData_upgrade.action="upgrade";
   // this.PData_upgrade.duplicate_basket="";
    this.PData_upgrade.basket_size	= this.chk_cur_bsize ;
    this.PData_upgrade.basket_price= this.basket_price_upg;
    this.spinner.show();//this.rest.present();
    this.rest.GlobalPHit(this.PData_upgrade, 'Cart/upgradebasket').subscribe((result23) => {
      this.addNotification = result23;
      
     if(this.addNotification['status'] == '1'){

     // this.chk_max = this.addNotification.max_size;
      this.chk_cur_bsize = this.addNotification.data.basket_size;
      this.ServiceData.basket_data.title= this.addNotification.data.title;
      this.basketName =this.addNotification.data.title;
      this.ServiceData.basket_data.basket_size =   this.ServiceData.basket_data.current_basket_size= this.addNotification.data.basket_size;

      this.ServiceData.basket_data.basket_price = this.addNotification.data.basket_price;
      this.ServiceData.basket_data.id = this.parent_id_upg = this.addNotification.data.id;
      this.PData_add.basket_variant_id= this.PData2.basket_variant_id= this.basket_variant_id =this.addNotification.data.id;///

      this.ServiceData.basket_data.image = this.addNotification.data.image;
      this.ServiceData.basket_data.description = this.addNotification.data.description;
      var total_basket_price =0;
     /* this.ServiceData.productList.forEach(items => {
        if(items.cart_qnty!=''){
        this.pid.push(items.vid);
        this.pqty.push(items.cart_qnty);
        total_basket_price += Number(items.product_prices) * Number(items.cart_qnty);
        }
      });*/


      this.tot_bprice = total_basket_price + Number(this.addNotification.data.basket_price);
//alert(this.chk_max+"-"+this.chk_cur_bsize);
      this.spinner.hide();
   //   this.GetListing_after();
     }else{
      this.spinner.hide();//this.rest.dismiss()
      }
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    });
  }


  duplicate_basket(baskt_id,var_id,bsize,bprice,bdiscount){
    /*this.ServiceData.productList.forEach(items => {
      items.cart_qnty="";
    });*/
    this.spinner.show();//this.rest.present();
  /*  this.pid=[];
    this.pqty=[];
    this.ServiceData.basket_data.is_in_cart="";*/
    console.log( this.ServiceData.productList);
    
    this.rest.GlobalPHit(this.PData, 'User/generate_duplicate_basket').subscribe((result233) => {
      this.srvice_dta = result233;
     if(this.srvice_dta['status'] == '1'){
      var dp_id = this.srvice_dta['basket_duplicate_id'];
      this.PData_add.duplicate_basket=dp_id;
      this.PData_delete.duplicate_basket=dp_id;
      this.send_duplicate(baskt_id,dp_id);
       console.log( this.srvice_dta)
       this.spinner.hide();//  this.rest.dismiss();
     }else{
      this.spinner.hide();// this.rest.dismiss()
      }
    }, (err) => {
      console.log(err);
    });
  }

  send_duplicate(basket_id,duplicate_id){
    //user_id
       this.PData_duplicate.basket_id=basket_id;
       this.PData_duplicate.duplicate_id=duplicate_id;


    this.rest.GlobalPHit(this.PData_duplicate, 'Cart/duplicate_basket').subscribe((result233) => {
      this.srvice_dta = result233;
     if(this.srvice_dta['status'] == '1'){
      var dp_id = this.srvice_dta['basket_duplicate_id'];
      this.PData_add.duplicate_basket=dp_id;
      this.PData_delete.duplicate_basket=dp_id;
      //this.add_cart_basket_final_duplicate(baskt_id,var_id,bsize,bprice,bdiscount,dp_id);
       console.log( this.srvice_dta)
       this.spinner.hide();
      // this.GetListing();
       this.GetListing_after();
       this.GetCartNotification();
      //  this.rest.dismiss();
     }else{
      this.spinner.hide();// this.rest.dismiss()
      }
    }, (err) => {
      console.log(err);
    });
  }


  add_cart_basket_final_duplicate(baskt_id,var_id,bsize,bprice,bdiscount,dp_id){

    //alert(dp_id);
      
    var fbt = 0;
    var yt = 0;
    this.count_itm = 0;
  //**************************************************************************************** *//
    var ick2 = 0;
    this.total2=0;
    var ready2=0;
    this.pqty.forEach(item456 => {
    if(item456!=''){
      this.total2 += Number(item456);
      if(this.total2 > this.chk_cur_bsize){
      //  alert(this.ready);
            ready2=1;
        //alert(this.total > this.chk_cur_bsize);
        if(Number(this.chk_max) > Number(this.chk_cur_bsize)){
          var r = confirm("Do You want to updagrade Your Basket ?");
          if (r == true) {
            this.upgrade_basket();
          }
          }else{
          alert("You are using Max Basket Size");
          }       
      }
    }
    ick2++;
  });
//**************************************************************************************** *//
//alert(ready2);
if(ready2==0){
      if(this.pid){
        this.pid.forEach(items => {
          if(items!=''){
            yt =1;
           // alert(fbt+"_"+items+"_"+this.pqty[fbt]);
            this.PData_add.ids += items +",";
            this.PData_add.qnty += this.pqty[fbt] +",";
            this.count_itm++;
          }
          fbt++;
        });
      }
      if(yt==0){
        this.ErrorAlertcustom();
      }else{
        $(".cstm_bskt_add_to_cart").hide();
        $(".cstm_options").css("display","block");
        this.PData_add.basket_id=baskt_id;
        this.PData_add.basket_variant_id=var_id;
        this.PData_add.duplicate_basket=dp_id;
        this.PData_add.basket_size=bsize;
        this.PData_add.basket_price = bprice;
        this.PData_add.basket_discount = bdiscount;
        this.PData_add.total_basket_items = this.count_itm;
        this.PData_add.total_basket_amount = bprice + Number(this.count_itm);
        this.spinner.hide();// this.rest.present();
        this.rest.GlobalPHit(this.PData_add, 'Cart/addToBasket').subscribe((result2) => {
          this.addNotification = result2;
          this.spinner.hide();
        if(this.addNotification['status'] == '1'){
          // this.GetListing_after();
            this.GetCartNotification();
            //this.rest.dismiss();
        }else{
          this.spinner.hide();//this.rest.dismiss()
          }
        }, (err) => {
          console.log(err);
        });
      }
  }
}



   GetListing_after(){
      this.rest.GlobalPHit(this.PData2, '/User/basket_detail').subscribe((result) => {
        this.ServiceData = result;

        this.pid=[];
        this.pqty=[];
        
        console.log(this.ServiceData);
        if(this.ServiceData.status== 1){
          this.chk_max = this.ServiceData.max_size;
          this.chk_cur_bsize = this.ServiceData.basket_data.current_basket_size;
          this.basket_price_upg = this.ServiceData.basket_data.basket_price;
         // this.parent_id_upg = this.ServiceData.basket_data.parent_id;
        //  this.parent_id_upg = this.ServiceData.basket_data.id;
          this.ServiceData.productList.forEach(items => {
            if(items.cart_qnty!=''){
            this.pid.push(items.vid);
            this.pqty.push(items.cart_qnty);
            }
          });
          this.total_itm=0;
          this.ServiceData.basket_data.cart_item_qnty.forEach(items2 => {
            this.total_itm += Number(items2);
            });
         // this.rest.dismiss();
        }else{
          //this.spinner.hide();
          this.ErrorAlert();
         // this.rest.dismiss()
        }
      }, (err) => {
        console.log(err);
      });
    }


    AddCombo_login(){
      this.ErrorAlert5();
      this.navCtrl.navigateForward('/sign-in');
      }
    async ErrorAlert5() {
      const alert = await this.alertController.create({
        message:"Please Login First !",
        buttons: ['OK']
      });
      await alert.present();
    }

    
  route_sub_category_view(pid,ProductName){  
    this.storage.set('pid',pid);
    this.navCtrl.navigateForward(['/product-view',{ProductID:pid,ProductName:ProductName}]);

  }

}
