import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PaymentPageRoutingModule } from './payment-routing.module';

import { PaymentPage } from './payment.page';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
        IonicModule,
    FooterTabsModule,
    PaymentPageRoutingModule
    ],
    providers:[InAppBrowser],
  declarations: [PaymentPage]
})
export class PaymentPageModule {}
