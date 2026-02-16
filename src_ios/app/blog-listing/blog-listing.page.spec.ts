import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogListingPage } from './blog-listing.page';

describe('BlogListingPage', () => {
  let component: BlogListingPage;
  let fixture: ComponentFixture<BlogListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogListingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
