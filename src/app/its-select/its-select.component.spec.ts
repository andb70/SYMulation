import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItsSelectComponent } from './its-select.component';

describe('ItsSelectComponent', () => {
  let component: ItsSelectComponent;
  let fixture: ComponentFixture<ItsSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItsSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
