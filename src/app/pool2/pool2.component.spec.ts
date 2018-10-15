import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Pool2Component } from './pool2.component';

describe('Pool2Component', () => {
  let component: Pool2Component;
  let fixture: ComponentFixture<Pool2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pool2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pool2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
