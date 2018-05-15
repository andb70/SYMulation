import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ClockService} from '../clock.service';
import {Subscription} from 'rxjs/Subscription';
import {DataPointType} from '../models/DataPointType';

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
    this.dataBit = (this.config.initValue -  this.config.scaleMin)
              / (this.config.scaleMax -  this.config.scaleMin) * this.config.inRange;
    this._clockSubscription = this.clockService.getClock().subscribe(() => {
      if (Math.random() > this.config.updtTHS) {
        this.update();
      }
    });
  }

  ngOnDestroy(): void {
    this._clockSubscription.unsubscribe();
  }

  update() {
      this.dataBit = this.dataBit + (Math.random() - this.slope) * this.config.updtRate;
      this.newData.emit( {name: this.config.name, value: this.getValue(), tag: this.config.tag});
  }

  getValue() {
    return this.dataBit / this.config.inRange * (this.config.scaleMax - this.config.scaleMin);
  }

}
