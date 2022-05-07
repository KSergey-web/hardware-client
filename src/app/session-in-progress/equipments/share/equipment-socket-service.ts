import { Inject, Injectable } from "@angular/core";
import { API_INTERMEDIARY_URL } from "src/app/app.module";
import { io, Socket } from "socket.io-client";
import { AuthService } from "src/app/services/auth.service";
import { SessionInProgressService } from "../../session-in-progress.service";
import { Subject } from "rxjs";

@Injectable()
  export class EquipmentSocketService {
  
    constructor(
      @Inject(API_INTERMEDIARY_URL) private apiUrl: string,
      private authService: AuthService,
      private sessionInProgressService: SessionInProgressService
    ) {
        this.connectToServer();
        this.subscribeOnBadConnection();
        this.subscribeOnOutput();
      }

    private subscribeOnBadConnection(){
        this.socket.on("connect_error", (err) => {
            if (err.message == 'session unavailable')
                console.error(err);
                this.socket.disconnect();
                 // prints the message associated with the error
          });
    }

    readonly output$: Subject<any> = new Subject();

    subscribeOnOutput(){
        this.socket.on('output', (output)=> {
            this.output$.next(output)
        })
    }

    private connectToServer(){
        this.socket = io(this.apiUrl + '/equipment', {
            auth: {
                token: this.authService.authBearerToken,
                sessionId: this.sessionInProgressService.sessionId
            }
        });
    }

    private socket!: Socket;
}