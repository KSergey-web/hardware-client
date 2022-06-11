import { Observable } from "rxjs";

export interface IButtonInteraction {
    sendButtonAction: (
        buttonInd: number,
    ) => Observable<any>
}