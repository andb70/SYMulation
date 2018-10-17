import {EventEmitter, Injectable, Output} from '@angular/core';
import {CLogicIO, DataPointType, ILogicIO} from './models/DataPointType';
import {isNull} from 'util';
import {Clock7} from './models/Clock7';
const maxCyclesOff = 2;
@Injectable()
export class LogicIOService {

  private readonly IOs: ILogicIO[] = [];
  private clock: Clock7;

  /**
   * ricevuto da motor.component che aggiorna la classe sottostante
   * chiamando updateParam*/
  @Output()
  updateIO: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
    this.clock = new Clock7();
    this.IOs = CLogicIO.create(40);
  }
  public nextValue(i: number, value: number) {
    // if (i === 0) {console.log('nextValue ' + i + ' v: ' + value); }
    let IO: ILogicIO = this.IOs[i];
    IO.nextValue = value;
  }
  private scan(t) {
    /**
     *  foreach fld of flds{
     *    update(fld)
     *    if (fld.hasNewValue) {
     *      fld.callback.notify(fld.value)
     *    }
     *  }
     *
     *  Chiama DataPointType e si ferma: corretto
     */
     for (let i = 0; i < this.IOs.length; i++) {
      let IO: ILogicIO = this.IOs[i];
      if (this.isMapped(IO)) {
        if (this.hasNewValue(IO)) {
          IO.callback.notify(IO.value);
        } else {
          IO.cycles++;
          // console.log('ILogicIO', i, IO.cycles, maxCyclesOff );

          if (IO.cycles > maxCyclesOff) {
            IO.cycles = 0;
            IO.callback.notify(IO.value);
          }
          // aggiornare dopo timeout
        }
      }
    }
    // console.log(t);
  }

  private hasNewValue(IO: ILogicIO): boolean {

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

  /**
   * Scansione dei campi valore
   *
   * quando il clock è attivo notifica a tutti i DataPoint mappati
   * di aggiornare il proprio valore
   * quindi richiama il metodo scan che notifica i cambiamenti
   * avvenuti
   *
   * @param {number} initialDelay
   * @param {number} period
   */
  scanStart(initialDelay?: number, period?: number) {
    console.log('logic-io.service.scanStart');
    this.clock.start(initialDelay, period).tick.subscribe( (t) => {
      this.updateIO.emit(t);
      this.scan(t);
    });
  }

  scanStop() {
    this.clock.stop7();
  }
}

