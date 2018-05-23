import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/RX';

@Injectable()
export class ClockService {

  private clock: Observable<Date>;

  constructor() {
    this.clock = Observable.interval(500).map(tick => new Date()).share();
  }

  getClock(): Observable<Date> {
    return this.clock;
  }

}
