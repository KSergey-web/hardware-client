import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISubgroup } from 'src/app/interfaces/subgroup.interface';
import { SubgroupService } from 'src/app/services/subgroup.service';
import { EditSubgroupComponent } from './edit-subgroup/edit-subgroup.component';
@Component({
  selector: 'app-subgroup',
  templateUrl: './subgroup.component.html',
  styleUrls: ['./subgroup.component.scss'],
})
export class SubgroupComponent implements OnInit, OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
    private subgroupService: SubgroupService,
    private modalService: NgbModal
  ) {}

  editSubgroup() {
    const modalRef = this.modalService.open(EditSubgroupComponent, {
      size: 'lg',
    });
    (modalRef.componentInstance as EditSubgroupComponent).subgroup =
      this.subgroup;
    modalRef.closed
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.getSubgroup());
  }

  private onDestroy$ = new Subject<boolean>();
  subgroup!: ISubgroup;

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subgroup }) => {
      this.subgroup = subgroup;
    });
  }

  private getSubgroup(): void {
    this.subgroupService
      .getSubgroupById(this.subgroup!.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((subgroup) => (this.subgroup = subgroup));
  }
}
