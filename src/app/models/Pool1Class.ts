import {OnDestroy, OnInit} from '@angular/core';
import {DataPointType} from './DataPointType';
import {LogicIOService} from '../logic-io.service';

export class PoolClass implements OnInit, OnDestroy {

  private IOs: LogicIOService;
  private state = false;

  constructor(public name: string,
              private config: PoolConfigType,
              private param: PoolParamType,
              private sLiquidFlow: DataPointType,
              private sTemperature: DataPointType,
              private sLiquidLevel: DataPointType) {
  }
  ngOnInit(): void { }

  ngOnDestroy(): void { }

  map(provider: any): DataPointType[] {
    this.IOs = provider as LogicIOService;

    this.IOs.updateIO.subscribe( () => {
      this.IOs.nextValue( this.sLiquidFlow.map, this.sLiquidFlow.value);
      this.IOs.nextValue( this.sTemperature.map, this.sTemperature.value);
      this.IOs.nextValue( this.sLiquidLevel.map, this.sLiquidLevel.value);
    });
    let inputs = [];
    inputs.push(this.sLiquidFlow);
    inputs.push(this.sTemperature);
    inputs.push(this.sLiquidLevel);
    return inputs;
  }



  updateIO() {
    let names = ['sLiquidFlow', 'sTemperature', 'sLiquidLevel'];
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

  getsLiquidLevel(): DataPointType {
    return this.sLiquidLevel;
  }


  updateParam() {
  }


  public get isON(): boolean {
    return (this.param.state === switchState.ON);
  }

  public get isOFF(): boolean {
    return (this.param.state === switchState.OFF);
  }

  public PoolSwitch() {
    if (this.isON) {
      this.param.state = switchState.OFF;
    } else {
      this.param.state = switchState.ON;
    }
  }
}


export class Pool1Class implements OnInit, OnDestroy {

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

  ngOnDestroy(): void { }

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

  public PoolSwitch() {
    if (this.isON) {
      this.param.state = switchState.OFF;
    } else {
      this.param.state = switchState.ON;
    }
  }
}





export class Pool2Class implements OnInit, OnDestroy {

  private IOs: LogicIOService;
  private state = false;

  constructor(public name: string,
              private config: PoolConfig2Type,
              private param: PoolParam2Type,
              private sLiquidLevel: DataPointType,
              private sPH: DataPointType) {
  }
  ngOnInit(): void { }

  ngOnDestroy(): void { }

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

  public PoolSwitch() {
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
enum PoolStatusEnum {
  EMPTY,
  FILLING,
  DRAINING,
  FULL
}
