import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketListingPage } from './basket-listing.page';

describe('BasketListingPage', () => {
  let component: BasketListingPage;
  let fixture: ComponentFixture<BasketListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasketListingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
