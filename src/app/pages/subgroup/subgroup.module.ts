import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbDatepickerModule,
  NgbModalModule,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { SharePipesModule } from 'src/app/share-pipes/share-pipes.module';
import { ManagingSubgroupsModule } from '../managing-subgroups/managing-subgroups.module';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { RangeDatePickerComponent } from './booking-form/range-date-picker/range-date-picker.component';
import { CreateBookingComponent } from './create-booking/create-booking.component';
import { CreateSessionByBookingComponent } from './create-session-by-booking/create-session-by-booking.component';
import { EditBookingComponent } from './edit-booking/edit-booking.component';
import { EditSubgroupComponent } from './edit-subgroup/edit-subgroup.component';
import { HideForbbidenElementsDirective } from './hide-forbbiden-elements.directive';
import { ListBookingsComponent } from './list-bookings/list-bookings.component';
import { SessionFormByBookingComponent } from './session-form-by-booking/session-form-by-booking.component';
import { SessionsInDateComponent } from './session-form-by-booking/sessions-in-date/sessions-in-date.component';
import { SubgroupComponent } from './subgroup.component';
import { SubgroupResolver } from './subgroup.resolver';

@NgModule({
  imports: [
    ManagingSubgroupsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModalModule,
    SharePipesModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
  ],
  exports: [],
  declarations: [
    SubgroupComponent,
    EditSubgroupComponent,
    BookingFormComponent,
    RangeDatePickerComponent,
    ListBookingsComponent,
    CreateBookingComponent,
    EditBookingComponent,
    HideForbbidenElementsDirective,
    SessionFormByBookingComponent,
    CreateSessionByBookingComponent,
    SessionsInDateComponent,
  ],
  providers: [SubgroupResolver],
})
export class SubgroupModule {}
