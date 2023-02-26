import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from 'src/app/services/auth.service';
import { API_INTERMEDIARY_URL } from 'src/app/urls-tokens';
import { SessionInProgressService } from '../../session-in-progress.service';

@Injectable()
export class EquipmentSocketService implements OnDestroy {
  private socket!: Socket;

  constructor(
    @Inject(API_INTERMEDIARY_URL) private apiUrl: string,
    private authService: AuthService,
    private sessionInProgressService: SessionInProgressService
  ) {
    this.connectToServer();
    this.subscribeOnBadConnection();
    this.subscribeOnOutput();
  }
  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  private subscribeOnBadConnection() {
    this.socket.on('connect_error', (err) => {
      if (err.message == 'session unavailable') console.error(err);
      this.socket.disconnect();
      // prints the message associated with the error
    });
  }

  readonly output$: Subject<any> = new Subject();

  subscribeOnOutput() {
    this.socket.on('output', (output) => {
      this.output$.next(output);
    });
  }

  private connectToServer() {
    this.socket = io(this.apiUrl + '/equipment', {
      auth: {
        token: this.authService.authBearerToken,
        sessionId: this.sessionInProgressService.sessionId,
      },
    });
  }

  sendCommand(command: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.emit('send-command', { command }, (res: any) => {
        if (res.status && res.status >= 400) {
          console.log(res);
          subscriber.error(res);
        }
        subscriber.next(res);

      });
    }).pipe(take(1));
  }
}
