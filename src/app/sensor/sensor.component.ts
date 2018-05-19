import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ClockService} from '../clock.service';
import {Subscription} from 'rxjs/Subscription';
import {DataPointType} from '../models/DataPointType';
import {Measure} from '../models/Measure';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements OnInit, OnDestroy {

  private _clockSubscription: Subscription;

  dataBit: number;

  @Input()
  config: DataPointType;
  @Output()
  newData = new EventEmitter();

  constructor(private clockService: ClockService) { }

  ngOnInit(): void {
    this.startClock();
   /* if (this.config.getIsLeaf()) {
      this.startClock();
    }*/
  }

  startClock(): void {
    /**
     * Inizializza il dato in base alla configurazione ricevuta
     * */
    this.dataBit = (this.config.initValue -  this.config.scaleMin)
              / (this.config.scaleMax -  this.config.scaleMin) * this.config.inRange;
    /**
     * Ad ogni tick del clock valuta se aggiornare il dato
     * */
    this._clockSubscription = this.clockService.getClock().subscribe(() => {
      if (Math.random() > this.config.updtTHS) {
        this.update(this.config.getDelta());
      }
    });
  }

  ngOnDestroy(): void {
    this.stopClock();
  }

  stopClock(): void {
    if (this._clockSubscription) {
      this._clockSubscription.unsubscribe();
      this._clockSubscription = null;
    }
  }

  /**
   * aggiorna il dato e comunica al contenitore la modifica
   * */
  update(delta: number) {
    this.dataBit = this.dataBit + delta;
    this.newData.emit( { fldName: this.config.fldName,
                              value: this.getValue(),
                              tag: this.config.tag,
                              timestamp: Measure.getTimeStamp()
                            });
    /*this.newData.emit( );*/
      /*console.log(this.dataBit);*/
  }

  getValue() {
    return this.dataBit / this.config.inRange * (this.config.scaleMax - this.config.scaleMin);
  }

}
