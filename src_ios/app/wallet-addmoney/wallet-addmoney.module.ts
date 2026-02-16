import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { WalletAddmoneyPage } from './wallet-addmoney.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';

const routes: Routes = [
  {
    path: '',
    component: WalletAddmoneyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FooterTabsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers:[InAppBrowser],
  declarations: [WalletAddmoneyPage]
})
export class WalletAddmoneyPageModule {}
