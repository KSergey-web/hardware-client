import { Subject } from "rxjs";

export interface IResistorManagement {
    minValue: number;
    maxValue: number;
    resistorState$: Subject<number>;
}