import {OnDestroy, OnInit} from '@angular/core';
import {DataPointType} from './DataPointType';
import {LogicIOService} from '../logic-io.service';
import {Measure} from './Measure';

export class MotorClass implements OnInit, OnDestroy {

  private IOs: LogicIOService;
  private state = true;
  public stress = 0;
  private targetRPM = 0;
  private status: MotorStatusEnum = MotorStatusEnum.IDLE;
  public cruising = false; // velocità costante
  private timeON = 0;
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

  getsCurrent(): DataPointType {
    return this.sCurrent;
  }

  getsRPM(): DataPointType {
    return this.sRPM;
  }

/*  getsHours(): DataPointType {
    return this.sHours;
  }*/


  updateParam() {
    // console.log('update motor ' + this.name + 'sgtatus: ' + this.status);
    switch (this.status) {
      /**
       * stato iniziale idle / spento
       * */
      case MotorStatusEnum.IDLE: // idle / spento: se switchON -> accendi
        /*console.log('update motor ' + this.name + 'IDLE');*/
        if (this.isON) {
          this.status = MotorStatusEnum.SWITCHON;
        }
        this.timeON = 0;
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
        // console.log('update motor ' + this.name + 'RUNNING');
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
      if (!this.timeON) {
        this.timeON = Measure.getTimeStamp();
      }
      this.param.H += this.workPeriod();
      this.timeON = Measure.getTimeStamp();
    }
  }
  getHours() {
      return this.param.H;
  }
  private workPeriod(): number {
    return (Measure.getTimeStamp() - this.timeON) / 1000 / 1000;
  }
  updateRPM(targetRPM: number) {
    if (this.speedTargeted(targetRPM)) {
      return true;
    }
    this.param.I = ((targetRPM - this.param.RPM) * (targetRPM - this.param.RPM) / this.config.maxRPM / this.config.maxRPM
                    + this.param.RPM / targetRPM) * this.config.maxI * this.getStress();
    this.param.RPM += this.config.acceleration * (targetRPM - this.param.RPM);
  }
  getStress() {
    return (this.stress + 2) / (this.stress + 2.5);
  }
  speedTargeted(targetSpeed: number) {
    console.log('speedTargeted ' + targetSpeed + ', RPM: ' + this.param.RPM + ', max: ' + this.config.maxRPM);
    return (Math.abs(this.param.RPM - targetSpeed) / this.config.maxRPM < 0.0001);
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
