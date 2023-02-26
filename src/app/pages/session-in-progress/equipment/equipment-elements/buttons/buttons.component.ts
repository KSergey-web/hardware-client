import {
  Component,
  ContentChild,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { stateButtonEnum } from 'src/app/pages/session-in-progress/equipment/equipment-elements/buttons/state-button.enum';
import { EquipmentHandlerService } from '../equipment-handler.service';
import { I_BUTTON_INTERACTION_SERVICE } from '../equipment-elements-tokens';
import { IButtonInteraction } from '../../interfaces/interactions-with-controls/button-interaction.interface';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss'],
})
export class ButtonsComponent implements OnInit, OnDestroy {
  buttons: stateButtonEnum[] = [];

  @Input() numberOfButtons: number = 0;

  @ContentChild('name') name!: TemplateRef<any>;
  constructor(
    @Inject(I_BUTTON_INTERACTION_SERVICE)
    private buttonService: IButtonInteraction,
    private equipmentHandlerService: EquipmentHandlerService
  ) {
    this.subOnKeyboard();
  }

  subOnKeyboard() {
    fromEvent(window, 'keydown')
      .pipe(
        map((event) => (event as KeyboardEvent).key),
        filter((key) => !!key.match(/\d/)),
        map((key) => +key),
        filter((key) => key < this.buttons.length),
        filter((key) => !this.isButtonActive(+key))
      )
      .subscribe((key) => {
        this.onButtonDown(+key);
      });
    fromEvent(window, 'keyup')
      .pipe(
        map((event) => (event as KeyboardEvent).key),
        filter((key) => !!key.match(/\d/)),
        map((key) => +key),
        filter((key) => key < this.buttons.length)
      )
      .subscribe((key) => {
        this.onButtonUp(+key);
      });
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    for (let i = 0; i < this.numberOfButtons; ++i) {
      this.buttons.push(stateButtonEnum.mouseup);
    }
  }

  onMouseOutFromButton($event: MouseEvent, index: number) {
    if (this.buttons[index] === stateButtonEnum.mousedown) {
      $event.target?.dispatchEvent(new Event('mouseup'));
    }
  }

  onButtonDown(index: number) {
    this.buttons[index] = stateButtonEnum.mousedown;
    this.sendButtonAction(index);
  }

  onButtonUp(index: number) {
    this.buttons[index] = stateButtonEnum.mouseup;
    this.sendButtonAction(index);
  }

  isButtonActive(index: number): boolean {
    return this.buttons[index] == stateButtonEnum.mousedown;
  }

  sendButtonAction(buttonInd: number): void {
    this.buttonService
      .sendButtonAction(buttonInd)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(this.equipmentHandlerService.getDefaultObserver());
  }
}
