import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ISession } from 'src/app/interfaces/session.interface';

@Component({
  selector: 'app-started-sessions',
  templateUrl: './started-sessions.component.html',
  styleUrls: ['./started-sessions.component.scss']
})
export class StartedSessionsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() sortedSessions: ISession[] = [];
  
  startedSessions: ISession[] = [];

  timerId!: any;

  constructor(
    private router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
        this.rebaseStartedSessions();
  }

  rebaseStartedSessions(){
    const now = new Date();
    for (let i = 0; i < this.sortedSessions.length; ++i){
      if (this.sortedSessions[i].begin > now) break;
      if (this.sortedSessions[i].end > now){
        this.startedSessions.push(this.sortedSessions[i]);
        this.sortedSessions.splice(i,1);
        --i;
      }
    }
  }

  deleteEndedSessions(){
    const now = new Date();
    for (let i = 0; i < this.startedSessions.length; ++i){
      if (this.startedSessions[i].end < now){
        this.startedSessions.splice(i,1);
        --i;
      }
    }
  }

  ngOnInit(): void {
    this.timerId = setInterval(()=>{
      this.deleteEndedSessions();
      this.rebaseStartedSessions();
    }, 30000);
  }

  ngOnDestroy(): void {
      console.log(1);
      clearInterval(this.timerId);
  }

  startSession(session: ISession){
    this.router.navigate(['session',`${session.id}`])
  }
}
