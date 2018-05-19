import {OnDestroy, OnInit} from '@angular/core';
import {DataPointType} from './DataPointType';

export class MotorClass implements OnInit, OnDestroy {

  private state = false;
  private targetRPM = 0;
  private status = 0;
  public cruising = false; // velocità costante
  constructor(public name: string,
              public refreshInterval: number,
              private config: MotorConfigType,
              private param: MotorParamType,
              private sCurrent: DataPointType,
              private sRPM: DataPointType,
              private sHours: DataPointType) {
    this.sCurrent.owner = this;
    this.sRPM.owner = this;
    this.sHours.owner = this;
  }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

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
    // console.log('update motor ' + this.name + 'sgtatus: ' + this.status);
    switch (this.status) {
      /**
       * stato iniziale idle / spento
       * */
      case 0: // idle / spento: se switchON -> accendi
        if (this.isON) {
          this.status = 1;
        }
        break;

        /**
         * accensione e spegnimento:
         * esegui i controlli del caso e passa allo stato successivo
         */
      case 1: // accende -> in rotazione
        if (this.isOFF) {
          this.status = 4;
          break;
        }
        this.status = 2;
        break;

      case 2: // spegne -> idle
        if (this.isON) {
          this.status = 1;
        }
        break;

        /**
         * sul fronte di discesa di switch -> spegne
         * aggiorna velocità e corrente
         * */
      case 3: // in rotazione
        if (this.isOFF) {
          this.status = 2;
          break;
        }
        this.cruising = this.updateRPM(this.targetRPM);
        break;
    }
    if (this.status) {
      this.sHours.update(this.refreshInterval);
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

  set targetSpeed(RPM: number) {
    this.targetRPM = RPM;
  }
  get targetSpeed(): number {
    return this.targetRPM;
  }

  public get isON(): boolean {
    return (this.param.state === switchState.ON);
  }

  public get isOFF(): boolean {
    return (this.param.state === switchState.OFF);
  }

  public motorSwitch() {
    if (this.isON) {
      this.param.state = switchState.OFF;
    } else {
      this.param.state = switchState.ON;
    }
  }
}

export enum switchState {
  OFF = 0,
  ON
}

export class MotorConfigType {
  constructor(public maxI: number,
              public maxRPM: number,
              public acceleration: number) {
  }
}

export class MotorParamType {
  constructor(public state: switchState,
              public I: number,
              public RPM: number,
              public H: number) {
  }
}
