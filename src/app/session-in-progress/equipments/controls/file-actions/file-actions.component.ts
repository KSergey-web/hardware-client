import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-file-actions',
  templateUrl: './file-actions.component.html',
  styleUrls: ['./file-actions.component.scss']
})
export class FileActionsComponent implements OnInit, OnDestroy{

  constructor() { }

  selectedFile: File | null = null;

  canReset = false;
  @Input() canReset$?: Subject<boolean>;
  @Output() onButtonClean = new EventEmitter();
  @Output() onButtonReset = new EventEmitter();
  @Output() onButtonUpload = new EventEmitter<File>();

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    if (this.canReset$){
      this.canReset$?.pipe(takeUntil(this.onDestroy$)).subscribe(res => this.canReset = res);
    } 
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile.name);
  }


  onReset(): void {
    this.onButtonReset.emit();
  }

  

  onUploadFile(): void {
    console.log(`upload ${this.selectedFile?.name}`);
    if (!this.selectedFile) return;
    this.onButtonUpload.emit(this.selectedFile);
  }

  onClean(): void {
    this.onButtonClean.emit();
  }
}
