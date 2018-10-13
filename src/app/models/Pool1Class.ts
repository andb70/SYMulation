import {OnInit} from '@angular/core';
import {DataPointType} from './DataPointType';
import {LogicIOService} from '../logic-io.service';
import {JUtil} from './JUtil';

export class PoolClass implements OnInit {
  private _id = JUtil.getUID();
  private IOs: LogicIOService;
  private state = false;

  // private status: PoolStatusEnum = PoolStatusEnum.IDLE;

  constructor(public name: string,
              private config: PoolConfigType,
              private param: PoolParamType,
              private sLiquidFlow: DataPointType,
              private sTemperature: DataPointType,
              private sLiquidLevel: DataPointType,
              private flowRateIN: number,
              private flowRateOUT: number  ) {
  }
  ngOnInit(): void { }

  serialize() {
    let o = new Object();
    o['id'] = this._id;
    o['name'] = this.name;
    o['config'] = this.config;
    o['param'] = this.param;
    o['sLiquidFlow'] = {id: this.sLiquidFlow.getID(), obj: this.sLiquidFlow.serialize()};
    o['sTemperature'] = {id: this.sTemperature.getID(), obj: this.sTemperature.serialize()};
    o['sLiquidLevel'] = {id: this.sLiquidLevel.getID(), obj: this.sLiquidLevel.serialize()};
    return o;
  }
  map(provider: any): DataPointType[] {
    let inputs = [];
    inputs.push(this.sLiquidFlow);
    inputs.push(this.sTemperature);
    inputs.push(this.sLiquidLevel);
    this.IOs = provider as LogicIOService;
    this.IOs.map(inputs);
/*    this.IOs.updateIO.subscribe( () => {
      this.IOs.nextValue( this.sLiquidFlow.map, this.param.LiquidFlow);
      this.IOs.nextValue( this.sTemperature.map, this.param.Temperature);
      this.IOs.nextValue( this.sLiquidLevel.map, this.param.LiquidLevel);
    });
    console.log('Pool fire ' + this.name);
    // imposta i valori iniziali in base a param
    this.IOs.nextValue( this.sLiquidFlow.map, this.param.LiquidFlow);
    this.IOs.nextValue( this.sTemperature.map, this.param.Temperature);
    this.IOs.nextValue( this.sLiquidLevel.map, this.param.LiquidLevel);*/
    return inputs;
  }




  getsLiquidFlow(): DataPointType {
    return this.sLiquidFlow;
  }

  get liquidFlowOUT(): number {
    if (this.isON) {
      // is draining
      // this.status = PoolStatusEnum.FILLING;
      return this.flowRateOUT;
    }
    return 0;
  }
  get liquidFlowIN(): number {

    return this.sLiquidFlow.scaledIncrement;
  }
  get liquidFlowTotal(): number {

    return this.sLiquidFlow.scaledValue;
  }

  getsTemperature(): DataPointType {
    return this.sTemperature;
  }

  getsLiquidLevel(): DataPointType {
    return this.sLiquidLevel;
  }
/*
  getsRPM(): DataPointType {
    return this.sRPM;
  }*/
  updateParam(sRPM: DataPointType) {
    /*
      solo se la vasca ha un input o un output:
        se la vasca ha un input incrementa il contenuto
        se this.status = ON, cioè la vasca è in svuotamento:
          riduci il contenuto della vasca
     */
    let nextLevel = this.sLiquidLevel.scaledValue;
    let flowIn = sRPM.percentValue * this.flowRateIN;
    if (this._id === 32) {
      console.log('pool start', nextLevel,  this.param.LiquidLevel, this.param.LiquidFlow,
        this.liquidFlowOUT, this.sLiquidLevel.scaledValue, 'max:', this.config.maxLevel);
    }


    this.param.LiquidFlow = DataPointType.scale(flowIn + this.sLiquidFlow.scaledValue,
      this.sLiquidFlow.scaleMin, this.sLiquidFlow.scaleMax, this.sLiquidFlow.inMin, this.sLiquidFlow.inMax);

    nextLevel += flowIn - this.liquidFlowOUT;

    if (nextLevel < 0) {
      nextLevel = 0;
    }  else if (nextLevel > this.config.maxLevel) {
      nextLevel = this.config.maxLevel;
    }

    this.param.LiquidLevel = DataPointType.scale(nextLevel,
      this.sLiquidLevel.scaleMin, this.sLiquidLevel.scaleMax, this.sLiquidLevel.inMin, this.sLiquidLevel.inMax);

    if (this._id === 32) {
      console.log('pool end  ', nextLevel,  this.param.LiquidLevel, this.param.LiquidFlow,
        this.liquidFlowOUT, this.sLiquidLevel.scaledValue);
    }

    this.IOs.nextValue( this.sLiquidFlow.map, this.param.LiquidFlow);
    this.IOs.nextValue( this.sTemperature.map, this.param.Temperature);
    this.IOs.nextValue( this.sLiquidLevel.map, this.param.LiquidLevel);
  }


  public get isON(): boolean {
    return (this.param.state === switchState.ON);
  }

  public get isOFF(): boolean {
    return (this.param.state === switchState.OFF);
  }

  public get isHeatON(): boolean {
    return (this.param.heatState === switchState.ON);
  }

  public get isHeatOFF(): boolean {
    return (this.param.heatState === switchState.OFF);
  }

