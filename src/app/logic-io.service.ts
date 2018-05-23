import {EventEmitter, Injectable, Output} from '@angular/core';
import {Observable} from 'rxjs/RX';
import {Subscription} from 'rxjs/Subscription';
import {CLogicIO, DataPointType, ILogicIO} from './models/DataPointType';
import {isNull} from 'util';

@Injectable()
export class LogicIOService {

  private _clockSubscription: Subscription;
  private IOs: ILogicIO[] = [];

  /**
   * ricevuto da motor.component che aggiorna la classe sottostante
   * chiamando updateParam*/
  @Output()
  updateIO: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
    this.IOs = CLogicIO.create(40);
  }
  public nextValue(i: number, value: number) {
    // console.log('nextValue ' + i + ' v: ' + value);
    let IO: ILogicIO = this.IOs[i];
    IO.nextValue = value;
  }
  private scan(t) {
    /**
     *  foreach fld of flds{
     *    update(fld)
     *    if (fld.changed) {
     *      fld.callback.notify(fld.value)
     *    }
     *  }
     *
     *  Chiama DataPointType e si ferma: corretto
     */
     for (let i = 0; i < this.IOs.length; i++) {
      let IO: ILogicIO = this.IOs[i];
      if (this.isMapped(IO)) {
        if (this.validateIO(IO)) {
          IO.callback.notify(IO.value);
        }
      } /*else {
        this.nextValue(i, Math.round(IO.value * (10.5 + Math.random()) / 10));
      }*/
    }
    console.log(t);
  }

  private validateIO(IO: ILogicIO): boolean {
    if (IO.nextValue > 1023) {
      IO.nextValue = 1023;
    } else if (IO.nextValue < 0) {
      IO.nextValue = 0;
    }
    if (IO.value === IO.nextValue) {
      return false;
    }
    IO.value = IO.nextValue;
    return true;
  }

  private isMapped(IO: ILogicIO) {
    return (!isNull(IO.callback));
  }

  map(inputs: DataPointType[]) {
    for (let i = 0; i < inputs.length; i++) {
      this.IOs[inputs[i].map].callback = inputs[i];
    }
  }

  scanStart(initialDelay?: number, period?: number) {
    if (!initialDelay) {
      initialDelay = 1000;
    }
    if (!period) {
      period = 1000;
    }
    console.log('initialDelay ' + initialDelay);
    console.log('period ' + period);
    let clock: Observable<number>;
    clock = Observable.timer(initialDelay, period); // Call after 10 second.. Please set your time
    this.scanStop();
    this._clockSubscription = clock.subscribe(t => {
      this.updateIO.emit(t);
      this.scan(t);
    });
  }

  scanStop() {
    try {
      this._clockSubscription.unsubscribe();
    } catch (e) {
      console.log('LogicIO: couldn\'t unsubscribe scanner');
    }
    this._clockSubscription = null;
  }
}

