import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {MotorClass, switchState} from '../models/MotorClass';
import {Subscription} from 'rxjs/Subscription';
import {ClockService} from '../clock.service';
import {LogicIOService} from '../logic-io.service';

@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.css']
})
export class MotorComponent implements OnInit, OnDestroy {
  private ticks = 0;
  @Input()
  config: MotorClass;
  private _speed = 0;
  private _stress = 0;
  @Input()
  state = switchState.OFF;

  constructor(private IOs: LogicIOService) {
    this.IOs.updateIO.subscribe( t => {
      // console.log('evento update');
      this.config.updateParam();
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

  motorSwitch() {
    console.log('motor switch ' + this.config.name);
    this.config.motorSwitch();
  }
  stressValues() {
    return [0, 1, 2, 3];
  }
  get stress(): number {
    return this._stress;
  }
  set stress(value: number) {
    this._stress = value;
    console.log('stress ' + this.config.name + ': ' + this.stress);
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
