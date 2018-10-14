import {Component, Input, AfterViewInit} from '@angular/core';
import {LogicIOService} from '../logic-io.service';
import {DeviceClass} from '../models/DeviceClass';

@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.css']
})
export class MotorComponent implements AfterViewInit {
  @Input()
  device: DeviceClass;

  constructor(private IOs: LogicIOService) {
    this.IOs.updateIO.subscribe( () => {
      this.device.updateCurrentRpmHoursParam();
    });
  }
  ngAfterViewInit() {
    console.log('motor.component 18 stress:', this.device.stress);
    // this.device.stress = 0;
  }
  stressValues() {
    return [0, 1, 2, 4];
  }
  get stress(): number {
    console.log('motor.component 27 stress:', this.device.stress);
    return this.device.stress;
  }
  set stress(value: number) {
    this.device.stress = value;
  }
}
