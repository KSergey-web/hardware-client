import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EquipmentHandlerService } from '../equipment-handler.service';
import { I_FIRMWARE_INTERACTION_SERVICE } from '../equipment-elements-tokens';
import { IFirmwareInteraction } from '../../interfaces/interactions-with-controls/firmware-interaction.interface';

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

  selectedFile: File | null = null;

  canReset = false;

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile.name);
  }

  onUploadFile(): void {
    if (!this.selectedFile) return;
    this.firmwareService
      .uploadFile(this.selectedFile)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: () => {
          this.canReset = true;
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
        },
        error: this.equipmentHandlerService.getDefaultError(),
      });
  }
}
