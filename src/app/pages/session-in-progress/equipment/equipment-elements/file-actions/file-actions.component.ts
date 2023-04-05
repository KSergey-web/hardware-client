import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IFirmwareInteraction } from '../../interfaces/interactions-with-controls/firmware-interaction.interface';
import { I_FIRMWARE_INTERACTION_SERVICE } from '../equipment-elements-tokens';
import { EquipmentHandlerService } from '../equipment-handler.service';

@Component({
  selector: 'app-file-actions',
  templateUrl: './file-actions.component.html',
  styleUrls: ['./file-actions.component.scss'],
})
export class FileActionsComponent implements OnDestroy {
  constructor(
    @Inject(I_FIRMWARE_INTERACTION_SERVICE)
    private firmwareService: IFirmwareInteraction,
    private equipmentHandlerService: EquipmentHandlerService
  ) {}

  fileControl = new FormControl<File | null>(null);

  lastLoadedFile: { name: string } | null = null;

  get selectedFile(): File | null {
    if (this.fileControl.value) debugger;
    return this.fileControl.value;
  }

  canReset = false;

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onUploadFile(): void {
    if (!this.selectedFile) return;
    this.firmwareService
      .uploadFile(this.selectedFile)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: () => {
          this.canReset = true;
          this.lastLoadedFile = { name: this.selectedFile!.name };
          this.fileControl.reset();
        },
        error: this.equipmentHandlerService.getDefaultError(),
      });
  }

  onReset(): void {
    this.firmwareService
      .reset()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(this.equipmentHandlerService.getDefaultObserver());
  }

  onClean(): void {
    this.firmwareService
      .clean()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: () => {
          this.canReset = false;
          this.lastLoadedFile = null;
        },
        error: this.equipmentHandlerService.getDefaultError(),
      });
  }
}
