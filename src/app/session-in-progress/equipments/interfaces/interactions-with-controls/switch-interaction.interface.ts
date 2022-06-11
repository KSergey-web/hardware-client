import { Observable } from "rxjs";

export interface ISwitchInteraction {
  sendSwitchAction: (
    switchInd: number,
  ) => Observable<any>;

  getStatusSwitches: () => Observable<{ switches: string }>;

  turnOffSwitches: () => Observable<any>;
}