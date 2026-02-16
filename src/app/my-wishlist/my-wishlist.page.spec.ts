import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWishlistPage } from './my-wishlist.page';

describe('MyWishlistPage', () => {
  let component: MyWishlistPage;
  let fixture: ComponentFixture<MyWishlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWishlistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWishlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
