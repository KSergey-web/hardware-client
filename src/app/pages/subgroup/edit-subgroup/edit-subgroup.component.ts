import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISubgroup } from 'src/app/interfaces/subgroup.interface';
import { SubgroupService } from 'src/app/services/subgroup.service';
import { CommonModalDialogBoxBuilder } from 'src/app/widgets/common-dialog-boxes/common-modal-dialog-box-builder.class';
import { INewSubgroup } from '../../managing-subgroups/interfaces/new-subgroup.interface';
import { ISubgroupFormProperties } from '../../managing-subgroups/subgroup-form/subgroup-form-properties.inteface';
@Component({
  selector: 'app-edit-subgroup',
  templateUrl: './edit-subgroup.component.html',
  styleUrls: ['./edit-subgroup.component.scss'],
})
export class EditSubgroupComponent implements OnInit, OnDestroy {
  @Input() subgroup?: ISubgroup;
  initValuesForForm?: ISubgroupFormProperties;

  constructor(
    private subgroupService: SubgroupService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.InitSubgroupForm();
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  private InitSubgroupForm() {
    this.initValuesForForm = {};
    this.initValuesForForm.acceptButtonText = 'Сохранить изменения';
    this.initValuesForForm.creator = this.subgroup?.creator;
    this.initValuesForForm.users = this.subgroup?.users;
    this.initValuesForForm.name = this.subgroup?.name;
  }

  onDissmis() {
    this.activeModal.dismiss();
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
    this.subgroupService
      .updateSubgroup(subgroup, this.subgroup!.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: () => this.activeModal.close(),
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
