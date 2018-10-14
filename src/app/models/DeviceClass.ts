import {OnInit} from '@angular/core';
import {DataPointType} from './DataPointType';
import {LogicIOService} from '../logic-io.service';
import {JUtil} from './JUtil';
import {Measure} from './Measure';

export class DeviceClass implements OnInit {
  private _id = JUtil.getUID();
  private IOs: LogicIOService;
  private state = false;
  private status = MotorStatusEnum.IDLE;
  private _timeON = 0;
  private _acceleration = 0;
  private _targetRPM = 0;

  private constructor(public name: string,
                private config: DeviceConfigType,
                private param: DeviceParamType,
                private sLiquidFlow: DataPointType,
                private sTemperature: DataPointType,
                private sLiquidLevel: DataPointType,
                private sRH: DataPointType,
                private sPH: DataPointType,
                private sCurrent: DataPointType,
                private sRPM: DataPointType,
                private sHours: DataPointType) { }

  static newPoolLevelPH(name: string,
                        config: DeviceConfigType,
                        param: DeviceParamType,
                        sLiquidLevel: DataPointType,
                        sPH: DataPointType) {
    let device = new DeviceClass(name, config, param,
      null,
      null,
      sLiquidLevel,
      null,
      sPH,
      null,
      null,
      null);

    return device;
  }

  static newPoolFlowTempLevel(name: string,
                        config: DeviceConfigType,
                        param: DeviceParamType,
                        sLiquidFlow: DataPointType,
                        sTemperature: DataPointType,
                        sLiquidLevel: DataPointType) {
    let device = new DeviceClass(name, config, param,
      sLiquidFlow,
      sTemperature,
      sLiquidLevel,
      null,
      null,
      null,
      null,
      null);

    return device;
  }

  static newPoolFlowTempRH(name: string,
                        config: DeviceConfigType,
                        param: DeviceParamType,
                        sLiquidFlow: DataPointType,
                        sTemperature: DataPointType,
                        sRH: DataPointType) {
    let device = new DeviceClass(name, config, param,
      sLiquidFlow,
      sTemperature,
      null,
      sRH,
      null,
      null,
      null,
      null);
      console.log('DeviceClass.newPoolFlowTempRH', sLiquidFlow, sTemperature, sRH);
    return device;
  }

  static newMotorCurrentRpmHours(name: string,
                        config: DeviceConfigType,
                        param: DeviceParamType,
                        sCurrent: DataPointType,
                        sRPM: DataPointType,
                        sHours: DataPointType) {
    let device = new DeviceClass(name, config, param,
      null,
      null,
      null,
      null,
      null,
      sCurrent,
      sRPM,
      sHours);

    return device;
  }

  ngOnInit(): void { }

