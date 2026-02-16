import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDetailPage } from './search-detail.page';

describe('SearchDetailPage', () => {
  let component: SearchDetailPage;
  let fixture: ComponentFixture<SearchDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
