import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";

import { IonicModule } from '@ionic/angular';
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';
import { EditProfilePage } from './edit-profile.page';

const routes: Routes = [
  {
    path: '',
    component: EditProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FormsModule,
    FooterTabsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditProfilePage]
})
export class EditProfilePageModule {}
