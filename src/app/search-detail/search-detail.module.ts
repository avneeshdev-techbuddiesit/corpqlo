import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SearchDetailPage } from './search-detail.page';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';  
import {FooterTabsModule} from '../footer-tabs/footer-tabs.module';

const routes: Routes = [
  {
    path: '',
    component: SearchDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FooterTabsModule,
    RouterModule.forChild(routes),
    Ng2FilterPipeModule
  ],
  declarations: [SearchDetailPage]
})
export class SearchDetailPageModule {}
