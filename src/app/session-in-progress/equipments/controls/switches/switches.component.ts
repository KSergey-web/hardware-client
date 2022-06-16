import {
  Component,
  ContentChild,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EquipmentSocketService } from '../../communication-services/equipment-socket-service';
import { EquipmentHandlerService } from '../equipment-handler.service';
import { I_SWITCH_INTERACTION_SERVICE } from '../../equipment-service-tokens';
import { ISwitchInteraction } from '../../interfaces/interactions-with-controls/switch-interaction.interface';
import { ISwitchesManagement } from './switches-management.interface';

@Component({
  selector: 'app-switches',
  templateUrl: './switches.component.html',
  styleUrls: ['./switches.component.scss'],
})
export class SwitchesComponent implements OnInit, OnDestroy {
  @Input() switchesManagment!: ISwitchesManagement;
  @ContentChild('name') name!: TemplateRef<any>;

  get numberOfSwitches(): number {
    return this.switchesManagment.numberOfSwitches;
  }

  form = this.fb.group({
    switches: this.fb.array([]),
  });
  get switches(): FormArray {
    return this.form.controls['switches'] as FormArray;
  }
  constructor(
    @Inject(I_SWITCH_INTERACTION_SERVICE)
    private switchService: ISwitchInteraction,
    private equipmentHandlerService: EquipmentHandlerService,
    private equipmentSocketService: EquipmentSocketService,
    private fb: FormBuilder
  ) {}

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  private setStateSwiitches(switches: string) {
    for (let i = 0; i < switches.length; ++i) {
      const control = this.switches.at(this.numberOfSwitches - 1 - i);
      control.setValue(switches[i] == '1');
    }
  }

  createSwitches() {
    for (let i = 0; i < this.numberOfSwitches; ++i) {
      this.switches.push(this.fb.control(false));
    }
  }

  getStartState() {
    this.switchService
      .getStatusSwitches()
      .subscribe((res) => this.setStateSwiitches(res.switches));
  }

  ngOnInit(): void {
    this.createSwitches();
    this.getStartState();
    this.subOnOutput();
  }

  sendCommand(event: Event, ind: number): void {
    const control = this.switches.controls[ind];
    control.setValue(!control.value);
    const switchIndex = this.numberOfSwitches - 1 - ind;
    this.switchService
      .sendSwitchAction(switchIndex)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(this.equipmentHandlerService.getDefaultObserver());
  }

  subOnOutput() {
    this.equipmentSocketService.output$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(({ switches }) => {
        if (switches) {
          this.setStateSwiitches(switches);
        }
      });
  }
}
