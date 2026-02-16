import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MbExpressDetailPage } from './mb-express-detail.page';

describe('MbExpressDetailPage', () => {
  let component: MbExpressDetailPage;
  let fixture: ComponentFixture<MbExpressDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MbExpressDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MbExpressDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
