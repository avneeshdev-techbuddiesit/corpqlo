import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';
import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from "ngx-spinner";
import { ChangePasswordPage } from './change-password.page';

const routes: Routes = [
  {
    path: '',
    component: ChangePasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FormsModule,
        IonicModule,
    FooterTabsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChangePasswordPage]
})
export class ChangePasswordPageModule {}
