import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { stateButtonEnum } from 'src/app/enums/state-button.enum';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit{

  buttons: [number, stateButtonEnum][] = [];

  @Output() onButtonAction = new EventEmitter<number>();
  @Input() numberOfButtons: number = 0;
  @ContentChild("name") name!: TemplateRef<any>;
  constructor(
    ) {
      
    }

    ngOnInit(): void {
      for(let i = 0; i < this.numberOfButtons; ++i){
        this.buttons.push([i, stateButtonEnum.mouseup])
      }
    }


  sendButtonAction(ind: number): void {
    this.onButtonAction.emit(ind);
  }

  onMouseOutFromButton($event: MouseEvent, index: number){
    if (this.buttons[index][1] === stateButtonEnum.mousedown) {
      $event.target?.dispatchEvent(new Event("mouseup"));
    }
  }

  onButtonDown(index: number){
   this.buttons[index][1] = stateButtonEnum.mousedown;
   this.sendButtonAction(index);
  }

  onButtonUp(index: number){
    this.buttons[index][1] = stateButtonEnum.mouseup;
    this.sendButtonAction(index);
  }

}
