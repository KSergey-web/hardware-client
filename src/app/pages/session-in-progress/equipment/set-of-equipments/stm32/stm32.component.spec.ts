import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stm32Component } from './stm32.component';

describe('Stm32Component', () => {
  let component: Stm32Component;
  let fixture: ComponentFixture<Stm32Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Stm32Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Stm32Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
