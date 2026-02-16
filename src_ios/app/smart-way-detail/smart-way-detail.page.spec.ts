import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartWayDetailPage } from './smart-way-detail.page';

describe('SmartWayDetailPage', () => {
  let component: SmartWayDetailPage;
  let fixture: ComponentFixture<SmartWayDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartWayDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartWayDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
