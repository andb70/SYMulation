import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DataPointType} from '../models/DataPointType';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements OnInit, OnDestroy {

  @Input()
  config: DataPointType;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  getValue() {
    return this.config.scaledValue;
  }


}
