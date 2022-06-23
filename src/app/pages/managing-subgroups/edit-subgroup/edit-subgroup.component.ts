import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ISubgroup } from 'src/app/interfaces/subgroup.interface';
import { SubgroupService } from 'src/app/services/subgroup.service';
import { ISubgroupFormProperties } from '../subgroup-form/subgroup-form-properties.inteface';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModalDialogBoxBuilder } from 'src/app/widgets/common-dialog-boxes/common-modal-dialog-box-builder.class';
import { INewSubgroup } from '../interfaces/new-subgroup.interface';
@Component({
  selector: 'app-edit-subgroup',
  templateUrl: './edit-subgroup.component.html',
  styleUrls: ['./edit-subgroup.component.scss'],
})
export class EditSubgroupComponent implements OnInit, OnDestroy {
  @Input() subgroupId!: number;
  subgroup?: ISubgroup;
  initValuesForForm?: ISubgroupFormProperties;

  constructor(
    private subgroupService: SubgroupService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.getSubgroup(this.subgroupId);
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  getSubgroup(subgroupId: number) {
    this.subgroupService
      .getSubgroupById(subgroupId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((subgroup) => {
        this.subgroup = subgroup;
        this.InitSubgroupForm();
      }, this.SomeError.bind(this));
  }

  private InitSubgroupForm() {
    this.initValuesForForm = {};
    this.initValuesForForm.headerText = 'Редактирование подгруппы';
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
    this.subgroup!.name = subgroup.name;
    this.subgroup!.users = subgroup.users;
    this.subgroupService.updateSubgroup(this.subgroup!).subscribe({
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
