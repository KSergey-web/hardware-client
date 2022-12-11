import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { IEquipment } from 'src/app/interfaces/equipment.interface';
import { EquipmentService } from 'src/app/services/equipment.service';
import { INewBooking } from './booking.interface';
import { IBookingFormProperties } from './subgroup-form-properties.inteface';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
})
export class BookingFormComponent implements OnInit, OnDestroy {
  @Input() subgroupId!: number;

  bookingForm!: FormGroup;
  acceptButtonText = 'Ок';
  begin?: Date;
  end?: Date;
  equipments: IEquipment[] = [];

  private getEquipments(): void {
    this.equipmentService
      .getEquipments()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((equipments: IEquipment[]) => {
        this.equipments = equipments;
      });
  }

  // private setEquipmentToFormById(equipmentId: number): void {
  //   const indEquip = this.equipments.findIndex(
  //     (equipment) => equipment.id == equipmentId
  //   );
  //   this.bookingForm.controls.equipment.setValue(indEquip);
  // }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  @Input() initValuesForForm!: IBookingFormProperties;
  @Output() onSubmit = new EventEmitter<INewBooking>();
  @Output() onDismiss = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private equipmentService: EquipmentService
  ) {
    this.initForm();
  }

  closeModal() {
    this.onDismiss.emit(true);
  }

  ngOnInit(): void {
    this.setInitValuesToForm();
    this.getEquipments();
  }

  private initForm(): void {
    this.bookingForm = this.formBuilder.group({
      session_duration: [
        30,
        [Validators.required, Validators.min(30), Validators.max(240)],
      ],
      max_sessions_count_per_day: [
        1,
        [Validators.required, Validators.min(1), Validators.max(30)],
      ],
      equipment: [null, Validators.required],
    });
  }

  isBookingInvalid(): boolean {
    return this.bookingForm.invalid;
  }

  getDataFromForm(): INewBooking {
    return {
      begin: this.begin,
      end: this.end,
      subgroup: this.subgroupId,
      equipment: this.bookingForm.controls.equipment.value,
      session_duration: this.bookingForm.controls.session_duration.value,
      max_sessions_count_per_day:
        this.bookingForm.controls.max_sessions_count_per_day.value,
    };
  }

  setInitValuesToForm() {
    this.bookingForm.controls.max_sessions_count_per_day.setValue(
      this.initValuesForForm!.max_sessions_count_per_day
    );
    this.bookingForm.controls.session_duration.setValue(
      this.initValuesForForm!.session_duration
    );
    if (this.initValuesForForm.equipmentId)
      this.bookingForm.controls.equipment.setValue(
        this.initValuesForForm.equipmentId
      );
    this.acceptButtonText = this.initValuesForForm.acceptButtonText ?? '';
    this.begin = this.initValuesForForm.begin;
    this.end = this.initValuesForForm.end;
  }

  submit() {
    const booking = this.getDataFromForm();
    this.onSubmit.emit(booking);
  }
}
