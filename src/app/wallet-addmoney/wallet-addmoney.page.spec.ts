import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletAddmoneyPage } from './wallet-addmoney.page';

describe('WalletAddmoneyPage', () => {
  let component: WalletAddmoneyPage;
  let fixture: ComponentFixture<WalletAddmoneyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletAddmoneyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletAddmoneyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
