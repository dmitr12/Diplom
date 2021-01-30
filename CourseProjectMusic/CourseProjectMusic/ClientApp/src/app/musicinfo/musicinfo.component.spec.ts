import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicinfoComponent } from './musicinfo.component';

describe('MusicinfoComponent', () => {
  let component: MusicinfoComponent;
  let fixture: ComponentFixture<MusicinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
