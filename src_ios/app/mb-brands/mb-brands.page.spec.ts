import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MbBrandsPage } from './mb-brands.page';

describe('MbBrandsPage', () => {
  let component: MbBrandsPage;
  let fixture: ComponentFixture<MbBrandsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MbBrandsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MbBrandsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
