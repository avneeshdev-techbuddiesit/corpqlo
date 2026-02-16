import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboListingPage } from './combo-listing.page';

describe('ComboListingPage', () => {
  let component: ComboListingPage;
  let fixture: ComponentFixture<ComboListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComboListingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
