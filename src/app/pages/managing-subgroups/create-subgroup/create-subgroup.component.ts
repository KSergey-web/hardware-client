import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { SubgroupService } from 'src/app/services/subgroup.service';
import { CommonModalDialogBoxBuilder } from 'src/app/widgets/common-dialog-boxes/common-modal-dialog-box-builder.class';
import { INewSubgroup } from '../interfaces/new-subgroup.interface';
import { ISubgroupFormProperties } from '../subgroup-form/subgroup-form-properties.inteface';

@Component({
  selector: 'app-create-subgroup',
  templateUrl: './create-subgroup.component.html',
  styleUrls: ['./create-subgroup.component.scss'],
})
export class CreateSubgroupComponent implements OnDestroy {
  initValuesForForm?: ISubgroupFormProperties;

  constructor(
    private subgroupService: SubgroupService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    this.InitSubgroupForm();
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onDissmis() {
    this.activeModal.dismiss();
  }

  private InitSubgroupForm() {
    this.initValuesForForm = {};
    this.initValuesForForm.headerText = 'Создание подгруппы';
    this.initValuesForForm.acceptButtonText = 'Создать';
  }

  SomeError(err: HttpErrorResponse) {
    console.error(err);
    const bulder = new CommonModalDialogBoxBuilder(this.modalService);
    bulder
      .addHeader('Ошибка')
      .addText('Что-то пошло не так')
      .setDangerStyle()
      .openAlertModal();
  }

  onSubmit(subgroup: INewSubgroup) {
    this.subgroupService.createSubgroup(subgroup).subscribe({
      next: (res) => this.activeModal.close(res),
      error: (err: HttpErrorResponse) => {
        console.log(err);
        const bulder = new CommonModalDialogBoxBuilder(this.modalService);
        bulder
          .addHeader('Ошибка')
          .addText(
            `Не удалось создать подгруппу. Статус ${err.status}. ${err.message}`
          )
          .setDangerStyle()
          .openAlertModal();
      },
    });
  }
}