  serialize() {
    let o = new Object();
    o['id'] = this._id;
    o['name'] = this.name;
    o['config'] = this.config;
    o['param'] = this.param;
    if (this.sLiquidFlow) { o['sLiquidFlow'] = {id: this.sLiquidFlow.getID(), obj: this.sLiquidFlow.serialize()}; }
    if (this.sTemperature) { o['sTemperature'] = {id: this.sTemperature.getID(), obj: this.sTemperature.serialize()}; }
    if (this.sLiquidLevel) { o['sLiquidLevel'] = {id: this.sLiquidLevel.getID(), obj: this.sLiquidLevel.serialize()}; }
    if (this.sRH) { o['sRH'] = {id: this.sRH.getID(), obj: this.sRH.serialize()}; }
    if (this.sPH) { o['sPH'] = {id: this.sPH.getID(), obj: this.sPH.serialize()}; }
    if (this.sCurrent) { o['sCurrent'] = {id: this.sCurrent.getID(), obj: this.sCurrent.serialize()}; }
    if (this.sRPM) { o['sRPM'] = {id: this.sRPM.getID(), obj: this.sRPM.serialize()}; }
    if (this.sHours) { o['sHours'] = {id: this.sHours.getID(), obj: this.sHours.serialize()}; }

    return o;
  }
  map(provider: any): DataPointType[] {
    let inputs = [];
    if (this.sLiquidFlow) { inputs.push(this.sLiquidFlow); }
    if (this.sTemperature) { inputs.push(this.sTemperature); }
    if (this.sLiquidLevel) { inputs.push(this.sLiquidLevel); }
    if (this.sRH) { inputs.push(this.sRH); }
    if (this.sPH) { inputs.push(this.sPH); }
    if (this.sCurrent) { inputs.push(this.sCurrent); }
    if (this.sRPM) { inputs.push(this.sRPM); }
    if (this.sHours) { inputs.push(this.sHours); }

    this.IOs = provider as LogicIOService;
    this.IOs.map(inputs);
    return inputs;
  }
  private nextValue() {
    if (this.sLiquidFlow)  {this.IOs.nextValue( this.sLiquidFlow.map, this.param.LiquidFlow); }
    if (this.sTemperature) {this.IOs.nextValue( this.sTemperature.map, this.param.Temperature); }
    if (this.sLiquidLevel) {this.IOs.nextValue( this.sLiquidLevel.map, this.param.LiquidLevel); }
    if (this.sRH)          {this.IOs.nextValue( this.sRH.map, this.param.RH); }
    if (this.sPH)          {this.IOs.nextValue( this.sPH.map, this.param.PH); }
    if (this.sCurrent)     {this.IOs.nextValue( this.sCurrent.map, this.param.I); }
    if (this.sRPM)         {this.IOs.nextValue( this.sRPM.map, this.param.RPM); }
    if (this.sHours)       {this.IOs.nextValue( this.sHours.map, this.param.H); }
  }
  updateFlowTempRH(sRPM: DataPointType) {
    let liquidFlow = sRPM.percentValue * this.config.flowRateIN + this.sLiquidFlow.scaledValue;
    this.param.LiquidFlow = DataPointType.scale(liquidFlow,
      this.sLiquidFlow.scaleMin, this.sLiquidFlow.scaleMax, this.sLiquidFlow.inMin, this.sLiquidFlow.inMax);
    console.log('DeviceClass 149', this.sLiquidFlow);
    this.nextValue();
  }
  updateLevelPH(sRPM: DataPointType) {
    this.updateLiquidLevel(sRPM.percentValue * this.config.flowRateIN);
    // update ph
    this.nextValue();
  }
  updateFlowTempLevelParam(sRPM: DataPointType) {
    let liquidFlow = this.updateLiquidLevel(sRPM.percentValue * this.config.flowRateIN) + this.sLiquidFlow.scaledValue;
    this.param.LiquidFlow = DataPointType.scale(liquidFlow,
      this.sLiquidFlow.scaleMin, this.sLiquidFlow.scaleMax, this.sLiquidFlow.inMin, this.sLiquidFlow.inMax);
    this.nextValue();
  }
  private updateLiquidLevel(flowIn: number) {

    let nextLevel = this.sLiquidLevel.scaledValue + flowIn - this.liquidFlowOUT;

    if (nextLevel < 0) {
      nextLevel = 0;
    }  else if (nextLevel > this.config.levelMax) {
      nextLevel = this.config.levelMax;
    }

    this.param.LiquidLevel = DataPointType.scale(nextLevel,
      this.sLiquidLevel.scaleMin, this.sLiquidLevel.scaleMax, this.sLiquidLevel.inMin, this.sLiquidLevel.inMax);

    return flowIn;
  }


  updateCurrentRpmHoursParam() {
    // console.log('update motor ' + this.name + 'sgtatus: ' + this.status);
    switch (this.status) {
      /**
       * IDLE
       *
       * stato iniziale spento
       * se isON
       *    azzera l'accelerazione
       *    passa allo stato  RUNNING
       *
       */
      case MotorStatusEnum.IDLE: // idle / spento: se switchON -> accendi
        /*console.log('update motor ' + this.name + 'IDLE');*/
        if (this.isON) {
          this._acceleration = 0;
          this.status = MotorStatusEnum.RUNNING;
          break;
        }
        this._timeON = 0;
        break;

      /**
       * RUNNING
       *
       * in rotazione
       * se isOFF
       *    imposta l'accelerazione di spegnimento
       *    passa allo stato  SWITCHOFF
       * eltrimenti
       *    aggiorna velocità e corrente
       *
       */
      case MotorStatusEnum.RUNNING: // in rotazione
        // console.log('update motor ' + this.name + 'RUNNING');
        if (this.isOFF) {
          this._acceleration = this.config.acceleration;
          this.status = MotorStatusEnum.SWITCHOFF;
          break;
        }
        this.updateRPM(this._targetRPM);
        break;

      case MotorStatusEnum.SWITCHOFF: // spegne -> decelera fino ad arresto e poi > idle
        console.log('update motor ' + this.name + 'SWITCHOFF');
        if (this.isON) {
          this._acceleration = 0;
          this.status = MotorStatusEnum.RUNNING;
          break;
        }
        if (this.updateRPMdown()) {
          this.status = MotorStatusEnum.IDLE;
        }
        break;

    }

    if (this.status !== MotorStatusEnum.IDLE) {
      if (!this._timeON) {
        this._timeON = Measure.getTimeStamp();
      }
      this.param.H += this.workPeriod();
      this._timeON = Measure.getTimeStamp();
    }

    this.nextValue();

  }
  private updateRPMdown(): boolean {
    this.param.I = 0;

    if (this.speedTargeted(0)) {
      this._acceleration = 0;
      return true;
    }
    this.param.RPM -= this.config.maxRPM * this._acceleration / 10 ;
    if (this.param.RPM < 0) { this.param.RPM = 0; }
    return false;
  }
  private updateRPM(targetRPM: number): boolean {
    console.log();

    if (this.speedTargeted(targetRPM)) {
      this._acceleration = 0;
      return true;
    }

    if (this._acceleration < this.config.acceleration) {
      this._acceleration += this.config.acceleration * .2;
    }
    let dTerm = 0;
    if ((targetRPM - this.param.RPM) > 0) {dTerm = Math.pow((targetRPM - this.param.RPM) / this.config.maxRPM, 2) / 4 ; }
    this.param.I = (dTerm + this.param.RPM / this.config.maxRPM) * this.config.maxI * this.getStress();
    console.log('DeviceClass 265 dTerm:', dTerm, 'config:', this.config, 'stress:', this.getStress(), 'param:', this.param);

    this.param.RPM += this._acceleration * (targetRPM - this.param.RPM);
    return false;
  }

