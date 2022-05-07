import { Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { ISwitchesManagement } from './switches-management.interface';



@Component({
  selector: 'app-switches',
  templateUrl: './switches.component.html',
  styleUrls: ['./switches.component.scss']
})
export class SwitchesComponent implements OnInit, OnDestroy {

  @Output() onSwitchAction = new EventEmitter<number>();
  @Input() switchesManagment!: ISwitchesManagement;
  @ContentChild("name") name!: TemplateRef<any>;

  get numberOfSwitches(): number{
    return this.switchesManagment.numberOfSwitches;
  }

  private get switchesState$(): Subject<string>{
    return this.switchesManagment.switchesState$;
  }

  private get switchesToDefault$(): Subject<void>{
    return this.switchesManagment.switchesToDefault$;
  }

  form = this.fb.group({
    switches: this.fb.array([])
  })
  get switches(): FormArray {
    return this.form.controls["switches"] as FormArray;
  }

  constructor(private fb: FormBuilder) { }

  ngOnDestroy(): void {
  }

  private subOnSwitchToDefault$() {
    this.switchesToDefault$.subscribe(() => this.switches.controls
      .forEach((control) => {
        control.setValue(false);
      }))
  }

  private subOnSwitchesState$() {
    this.switchesState$.subscribe((switches: string) => {
      for (let i = 0; i < switches.length; ++i){
        const control = this.switches.at(this.numberOfSwitches-1-i);
        control.setValue(switches[i] == '1');
      } 
    }
    )
  }


  createSwitches() {
    for (let i = 0; i < this.numberOfSwitches; ++i) {
      this.switches.push(this.fb.control(false));
    }
  }

  ngOnInit(): void {
    this.createSwitches();
    this.subOnSwitchToDefault$();
    this.subOnSwitchesState$();
  }


  sendCommand(event: Event, ind: number): void {
    const control = this.switches.controls[ind];
    control.setValue(!control.value);
    this.onSwitchAction.emit(this.numberOfSwitches-1-ind);
  }
}
