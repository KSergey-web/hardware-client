import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlteraDe1SoCComponent } from './altera-de1-so-c.component';

describe('AlteraDe1SoCComponent', () => {
  let component: AlteraDe1SoCComponent;
  let fixture: ComponentFixture<AlteraDe1SoCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlteraDe1SoCComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlteraDe1SoCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
