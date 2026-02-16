import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MbExpressPage } from './mb-express.page';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';

const routes: Routes = [
  {
    path: '',
    component: MbExpressPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FooterTabsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MbExpressPage]
})
export class MbExpressPageModule {}
