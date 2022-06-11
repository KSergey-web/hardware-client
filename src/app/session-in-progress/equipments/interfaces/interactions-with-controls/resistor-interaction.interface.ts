import { Observable } from "rxjs";

export interface IResistorInteraction {
  sendResistorAction: (
    resistor: number,
  ) => Observable<any>;

  getStatusResistor: () => Observable<{ resistor: number }>;
}