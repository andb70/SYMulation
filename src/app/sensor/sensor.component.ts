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
  slope = 0.5;
  @Input()
  config: DataPointType;
  @Output()
  newData = new EventEmitter();

  constructor(private clockService: ClockService) { }

  ngOnInit(): void {
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
        this.update();
      }
    });
  }

  ngOnDestroy(): void {
    this._clockSubscription.unsubscribe();
  }

  /**
   * aggiorna il dato e comunica al contenitore la modifica
   * */
  update() {
    this.dataBit = this.dataBit + (Math.random() - this.slope) * this.config.updtRate;
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
