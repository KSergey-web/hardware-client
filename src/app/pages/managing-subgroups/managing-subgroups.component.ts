import { Component, OnInit } from '@angular/core';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { SubgroupFormComponent } from './subgroup-form/subgroup-form.component';

@Component({
  selector: 'app-managing-subgroups',
  templateUrl: './managing-subgroups.component.html',
  styleUrls: ['./managing-subgroups.component.scss'],
})
export class ManagingSubgroupsComponent implements OnInit {
  constructor(
    private sessionService: SessionService,
    private modalService: NgbModal
  ) {}

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  ngOnInit(): void {}

  private performResultModal(modalRef: NgbModalRef): void {
    modalRef.result.then(
      (result) => {},
      (reason) => {
        this.outDismissReason(reason);
      }
    );
  }

  createSubgroup() {
    const modalRef = this.modalService.open(SubgroupFormComponent, {
      size: 'lg',
    });
    this.performResultModal(modalRef);
  }

  private outDismissReason(reason: any): void {
    if (reason === ModalDismissReasons.ESC) {
      console.log('by pressing ESC');
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log('by clicking on a backdrop');
    } else {
      console.error(`with: ${reason}`);
    }
  }
}
