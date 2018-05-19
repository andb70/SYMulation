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

  constructor(private clockService: ClockService) {
  }

  ngOnInit(): void {
    /**
     * Inizializza il dato in base alla configurazione ricevuta
     */
    this.dataBit = (this.config.initValue - this.config.scaleMin)
      / (this.config.scaleMax - this.config.scaleMin) * this.config.inRange;

    /**
     * Se il sensore è privo di proprietario l'aggiornamento sarà
     * cadenzato da un clock, altrimenti la responsabilità di chiamare
     * updatate(<delta>) sarà demandata all'oggetto che lo possiede
     */
    // console.log(this.config.name + ' isLeaf: ' + this.config.getIsLeaf());
    if (this.config.getIsLeaf()) {
      this.startClock();
    }
  }

  startClock(): void {
    /**
     * Ad ogni tick del clock valuta se aggiornare il dato e calcola
     * il delta in modo casuale
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

    if (this.dataBit + delta < this.config.scaleMin) {
      delta = this.config.scaleMin - this.dataBit;
    } else if (this.dataBit + delta > this.config.scaleMax) {
      delta = this.config.scaleMin - this.dataBit;
    }
    if (!delta) {
      return;
    }
    // console.log(this.config.name + ' update ' + delta);
    this.dataBit = this.dataBit + delta;
    this.newData.emit({
                            fldName: this.config.fldName,
                            value: this.getValue(),
                            tag: this.config.tag,
                            timestamp: Measure.getTimeStamp()
                    });
  }

  getValue() {
    return this.dataBit / this.config.inRange * (this.config.scaleMax - this.config.scaleMin);
  }

}
