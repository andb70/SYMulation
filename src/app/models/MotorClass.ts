import {OnDestroy, OnInit} from '@angular/core';
import {DataPointType} from './DataPointType';
import {LogicIOService} from '../logic-io.service';

export class MotorClass implements OnInit, OnDestroy {

  private IOs: LogicIOService;
  private state = false;
  private targetRPM = 0;
  private status: MotorStatusEnum = MotorStatusEnum.IDLE;
  public cruising = false; // velocità costante

  constructor(public name: string,
              private config: MotorConfigType,
              private param: MotorParamType,
              private sCurrent: DataPointType,
              private sRPM: DataPointType,
              private sHours: DataPointType) {
  }
  ngOnInit(): void { }

  ngOnDestroy(): void { }

  map(provider: any): DataPointType[] {
    let inputs = [];
    inputs.push(this.sCurrent);
    inputs.push(this.sRPM);
    inputs.push(this.sHours);
    this.IOs = provider as LogicIOService;
    this.IOs.map(inputs);
    this.IOs.updateIO.subscribe( () => {
      // console.log('Motor fire ' + this.sCurrent.fldName);
      this.IOs.nextValue( this.sCurrent.map, this.param.I);
      this.IOs.nextValue( this.sRPM.map, this.param.RPM);
      this.IOs.nextValue( this.sHours.map, this.param.H);
    });
    return inputs;
  }



  updateIO() {
    let names = ['sCurrent', 'sRPM', 'sHours'];
    for (let i = 0; i < names.length; i++) {
      console.log('call nextValue ' + names[i] + ' v: ' + this[names[i]].initValue);
      this.IOs.nextValue(this[names[i]].map, this[names[i]].initValue);
    }
  }

  getsCurrent(): DataPointType {
    return this.sCurrent;
  }

  getsRPM(): DataPointType {
    return this.sRPM;
  }
  getTargetRPM(): number {
    return DataPointType.scale( this.targetRPM, this.sRPM.inMin, this.sRPM.inMax, this.sRPM.scaleMin, this.sRPM.scaleMax);
  }
  setTargetRPM(newValue: number) {
    this.targetRPM = DataPointType.scale( newValue, this.sRPM.scaleMin, this.sRPM.scaleMax, this.sRPM.inMin, this.sRPM.inMax);
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
      case MotorStatusEnum.IDLE: // idle / spento: se switchON -> accendi
        console.log('update motor ' + this.name + 'IDLE');
        if (this.isON) {
          this.status = MotorStatusEnum.SWITCHON;
        }
        break;

        /**
         * accensione e spegnimento:
         * esegui i controlli del caso e passa allo stato successivo
         */
      case MotorStatusEnum.SWITCHON: // accende -> in rotazione
        console.log('update motor ' + this.name + 'SWITCHON');
        if (this.isOFF) {
          this.status = MotorStatusEnum.SWITCHOFF;
          break;
        }
        this.status = MotorStatusEnum.RUNNING;
        break;

      case MotorStatusEnum.SWITCHOFF: // spegne -> decelera fino ad arresto e poi > idle
        console.log('update motor ' + this.name + 'SWITCHOFF');
        if (this.isON) {
          this.status = MotorStatusEnum.SWITCHON;
        }
        if (this.updateRPM(0)) {
          this.status = MotorStatusEnum.IDLE;
        }
        break;

        /**
         * sul fronte di discesa di switch -> spegne
         * aggiorna velocità e corrente
         * */
      case MotorStatusEnum.RUNNING: // in rotazione
        console.log('update motor ' + this.name + 'RUNNING');
        if (this.isOFF) {
          this.status = MotorStatusEnum.SWITCHOFF;
          this.cruising = false;
          break;
        }
        this.cruising = this.updateRPM(this.targetRPM);
        break;
    }
    if (this.status !== MotorStatusEnum.IDLE) {
      // this.sHours.update(this.refreshInterval);
    }
  }

  updateRPM(targetRPM: number) {
    if (this.speedTargeted(targetRPM)) {
      return true;
    }
    if (this.param.RPM > targetRPM) {
      this.accelera(targetRPM, -1);
    } else {
      this.accelera(targetRPM, 1);
    }
  }

  accelera(targetRPM: number, verso: number) {
    this.param.RPM += verso * this.config.acceleration * (targetRPM - this.param.RPM);
  }

  speedTargeted(targetSpeed: number) {
    console.log('speedTargeted ' + targetSpeed + ', RPM: ' + this.param.RPM + ', max: ' + this.config.maxRPM)
    return (Math.abs(this.param.RPM - targetSpeed) / this.config.maxRPM < 0.01);
  }

  set targetSpeed(RPM: number) {
    this.targetRPM = DataPointType.scale(RPM, this.sRPM.scaleMin, this.sRPM.scaleMax, this.sRPM.inMin, this.sRPM.inMax);
  }
  get targetSpeed(): number {
    return DataPointType.scale(this.targetRPM, this.sRPM.inMin, this.sRPM.inMax, this.sRPM.scaleMin, this.sRPM.scaleMax);
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
enum MotorStatusEnum {
  IDLE,
  SWITCHON,
  SWITCHOFF,
  RUNNING
}
