
import {timer as observableTimer, Subscription} from 'rxjs';
import {EventEmitter, Output} from '@angular/core';
import {Observable} from 'rxjs/RX';

export class Clock7 {

  private _clockSubscription: Subscription;
  private _busy = false;

  @Output()
  tick: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  start(initialDelay?: number, period?: number) {
    console.log('Clock7.start');
    if (!initialDelay) {
      initialDelay = 1000;
    }
    if (!period) {
      period = 1000;
    }
    this.stop7();
    this._busy = true;
    console.log('initialDelay ' + initialDelay);
    console.log('period ' + period);
    let clock: Observable<number>;
    clock = observableTimer(initialDelay, period); // Call after 10 second.. Please set your time
    this._clockSubscription = clock.subscribe(t => {
      this.tick.emit(t);
    });
    return this;
  }

  stop7() {
    if (this.isBusy()) {
      this._clockSubscription.unsubscribe();
    }
  }
  isFree() {
    return (!this._clockSubscription || this._clockSubscription.closed);
    /*return (isNullOrUndefined(this._clockSubscription));*/
  }
  isBusy() {
    return (this._clockSubscription && !this._clockSubscription.closed);
  }
}

