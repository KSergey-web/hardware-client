import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { StyleDialogDirective } from './style-dialog.directive';

@NgModule({
  declarations: [AlertComponent, ConfirmComponent, StyleDialogDirective],
  imports: [CommonModule],
  exports: [AlertComponent, ConfirmComponent, StyleDialogDirective],
})
export class CommonDialogBoxesModule {}
