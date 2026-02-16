import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";
import { IonicModule } from '@ionic/angular';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';
import { PrivacyPolicyPage } from './privacy-policy.page';

const routes: Routes = [
  {
    path: '',
    component: PrivacyPolicyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FooterTabsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PrivacyPolicyPage]
})
export class PrivacyPolicyPageModule {}
