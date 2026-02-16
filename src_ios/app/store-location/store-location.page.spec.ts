import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreLocationPage } from './store-location.page';

describe('StoreLocationPage', () => {
  let component: StoreLocationPage;
  let fixture: ComponentFixture<StoreLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreLocationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