  public poolSwitch() {
    if (this.isON) {
      this.param.state = switchState.OFF;
    } else {
      this.param.state = switchState.ON;
    }
  }
  public poolHeatON() {
/*    if (this.isON) {
      this.param.state = switchState.OFF;
    } else {
      this.param.state = switchState.ON;
    }*/
  }
}


export class Pool1Class implements OnInit {
  private _id = JUtil.getUID();
  private IOs: LogicIOService;
  private state = false;

  constructor(public name: string,
              private config: PoolConfig1Type,
              private param: PoolParam1Type,
              private sLiquidFlow: DataPointType,
              private sTemperature: DataPointType,
              private sPH: DataPointType) {
  }
  ngOnInit(): void { }


  serialize() {
    let o = new Object();
    o['id'] = this._id;
    o['name'] = this.name;
    o['config'] = this.config;
    o['param'] = this.param;
    o['sLiquidFlow'] = {id: this.sLiquidFlow.getID(), obj: this.sLiquidFlow.serialize()};
    o['sTemperature'] = {id: this.sTemperature.getID(), obj: this.sTemperature.serialize()};
    o['sPH'] = {id: this.sPH.getID(), obj: this.sPH.serialize()};
    return o;
  }
  map(provider: any): DataPointType[] {
    this.IOs = provider as LogicIOService;

    this.IOs.updateIO.subscribe( () => {
      this.IOs.nextValue( this.sLiquidFlow.map, this.sLiquidFlow.value);
      this.IOs.nextValue( this.sTemperature.map, this.sTemperature.value);
      this.IOs.nextValue( this.sPH.map, this.sPH.value);
    });
    let inputs = [];
    inputs.push(this.sLiquidFlow);
    inputs.push(this.sTemperature);
    inputs.push(this.sPH);
    return inputs;
  }



  updateIO() {
    let names = ['sLiquidFlow', 'sTemperature', 'sPH'];
    for (let i = 0; i < names.length; i++) {
      console.log('call nextValue ' + names[i] + ' v: ' + this[names[i]].initValue);
      this.IOs.nextValue(this[names[i]].map, this[names[i]].initValue);
    }
  }

  getsLiquidFlow(): DataPointType {
    return this.sLiquidFlow;
  }

  getsTemperature(): DataPointType {
    return this.sTemperature;
  }

  getsPH(): DataPointType {
    return this.sPH;
  }


  updateParam() {
  }
  public get isON(): boolean {
    return (this.param.state === switchState.ON);
  }

  public get isOFF(): boolean {
    return (this.param.state === switchState.OFF);
  }

  public poolSwitch() {
    if (this.isON) {
      this.param.state = switchState.OFF;
    } else {
      this.param.state = switchState.ON;
    }
  }
}





export class Pool2Class implements OnInit {
  private _id = JUtil.getUID();
  private IOs: LogicIOService;
  private state = false;

  constructor(public name: string,
              private config: PoolConfig2Type,
              private param: PoolParam2Type,
              private sLiquidLevel: DataPointType,
              private sPH: DataPointType) {
  }
  ngOnInit(): void { }


  serialize() {
    let o = new Object();
    o['id'] = this._id;
    o['name'] = this.name;
    o['config'] = this.config;
    o['param'] = this.param;
    o['sLiquidLevel'] = {id: this.sLiquidLevel.getID(), obj: this.sLiquidLevel.serialize()};
    o['sPH'] = {id: this.sPH.getID(), obj: this.sPH.serialize()};
    return o;
  }
  map(provider: any): DataPointType[] {
    this.IOs = provider as LogicIOService;

    this.IOs.updateIO.subscribe( () => {
      this.IOs.nextValue( this.sLiquidLevel.map, this.sLiquidLevel.value);
      this.IOs.nextValue( this.sPH.map, this.sPH.value);
    });
    let inputs = [];
    inputs.push(this.sLiquidLevel);
    inputs.push(this.sPH);
    return inputs;
  }



  updateIO() {
    let names = ['sLiquidLevel', 'sPH'];
    for (let i = 0; i < names.length; i++) {
      console.log('call nextValue ' + names[i] + ' v: ' + this[names[i]].initValue);
      this.IOs.nextValue(this[names[i]].map, this[names[i]].initValue);
    }
  }

  getsLiquidLevel(): DataPointType {
    return this.sLiquidLevel;
  }

  getsPH(): DataPointType {
    return this.sPH;
  }


  updateParam() {
  }


  public get isON(): boolean {
    return (this.param.state === switchState.ON);
  }

  public get isOFF(): boolean {
    return (this.param.state === switchState.OFF);
  }

  public poolSwitch() {
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

export class PoolConfigType {
  constructor(public minT: number,
              public maxT: number,
              public maxLevel: number) {
  }
}

export class PoolParamType {
  constructor(public state: switchState,
              public heatState: switchState,
              public LiquidFlow: number,
              public Temperature: number,
              public LiquidLevel: number) {
  }
}

export class PoolConfig1Type {
  constructor(public minT: number,
              public maxT: number,
              public maxRH: number) {
  }
}

export class PoolParam1Type {
  constructor(public state: switchState,
              public LiquidFlow: number,
              public Temperature: number,
              public RH: number) {
  }
}

export class PoolConfig2Type {
  constructor(public minLevel: number,
              public minPH: number,
              public maxPH: number) {
  }
}

export class PoolParam2Type {
  constructor(public state: switchState,
              public LiquidLevel: number,
              public PH: number) {
  }
}
/*enum PoolStatusEnum {
  IDLE,
  FILLING
}*/
