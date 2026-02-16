import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FooterTabsComponent } from './footer-tabs.component';
@NgModule({
    imports: [CommonModule, FormsModule, IonicModule],
    declarations: [FooterTabsComponent],
    exports: [FooterTabsComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FooterTabsModule { }
