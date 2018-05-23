import { Component } from '@angular/core';
import {DataPointType} from './models/DataPointType';
import {ObjectType} from './models/ObjectType';
import {MotorClass, MotorConfigType, MotorParamType, switchState} from './models/MotorClass';
import {LogicIOService} from './logic-io.service';
import {
  Pool1Class,
  Pool2Class,
  PoolClass,
  PoolConfig1Type,
  PoolConfig2Type,
  PoolConfigType,
  PoolParam1Type, PoolParam2Type,
  PoolParamType
} from './models/Pool1Class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sCurrent = new DataPointType('current'	,
    0,
    1023	,
    0	,
    125	,
    0	,
    1	,
    0.8
  );
  sRPM = new DataPointType('rpm'	,
    0,
    1023	,
    0	,
    4500	,
    0	,
    1.1	,
    0.5
  );
  sHours = new DataPointType('hours'	,
    0,
    1023	,
    0	,
    2000	,
    0	,
    1.6	,
    0.8
  );
  sLiquidFlow = new DataPointType('contatoreAcqua'	,
    0,
    1023	,
    0	,
    600	,
    20	,
    22	,
    0.8
  );
  sTemperature = new DataPointType('temperatura'	,
    0,
    1023	,
    -200	,
    600	,
    20	,
    15	,
    0.8
  );
  sLiquidLevel = new DataPointType('livelloAcqua'	,
    0,
    1023	,
    0	,
    2000	,
    1400	,
    10	,
    0.8
  );
  sRH = new DataPointType('umidità'	,
    0,
    1023	,
    0	,
    100	,
    60	,
    5	,
    0.8
  );
  spH = new DataPointType('pH'	,
    0,
    1023	,
    0	,
    14	,
    7.3	,
    4	,
    0.8
  );
  pompa1: MotorClass = new MotorClass('Pompa 1', {maxI: 60, maxRPM: 4500, acceleration: .1} as MotorConfigType,
    {state: switchState.OFF, I: 0, RPM: 0, H: 0} as MotorParamType,
    DataPointType.fromTemplate(this.sCurrent,  5, 0),
    DataPointType.fromTemplate(this.sRPM, 6, 1),
    DataPointType.fromTemplate(this.sHours, 7, 2));

  pompa2: MotorClass = new MotorClass('Pompa 2', {maxI: 30, maxRPM: 2000, acceleration: .1} as MotorConfigType,
    {state: switchState.OFF, I: 1, RPM: 120, H: 24} as MotorParamType,
    DataPointType.fromTemplate(this.sCurrent, 13, 3),
    DataPointType.fromTemplate(this.sRPM, 14, 4),
    DataPointType.fromTemplate(this.sHours, 15, 5));

  ventilatore1: MotorClass = new MotorClass('Ventilatore 1', {maxI: 22, maxRPM: 1400, acceleration: .1} as MotorConfigType,
    {state: switchState.OFF, I: 1, RPM: 120, H: 24} as MotorParamType,
    DataPointType.fromTemplate(this.sCurrent, 21, 6),
    DataPointType.fromTemplate(this.sRPM, 22, 7),
    DataPointType.fromTemplate(this.sHours, 23, 8));


  motore1: MotorClass = new MotorClass('Motore 1', {maxI: 90, maxRPM: 1800, acceleration: .1} as MotorConfigType,
    {state: switchState.OFF, I: 1, RPM: 120, H: 24} as MotorParamType,
    DataPointType.fromTemplate(this.sCurrent, 40, 9),
    DataPointType.fromTemplate(this.sRPM, 41, 10),
    DataPointType.fromTemplate(this.sHours, 42, 11));

  motore2: MotorClass = new MotorClass('Motore 2', {maxI: 90, maxRPM: 1800, acceleration: .1} as MotorConfigType,
    {state: switchState.OFF, I: 1, RPM: 120, H: 24} as MotorParamType,
    DataPointType.fromTemplate(this.sCurrent, 44, 12),
    DataPointType.fromTemplate(this.sRPM, 45, 13),
    DataPointType.fromTemplate(this.sHours, 46, 14));

  vasca1: PoolClass = new PoolClass('Vasca 1', {minT: 4, maxT: 96, maxLevel: 1400} as PoolConfigType,
    {state: switchState.OFF, LiquidFlow: 0, Temperature: 48, LiquidLevel: 1000} as PoolParamType,
    DataPointType.fromTemplate(this.sLiquidFlow, 8, 15),
    DataPointType.fromTemplate(this.sTemperature, 9, 16),
    DataPointType.fromTemplate(this.sLiquidLevel, 10, 17));

  vasca2: PoolClass = new PoolClass('Vasca 2', {minT: 4, maxT: 96, maxLevel: 1400} as PoolConfigType,
    {state: switchState.OFF, LiquidFlow: 0, Temperature: 48, LiquidLevel: 1000} as PoolParamType,
    DataPointType.fromTemplate(this.sLiquidFlow, 16, 18),
    DataPointType.fromTemplate(this.sTemperature, 17, 19),
    DataPointType.fromTemplate(this.sLiquidLevel, 18, 20));

  vasca3: Pool1Class = new Pool1Class('Vasca 3', {minT: 4, maxT: 96, maxRH: 0.7} as PoolConfig1Type,
    {state: switchState.OFF, LiquidFlow: 0, Temperature: 48, RH: 0.5} as PoolParam1Type,
    DataPointType.fromTemplate(this.sLiquidFlow, 24, 21),
    DataPointType.fromTemplate(this.sTemperature, 25, 22),
    DataPointType.fromTemplate(this.sRH, 26, 23));


  vasca4: Pool2Class = new Pool2Class('Vasca 4', {minLevel: 200, minPH: 7.0, maxPH: 7.6} as PoolConfig2Type,
    {state: switchState.OFF, LiquidLevel: 1000, PH: 7.5} as PoolParam2Type,
    DataPointType.fromTemplate(this.sLiquidLevel, 29, 24),
    DataPointType.fromTemplate(this.spH, 30, 25));

  vasca5: Pool2Class = new Pool2Class('Vasca 5', {minLevel: 200, minPH: 7.0, maxPH: 7.6} as PoolConfig2Type,
    {state: switchState.OFF, LiquidLevel: 1000, PH: 7.3} as PoolParam2Type,
    DataPointType.fromTemplate(this.sLiquidLevel, 32, 26),
    DataPointType.fromTemplate(this.spH, 33, 27));

  vasca6: Pool2Class = new Pool2Class('Vasca 6', {minLevel: 200, minPH: 7.0, maxPH: 7.6} as PoolConfig2Type,
    {state: switchState.OFF, LiquidLevel: 1000, PH: 7.1} as PoolParam2Type,
    DataPointType.fromTemplate(this.sLiquidLevel, 35, 28),
    DataPointType.fromTemplate(this.spH, 36, 29));


  /**
  * node: ObjectType;
  * pompa1: Motor; // oggetto esterno di appoggio
  *
  * node.appendSensor(fromTemplate(sCurrent));
  * node.appendSensor(fromTemplate(sRPM));
  * node.appendSensor(fromTemplate(sHours));
  *
  * LogicIO.map(node.sensors(), pompa1.outputs(), [0,1,2])
  *
  */





  switch = false;
  root: ObjectType;
  constructor(private logicIO: LogicIOService) {

    this.root = new ObjectType('root', 'plant', 1);
    this.root
      .appendObject(new ObjectType('Sezione lavaggio', 'section', 2))
      .newObject()
        .appendObject(new ObjectType('Prelavaggio', 'unit', 3))
        .newObject()
          .appendObject(new ObjectType('Pompa 1', 'device', 4))
          .newObject()
            .appendSensors(this.pompa1.map(logicIO))
            .getParent()
          .appendSensors(this.vasca1.map(logicIO))
          .getParent()
        .getParent()
      .newObject()
        .appendObject(new ObjectType('Lavaggio', 'unit', 11))
        .newObject()
          .appendObject(new ObjectType('Pompa 2', 'device', 12))
          .newObject()
            .appendSensors(this.pompa2.map(logicIO))
            .getParent()
          .appendSensors(this.vasca2.map(logicIO))
          .getParent()
        .getParent()
      .newObject()
        .appendObject(new ObjectType('Asciugatura', 'unit', 19))
        .newObject()
          .appendObject(new ObjectType('Ventilatore', 'device', 20))
          .newObject()
            .appendSensors(this.ventilatore1.map(logicIO))
            .getParent()
          .appendSensors(this.vasca3.map(logicIO))
          .getParent()
        .getParent()

      .appendObject(new ObjectType('Sezione pretrattamento', 'section', 27))
      .newObject()
        .appendObject(new ObjectType('Vasca pre trattamento', 'unit', 28))
        .newObject()
          .appendSensors(this.vasca4.map(logicIO))
          .getParent()
        .appendObject(new ObjectType('Vasca primer', 'unit', 31))
        .newObject()
          .appendSensors(this.vasca5.map(logicIO))
          .getParent()
        .appendObject(new ObjectType('Vasca finisher', 'unit', 34))
        .newObject()
          .appendSensors(this.vasca6.map(logicIO))
          .getParent().getParent()

        .appendObject(new ObjectType('Sezione stoccaggio', 'section', 37))
        .newObject()
          .appendObject(new ObjectType('Impilatore', 'unit', 38))
          .newObject()
            .appendObject(new ObjectType('Motore 1', 'device', 39))
            .newObject()
              .appendSensors(this.motore1.map(logicIO))
              .getParent()
            .appendObject(new ObjectType('Motore 2', 'device', 43))
            .newObject()
              .appendSensors(this.motore2.map(logicIO))
    ;
  }

  motorSwitch() {
    this.switch = !this.switch;
    console.log('motor switch ' + this.switch);
    if (this.switch) {
      this.logicIO.scanStart(1000, 1000);
    } else  {
      this.logicIO.scanStop();
    }
  }

}
