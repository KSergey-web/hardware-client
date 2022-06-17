import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EquipmentSocketService } from '../../communication-services/equipment-socket-service';
import { EquipmentHandlerService } from '../equipment-handler.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit, OnDestroy {
  logs: string[] = [];

  constructor(
    private equipmentSocketService: EquipmentSocketService,
    private equipmentHandlerService: EquipmentHandlerService
  ) {}

  @ViewChild('console')
  private console: ElementRef | undefined;

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    this.subOnOutput();
    this.equipmentHandlerService.onLog$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((log: string) => {
        this.logToConsole(log);
      });
  }

  private logToConsole(log: string) {
    this.logs.push(log);
    this.console!.nativeElement.scrollTop =
      this.console!.nativeElement.scrollHeight;
  }

  subOnOutput() {
    this.equipmentSocketService.output$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(({ stdout }) => {
        if (stdout) {
          this.logToConsole(stdout);
        }
      });
  }
}
