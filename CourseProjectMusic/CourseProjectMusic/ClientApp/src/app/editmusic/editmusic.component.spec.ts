import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmusicComponent } from './editmusic.component';

describe('EditmusicComponent', () => {
  let component: EditmusicComponent;
  let fixture: ComponentFixture<EditmusicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditmusicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditmusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
