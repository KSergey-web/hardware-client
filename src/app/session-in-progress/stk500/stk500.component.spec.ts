import { ComponentFixture, TestBed } from '@angular/core/testing';

import { STK500Component } from './stk500.component';

describe('STK500Component', () => {
  let component: STK500Component;
  let fixture: ComponentFixture<STK500Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [STK500Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(STK500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
