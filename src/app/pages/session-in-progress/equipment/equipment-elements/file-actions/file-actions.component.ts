import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
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

  isLoading$ = new BehaviorSubject(false);

  fileControl = new FormControl<File | null>(null);

  lastLoadedFile: { name: string } | null = null;

  get selectedFile(): File | null {
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
    this.isLoading$.next(true);
    this.firmwareService
      .uploadFile(this.selectedFile)
      .pipe(takeUntil(this.onDestroy$))
      .pipe(finalize(() => this.isLoading$.next(false)))
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
    this.isLoading$.next(true);
    this.firmwareService
      .reset()
      .pipe(takeUntil(this.onDestroy$))
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe(this.equipmentHandlerService.getDefaultObserver());
  }

  onClean(): void {
    this.isLoading$.next(true);
    this.firmwareService
      .clean()
      .pipe(takeUntil(this.onDestroy$))

      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe({
        next: () => {
          this.canReset = false;
          this.lastLoadedFile = null;
        },
        error: this.equipmentHandlerService.getDefaultError(),
      });
  }
}
