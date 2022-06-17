import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITimer } from './timer.interface';

export class Timer implements ITimer {
  constructor() {
    this.time$ = new BehaviorSubject(this.time);
  }

  isFinished: boolean = true;

  private _remainingTime: number = 0;
  private _timerId?: any;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  get time(): ITimer {
    return {
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
    };
  }

  time$: BehaviorSubject<ITimer>;

  private emitTime() {
    this.time$.next(this.time);
  }

  startTimer() {
    this.stopTimer();
    this.isFinished = false;
    this._timerId = setInterval(() => {
      this.updateTimesProperties();
      this.emitTime();
      if (this._remainingTime <= 0) {
        this.stopTimer();
        this.isFinished = true;
        this.time$.complete();
      }
      --this._remainingTime;
    }, 1000);
  }

  stopTimer() {
    clearInterval(this._timerId);
  }

  private updateTimesProperties() {
    this.seconds = this._remainingTime % 60;
    this.minutes = Math.floor((this._remainingTime / 60) % 60);
    this.hours = Math.floor((this._remainingTime / 60 / 60) % 60);
  }

  static createWithEndDate(date: Date): Timer {
    const timer = new Timer();
    timer.changeEndDate(date);
    return timer;
  }

  changeEndDate(date: Date) {
    const now = new Date();
    if (date < now) {
      throw new Error('Date less than now');
    }
    this._remainingTime = Math.floor((+date - +now) / 1000);
    this.updateTimesProperties();
  }
}
