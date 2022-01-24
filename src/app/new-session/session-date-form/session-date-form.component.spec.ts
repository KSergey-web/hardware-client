import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionDateFormComponent } from './session-date-form.component';

describe('SessionDateFormComponent', () => {
  let component: SessionDateFormComponent;
  let fixture: ComponentFixture<SessionDateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionDateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionDateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
