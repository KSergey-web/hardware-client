import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagingSubgroupsComponent } from './managing-subgroups.component';

describe('ManagingSubgroupsComponent', () => {
  let component: ManagingSubgroupsComponent;
  let fixture: ComponentFixture<ManagingSubgroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagingSubgroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagingSubgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
