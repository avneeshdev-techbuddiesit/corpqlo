import { NgModule } from '@angular/core';
// import { Animation } from '@ionic/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { OfferListPageModule } from '../app/offer-list/offer-list.module';
// import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { FilterModalPageModule } from './filter-modal/filter-modal.module';
import { FileTransfer, FileTransferObject  } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { AnimatorModule } from 'css-animator';
import { OrderSucessPageModule } from './order-sucess/order-sucess.module';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  
  imports: [            
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    FilterPipeModule,
    BrowserAnimationsModule,
    OfferListPageModule,
    FilterModalPageModule,
      AnimatorModule,
    OrderSucessPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    // GooglePlus,
    // Facebook,
    NativeGeocoder,
    SocialSharing,
    SpeechRecognition,
    // FCM,
    FileTransfer,
    FileTransferObject,
    File,
   { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