  get current(): number {
    return this.sCurrent.scaledValue;
  }

  get RPM(): number {
    return this.sRPM.scaledValue;
  }

  getsRPM(): DataPointType {
    return this.sRPM;
  }

  get hours(): number {
    return this.param.H;
  }
  private workPeriod(): number {
    return (Measure.getTimeStamp() - this._timeON) / 1000 / 1000;
  }
  get stress(): number {
    return this.config.stress;
  }
  set stress (value: number) {
    this.config.stress = value;
  }
  getStress() {
    return (this.config.stress + 2) / (this.config.stress + 2.5);
  }

  speedTargeted(targetSpeed: number) {
    // console.log('speedTargeted ' + targetSpeed + ', RPM: ' + this.param.RPM + ', max: ' + this.config.maxRPM);
    return (Math.abs(this.param.RPM - targetSpeed) / this.config.maxRPM < 0.0001);
  }

  set targetSpeed(RPM: number) {
    this._targetRPM = DataPointType.scale(RPM, this.sRPM.scaleMin, this.sRPM.scaleMax, this.sRPM.inMin, this.sRPM.inMax);
  }
  get targetSpeed(): number {
    return DataPointType.scale(this._targetRPM, this.sRPM.inMin, this.sRPM.inMax, this.sRPM.scaleMin, this.sRPM.scaleMax);
  }

  get liquidFlowOUT(): number {
    if (this.isON) {      // is draining
      return this.config.flowRateOUT;
    }
    return 0;
  }

  get liquidFlowIN(): number {
    return this.sLiquidFlow.scaledIncrement;
  }

  get liquidFlowTotal(): number {
    /*if (this.name = 'Vasca 3') {
    console.log('DeviceClass.liquidFlowTotal', this.sLiquidFlow); }
    if (this.sLiquidFlow) {*/
      return this.sLiquidFlow.scaledValue;
    /*}
    return 0;*/
  }

  get temperature(): number {
    /*if (this.name = 'Vasca 3') {
      console.log('DeviceClass.temperature', this.sTemperature, this);}
    if (this.sTemperature) {*/
      return this.sTemperature.scaledValue;
    /*}
    return 0;*/
  }

  get liquidLevel(): number {
    /*console.log('DeviceClass.liquidLevel', this.sLiquidLevel);
    if (this.sLiquidLevel) {*/
      return this.sLiquidLevel.scaledValue;
   /* }
    return 0;*/
  }

  get ph(): number {
    return this.sPH.scaledValue;
  }

  get rh(): number {
    /*if (this.name = 'Vasca 3') {
    console.log('DeviceClass.rh', this.sRH); }
    if (this.sRH) {*/
      return this.sRH.scaledValue;
    /*}
    return 0;*/
  }


  public get isON(): boolean {
    return (this.param.state === SwitchState.ON);
  }

  public get isOFF(): boolean {
    return (this.param.state === SwitchState.OFF);
  }

  public get isHeatON(): boolean {
    return (this.param.heatState === SwitchState.ON);
  }

  public get isHeatOFF(): boolean {
    return (this.param.heatState === SwitchState.OFF);
  }

  public deviceSwitch() {
    if (this.isON) {
      this.param.state = SwitchState.OFF;
    } else {
      this.param.state = SwitchState.ON;
    }
  }
  public heatSwitch() {
    if (this.isHeatON) {
      this.param.heatState = SwitchState.OFF;
    } else {
      this.param.heatState = SwitchState.ON;
    }
  }
}



export class DeviceConfigType {
  constructor(public tempMin: number,
              public tempMax: number,
              public tempSP: number,
              public phMin: number,
              public phMax: number,
              public rhMax: number,
              public levelMin: number,
              public levelMax: number,
              public flowRateIN: number,
              public flowRateOUT: number,
              public maxI: number,
              public maxRPM: number,
              public stress: number,
              public acceleration: number) {
  }
}

export class DeviceParamType {
  constructor(public state: SwitchState,
              public heatState: SwitchState,
              public Temperature: number,
              public LiquidFlow: number,
              public LiquidLevel: number,
              public RH: number,
              public PH: number,
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

export enum SwitchState {
  OFF = 0,
  ON
}
