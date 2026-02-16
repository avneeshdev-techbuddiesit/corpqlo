import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CheckoutPage } from './checkout.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';

const routes: Routes = [
  {
    path: '',
    component: CheckoutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
        IonicModule,
    FooterTabsModule,
    RouterModule.forChild(routes)
  ],
  providers:[InAppBrowser],
  declarations: [CheckoutPage]
})
export class CheckoutPageModule {}
