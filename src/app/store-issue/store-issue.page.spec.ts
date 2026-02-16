import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreIssuePage } from './store-issue.page';

describe('StoreIssuePage', () => {
  let component: StoreIssuePage;
  let fixture: ComponentFixture<StoreIssuePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreIssuePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreIssuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
