import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmusicComponent } from './addmusic.component';

describe('AddmusicComponent', () => {
  let component: AddmusicComponent;
  let fixture: ComponentFixture<AddmusicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmusicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
