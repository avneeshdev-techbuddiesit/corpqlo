import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MbExpressPage } from './mb-express.page';

describe('MbExpressPage', () => {
  let component: MbExpressPage;
  let fixture: ComponentFixture<MbExpressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MbExpressPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MbExpressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
