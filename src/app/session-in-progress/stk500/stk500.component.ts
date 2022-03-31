import { Component,OnDestroy, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { values } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { STK500Service } from './stk500.service';

@Component({
  selector: 'app-stk500',
  templateUrl: './stk500.component.html',
  styleUrls: ['./stk500.component.scss'],
})
export class STK500Component implements OnInit, OnDestroy {
  buttons = [0, 1, 2, 3, 4, 5, 6, 7];

  rangeControl = new FormControl('0');

  selectedFile: File | null = null;

  preValueResistor: number = 0;

  logs: string[] = [];

  canReset = false;

  constructor(
    private stk500Service: STK500Service,
    ) {}

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  private subscrubeOnRangeChanges(): void {
    this.rangeControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value: number) => {
        if (this.preValueResistor == value) return;
        this.preValueResistor = value;
        let command: string = this.stk500Service.valueResistorToCommand(value);
        this.stk500Service
          .sendButtonsAndResistorCommand(undefined, command)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(this.getDefaultObserver());
      });
  }
  
  ngOnInit(): void {
    this.subscrubeOnRangeChanges();
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile.name);
  }

  onButtonClick(ind: number): void {
    let command: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0];
    command[ind] = 1;
    this.stk500Service
      .sendButtonsAndResistorCommand(command.join(''))
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(this.getDefaultObserver());
  }

  private getDefaultObserver() {
    return {
      next: this.getDefaultNext(),
      error: this.getDefaultError(),
    };
  }

  private getDefaultNext() {
    return (res: { stdout: string }) => {
      this.logs.push(res.stdout);
    };
  }

  private getDefaultError() {
    return (err: Error) => {
      alert(err.message);
      console.error(err);
      this.logs.push(JSON.stringify(err));
    };
  }

  onReset(): void {
    this.stk500Service
      .reset()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(this.getDefaultObserver());
  }

  onUploadFile(): void {
    console.log(`upload ${this.selectedFile?.name}`);
    if (!this.selectedFile) return;
    this.stk500Service
      .uploadHex(this.selectedFile)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (res) => {
          this.logs.push(res.stdout);
          this.canReset = true;
        },
        error: this.getDefaultError(),
      });
  }

  onClean(): void {
    this.stk500Service
      .clean()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (res) => {
          this.canReset = false;
          const next = this.getDefaultNext();
          next(res);
        },
        error: this.getDefaultError(),
      });
  }
}
