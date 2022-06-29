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
import { EditSubgroupComponent } from './edit-subgroup/edit-subgroup.component';
import { ListBookingsComponent } from './list-bookings/list-bookings.component';
import { SubgroupComponent } from './subgroup.component';
import { CreateBookingComponent } from './create-booking/create-booking.component';
import { EditBookingComponent } from './edit-booking/edit-booking.component';
import { SubgroupResolver } from './subgroup.resolver';
import { AuthenticatedUserViewDirective } from './authenticated-user-view.directive';
import { SessionFormByBookingComponent } from './session-form-by-booking/session-form-by-booking.component';
import { CreateSessionByBookingComponent } from './create-session-by-booking/create-session-by-booking.component';
import { SessionsInDateComponent } from './session-form-by-booking/sessions-in-date/sessions-in-date.component';

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
    AuthenticatedUserViewDirective,
    SessionFormByBookingComponent,
    CreateSessionByBookingComponent,
    SessionsInDateComponent,
  ],
  providers: [SubgroupResolver],
})
export class SubgroupModule {}
