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

  @Input()
  config: DataPointType;
  @Output()
  newData = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

  getValue() {
    return this.config.scaledValue;
  }


}
