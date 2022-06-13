import { Subject } from 'rxjs';

export interface ISwitchesManagement {
  numberOfSwitches: number;
  switchesState$: Subject<string>;
  switchesToDefault$: Subject<void>;
}
