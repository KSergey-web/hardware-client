import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubgroupFormComponent } from './subgroup-form.component';

describe('SubgroupFormComponent', () => {
  let component: SubgroupFormComponent;
  let fixture: ComponentFixture<SubgroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubgroupFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubgroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
