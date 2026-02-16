import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderSucessPageRoutingModule } from './order-sucess-routing.module';

import { OrderSucessPage } from './order-sucess.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderSucessPageRoutingModule
  ],
  declarations: [OrderSucessPage]
})
export class OrderSucessPageModule {}
