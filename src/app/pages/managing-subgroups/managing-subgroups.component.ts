import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaginationInfo } from 'src/app/interfaces/pagination-info.interface';
import { ISubgroup } from 'src/app/interfaces/subgroup.interface';
import { SubgroupService } from 'src/app/services/subgroup.service';
import { CreateSubgroupComponent } from './create-subgroup/create-subgroup.component';
import { IPaginatedSubroups } from './interfaces/paginated-subroups.interface';

@Component({
  selector: 'app-managing-subgroups',
  templateUrl: './managing-subgroups.component.html',
  styleUrls: ['./managing-subgroups.component.scss'],
})
export class ManagingSubgroupsComponent implements OnInit {
  constructor(
    private subgroupService: SubgroupService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  toSubgroup(subgroup: ISubgroup) {
    this.router.navigate([`main-page/subgroup/${subgroup.id}`]);
  }

  createSubgroup() {
    const modalRef = this.modalService.open(CreateSubgroupComponent, {
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

  filterByCreatorCurrentUser(event: any) {
    this.filterByCurrentCreator = event.target.checked;
    this.getSubgroups();
  }

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
