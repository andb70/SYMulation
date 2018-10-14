import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Pool1Component } from './pool1.component';

describe('Pool1Component', () => {
  let component: Pool1Component;
  let fixture: ComponentFixture<Pool1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pool1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pool1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
