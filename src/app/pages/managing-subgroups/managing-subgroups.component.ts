import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaginationInfo } from 'src/app/interfaces/pagination-info.interface';
import { ISubgroup } from 'src/app/interfaces/subgroup.interface';
import { SubgroupService } from 'src/app/services/subgroup.service';
import { IPaginatedSubroups } from './interfaces/paginated-subroups.interface';
import { SubgroupFormComponent } from './subgroup-form/subgroup-form.component';

@Component({
  selector: 'app-managing-subgroups',
  templateUrl: './managing-subgroups.component.html',
  styleUrls: ['./managing-subgroups.component.scss'],
})
export class ManagingSubgroupsComponent implements OnInit {
  constructor(
    private subgroupService: SubgroupService,
    private modalService: NgbModal
  ) {}

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  createSubgroup() {
    const modalRef = this.modalService.open(SubgroupFormComponent, {
      size: 'lg',
    });
    this.performResultModal(modalRef);
  }

  subgroups: ISubgroup[] = [];
  currentPage: number = 1;
  selectedPage: number = 1;
  pageCount: number = 1;
  totalCount: number = 0;

  filterByCurrentCreator = false;

  ngOnInit(): void {
    this.getSubgroups();
  }

  onChangePage(): void {
    if (this.selectedPage == this.currentPage) return;
    this.currentPage = this.selectedPage;
    this.getSubgroups();
  }

  private getSubgroups() {
    let fnGetSubgroups: () => Observable<IPaginatedSubroups>;
    if (this.filterByCurrentCreator) {
      fnGetSubgroups = this.subgroupService.getSubgroupsByCurrentCreator.bind(
        this.subgroupService
      );
    } else {
      fnGetSubgroups = this.subgroupService.getSubgroups.bind(
        this.subgroupService
      );
    }
    fnGetSubgroups()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: this.handleResponseSubroups.bind(this),
      });
  }

  handleResponseSubroups(res: {
    subgroups: ISubgroup[];
    pagination?: PaginationInfo;
  }): void {
    this.subgroups = res.subgroups;
    this.currentPage = res.pagination?.page ?? 1;
    this.pageCount = res.pagination?.pageCount ?? 1;
    this.totalCount = res.pagination?.total ?? 0;
  }

  // editSubgroup(session: ISubgroup): void {
  //   const modalRef = this.modalService.open(EditSubgroupComponent, {
  //     size: 'lg',
  //   });
  //   (modalRef.componentInstance as EditSubgroupComponent).editedSession =
  //     session;
  //   this.performResultModal(modalRef);
  // }

  private performResultModal(modalRef: NgbModalRef): void {
    modalRef.result.then(() => {
      this.getSubgroups();
    });
  }

  //   deleteSession($event: MouseEvent, session: ISession): void {
  //     $event.stopPropagation();
  //     this.sessionService
  //       .deleteSession(session)
  //       .pipe(takeUntil(this.onDestroy$))
  //       .subscribe(
  //         (res) => {
  //           this.getSessions();
  //         },
  //         (err) => {
  //           console.error(err);
  //           alert(`Не удалось удалить сессию`);
  //         }
  //       );
  //   }
}
