import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TryConnectToSessionComponent } from './try-connect-to-session.component';

describe('TryConnectToSessionComponent', () => {
  let component: TryConnectToSessionComponent;
  let fixture: ComponentFixture<TryConnectToSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TryConnectToSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TryConnectToSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
