import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomBasketPage } from './custom-basket.page';

describe('CustomBasketPage', () => {
  let component: CustomBasketPage;
  let fixture: ComponentFixture<CustomBasketPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomBasketPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomBasketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
