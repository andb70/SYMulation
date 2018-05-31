import {OnDestroy, OnInit} from '@angular/core';
import {DataPointType} from './DataPointType';
import {LogicIOService} from '../logic-io.service';
import {Measure} from './Measure';
import {JUtil} from './JUtil';

export class MotorClass implements OnInit, OnDestroy {
  private _id = JUtil.getUID();
  private IOs: LogicIOService;
  private state = true;
  public stress = 0;
  private targetRPM = 0;
  private status: MotorStatusEnum = MotorStatusEnum.IDLE;
  public cruising = false; // velocità costante
  private timeON = 0;
  private _acceleration = 0;
  constructor(public name: string,
              private config: MotorConfigType,
              private param: MotorParamType,
              private sCurrent: DataPointType,
              private sRPM: DataPointType,
              private sHours: DataPointType) {
  }
  ngOnInit(): void { }

  ngOnDestroy(): void { }
  getID(): number {
    return this._id;
  }
  serialize() {
    let o = new Object();
    o['id'] = this._id;
    o['name'] = this.name;
    o['config'] = this.config;
    o['param'] = this.param;
    o['sCurrent'] = {id: this.sCurrent.getID(), obj: this.sCurrent.serialize()};
    o['sRPM'] = {id: this.sRPM.getID(), obj: this.sRPM.serialize()};
    o['sHours'] = {id: this.sHours.getID(), obj: this.sHours.serialize()};
    o['stress'] = this.stress;
    return o;
  }
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
        this._acceleration = 0;
        this.status = MotorStatusEnum.RUNNING;
        break;

      case MotorStatusEnum.SWITCHOFF: // spegne -> decelera fino ad arresto e poi > idle
        console.log('update motor ' + this.name + 'SWITCHOFF');
        if (this.isON) {
          this.status = MotorStatusEnum.SWITCHON;
        }
        this._acceleration = 1;
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
  setDefaults(fldName: string, value: number) {
    this.param[fldName] = value;
  }
  getHours() {
      return this.param.H;
  }
  private workPeriod(): number {
    return (Measure.getTimeStamp() - this.timeON) / 1000 / 1000;
  }
  updateRPM(targetRPM: number) {
    if (this.speedTargeted(targetRPM)) {
      this._acceleration = 0;
      return true;
    }
    this.param.I = ((targetRPM - this.param.RPM) * (targetRPM - this.param.RPM) / this.config.maxRPM / this.config.maxRPM
                    + this.param.RPM / targetRPM) * this.config.maxI * this.getStress();
    if (this._acceleration < this.config.acceleration) {
      this._acceleration += this.config.acceleration * .2;
    }
    this.param.RPM += this._acceleration * (targetRPM - this.param.RPM);
  }
  getStress() {
    return (this.stress + 2) / (this.stress + 2.5);
  }
  speedTargeted(targetSpeed: number) {
    // console.log('speedTargeted ' + targetSpeed + ', RPM: ' + this.param.RPM + ', max: ' + this.config.maxRPM);
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
