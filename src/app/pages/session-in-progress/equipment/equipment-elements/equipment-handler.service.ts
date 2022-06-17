import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EquipmentHandlerService {
  constructor() {}

  readonly onLog$: Subject<string> = new Subject<string>();

  private logToConsole(log: string) {
    this.onLog$.next(log);
  }

  getDefaultObserver() {
    return {
      error: this.getDefaultError(),
    };
  }

  getDefaultError() {
    return (err: Error) => {
      alert(err.message);
      console.error(err);
      this.logToConsole(JSON.stringify(err));
    };
  }
}
