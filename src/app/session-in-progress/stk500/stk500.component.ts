import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { values } from 'lodash';
import { STK500Service } from './stk500.service';

@Component({
  selector: 'app-stk500',
  templateUrl: './stk500.component.html',
  styleUrls: ['./stk500.component.scss']
})
export class STK500Component implements OnInit {

  buttons = [0, 1, 2, 3, 4, 5, 6, 7];

  rangeControl = new FormControl('0');

  selectedFile: File | null = null;

  preValueResistor: number = 0;

  logs: string[] = [];

  canReset = false;

  constructor(
    private stk500Service: STK500Service
  ) { }

  ngOnInit(): void {
    this.rangeControl.valueChanges.subscribe((value: number) => {
      if (this.preValueResistor == value) return;
      this.preValueResistor = value;
      let command: string = '10000';
      const strValue = value.toString();
      const lenght = strValue.length;
      console.warn(5-lenght);
      command = command.slice(0, 5 - lenght) + strValue
      this.stk500Service.sendButtonCommand(undefined, command).subscribe(this.getDefaultObserver());
    })
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile.name);
  }

  onButtonClick(ind: number): void {
    let command: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0];
    command[ind] = 1;
    this.stk500Service.sendButtonCommand(command.join('')).subscribe(this.getDefaultObserver());
  }

  private getDefaultObserver(){
    return {
      next: this.getDefaultNext(),
      error: this.getDefaultError() 
    }
  }

  private getDefaultNext(){
    return (res: {stdout: string}) => {
      this.logs.push(res.stdout)
    }
  }

  private getDefaultError(){
    return (err: Error) => { 
      alert(err.message); 
      console.error(err); 
      this.logs.push(JSON.stringify(err));
    }
  }

  onReset(): void {
    this.stk500Service.reset().subscribe(this.getDefaultObserver());;
  }

  onUploadFile(): void {
    console.log(`upload ${this.selectedFile?.name}`);
    if (!this.selectedFile) return;
    this.stk500Service.uploadHex(this.selectedFile).subscribe({ 
      next: (res) => {
        this.logs.push(res.stdout);
        this.canReset = true;
      },
      error: this.getDefaultError() 
    });;
  }
}
