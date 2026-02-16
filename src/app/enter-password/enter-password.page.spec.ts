import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterPasswordPage } from './enter-password.page';

describe('EnterPasswordPage', () => {
  let component: EnterPasswordPage;
  let fixture: ComponentFixture<EnterPasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterPasswordPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
