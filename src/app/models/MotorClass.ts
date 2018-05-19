import {EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ClockService} from '../clock.service';
import {Subscription} from 'rxjs/Subscription';
import {DataPointType} from './DataPointType';

export class MotorClass implements OnInit, OnDestroy {
  private _clockSubscription: Subscription;
  private counter = 0;

  @Output()
  newData = new EventEmitter();

  state = false;
  targetRPM = 0;
  status = 0;
  private clockService: ClockService;
  constructor(public name: string,
              public refreshInterval: number,
              private config: MotorConfigType,
              private param: MotorParamType,
              private sCurrent: DataPointType,
              private sRPM: DataPointType,
              private sHours: DataPointType ) {
    this.clockService = new ClockService();
    this.sCurrent.owner = this;
    this.sRPM.owner = this;
    this.sHours.owner = this;
  }

  ngOnInit(): void {
    this._clockSubscription = this.clockService.getClock().subscribe(() => {

      this.updateParam();
      if (this.counter > this.refreshInterval) {
        this.newData.emit();
        this.counter = 0;
      }
      this.counter++;
    });
  }
  ngOnDestroy(): void {
    this._clockSubscription.unsubscribe();
  }

  getsCurrent(): DataPointType {
    return this.sCurrent;
  }
  getsRPM(): DataPointType {
    return this.sRPM;
  }
  getsHours(): DataPointType {
    return this.sHours;
  }


  updateParam() {
    switch (this.status) {
      case 0: // idle / spento
        if (this.isON()) {
          this.status = 1; }
        break;
      case 1: // accende
        if (this.isOFF()) {
          this.status = 4; }
        break;
      case 2: // accelera
        this.updateRPM(this.targetRPM);
        if (this.isOFF()) {
          this.status = 4; }
        break;
      case 3: // velocità costante
        if (this.isOFF()) {
          this.status = 4; }
        break;
      case 4: // spegne
        if (this.isON()) {
          this.status = 1; }
        break;
      case 5: // decelera
        this.updateRPM(0);
        if (this.isON()) {
          this.status = 1; }
        break;
      default:

    }
  }
  updateRPM(targetRPM: number) {
    if (this.speedTargeted(targetRPM)) {
      return true;
    }
    if (this.param.RPM > targetRPM) {
      this.accelera(-1);
    } else {
      this.accelera(1);
    }
  }
  accelera(verso: number) {
    this.param.RPM += verso * this.config.acceleration;
  }

  speedTargeted(targetSpeed: number) {
    return (Math.abs(this.param.RPM - targetSpeed) / this.config.maxRPM < 0.01);
  }
  switch(state: switchState) {
    this.param.state = state;
  }
  setSpeed(RPM: number) {
    this.targetRPM = RPM;
  }
  public isON() {
    return (this.param.state === switchState.ON);
  }
  public isOFF() {
    return (this.param.state === switchState.OFF);
  }
}
export enum switchState {
  OFF = 0,
  ON
}
export class MotorConfigType {
  constructor (public maxI: number,
               public maxRPM: number,
               public acceleration: number) {}
}

export class MotorParamType {
  constructor (public state: switchState,
               public I: number,
               public RPM: number,
               public H: number) {}
}
