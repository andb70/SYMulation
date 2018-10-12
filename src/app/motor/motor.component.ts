import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {MotorClass, switchState} from '../models/MotorClass';
import {Subscription} from 'rxjs';
import {ClockService} from '../clock.service';
import {LogicIOService} from '../logic-io.service';

@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.css']
})
export class MotorComponent implements OnInit, OnDestroy {
  @Input()
  config: MotorClass;
  status: string;

  constructor(private IOs: LogicIOService) {
    this.IOs.updateIO.subscribe( t => {
      // console.log('evento update');
      this.config.updateParam();
    });
    this.status = 'OFF';
  }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

  motorSwitch() {
    this.status == 'OFF' ? this.status = 'ON' : this.status = 'OFF';
    console.log('motor switch ' + this.config.name);
    this.config.motorSwitch();
  }
  stressValues() {
    return [0, 1, 2, 4];
  }
  get stress(): number {
    return this.config.stress;
  }
  set stress(value: number) {
    this.config.stress = value;
    console.log('stress ' + this.config.name + ': ' + this.stress);
  }

  get actualCurrent(): number {
    return this.config.getsCurrent().scaledValue;
  }

  get actualHours(): number {
    return this.config.getHours();
  }

  get actualSpeed(): number {
    return this.config.getsRPM().scaledValue;
  }

  get targetSpeed(): number {
    return this.config.targetSpeed;
  }
  set targetSpeed(RPM: number) {
    this.config.targetSpeed = RPM;
  }
}
