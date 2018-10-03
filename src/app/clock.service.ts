
import {interval as observableInterval} from 'rxjs';

import {share, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/RX';

@Injectable()
export class ClockService {

  private clock: Observable<Date>;

  constructor() {
    this.clock = observableInterval(500).pipe(map(tick => new Date()), share() );
  }

  getClock(): Observable<Date> {
    return this.clock;
  }

}
