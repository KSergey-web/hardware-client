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

  constructor(
    private stk500Service: STK500Service
  ) { }

  ngOnInit(): void {
    this.rangeControl.valueChanges.subscribe(values => {
      console.log("1"+values);
      this.stk500Service.uploadButtonCommand(undefined,"1"+values);
    })
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile.name);
  }

  onButtonClick(ind: number): void{
    let command: Array<number>= [0,0,0,0,0,0,0,0]; 
    command[ind] = 1;
    console.log(command.join(""));
    this.stk500Service.uploadButtonCommand(command.join(''));
  }

  onReset(): void{
    console.log("reset");
  }

  onUploadFile(): void{
    console.log(`upload ${this.selectedFile?.name}`)
  }
}
