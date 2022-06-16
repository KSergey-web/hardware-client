import {
  Component,
  ContentChild,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { stateButtonEnum } from 'src/app/enums/state-button.enum';
import { EquipmentHandlerService } from '../equipment-handler.service';
import { I_BUTTON_INTERACTION_SERVICE } from '../../equipment-service-tokens';
import { IButtonInteraction } from '../../interfaces/interactions-with-controls/button-interaction.interface';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss'],
})
export class ButtonsComponent implements OnInit, OnDestroy {
  buttons: [number, stateButtonEnum][] = [];

  @Input() numberOfButtons: number = 0;

  @ContentChild('name') name!: TemplateRef<any>;
  constructor(
    @Inject(I_BUTTON_INTERACTION_SERVICE)
    private buttonService: IButtonInteraction,
    private equipmentHandlerService: EquipmentHandlerService
  ) {}

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    for (let i = 0; i < this.numberOfButtons; ++i) {
      this.buttons.push([i, stateButtonEnum.mouseup]);
    }
  }

  onMouseOutFromButton($event: MouseEvent, index: number) {
    if (this.buttons[index][1] === stateButtonEnum.mousedown) {
      $event.target?.dispatchEvent(new Event('mouseup'));
    }
  }

  onButtonDown(index: number) {
    this.buttons[index][1] = stateButtonEnum.mousedown;
    this.sendButtonAction(index);
  }

  onButtonUp(index: number) {
    this.buttons[index][1] = stateButtonEnum.mouseup;
    this.sendButtonAction(index);
  }

  sendButtonAction(buttonInd: number): void {
    this.buttonService
      .sendButtonAction(buttonInd)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(this.equipmentHandlerService.getDefaultObserver());
  }
}
