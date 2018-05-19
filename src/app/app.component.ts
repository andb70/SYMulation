import { Component } from '@angular/core';
import {DataPointType} from './models/DataPointType';
import {ObjectType} from './models/ObjectType';
import {MotorClass, MotorConfigType, MotorParamType, switchState} from './models/MotorClass';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sCurrent = new DataPointType('corrente'	,
    1023	,
    -200	,
    600	,
    20	,
    0.8	,
    0.8
  );
  sRPM = new DataPointType('rpm'	,
    1023	,
    0	,
    4500	,
    0	,
    0.8	,
    0.5
  );
  sHours = new DataPointType('ore'	,
    1023	,
    0	,
    2000	,
    0	,
    0.095	,
    0.8
  );
  sLiquidFlow = new DataPointType('contatoreAcqua'	,
    1023	,
    0	,
    600	,
    20	,
    0.8	,
    0.8
  );
  sTemperature = new DataPointType('temperatura'	,
    1023	,
    0	,
    125	,
    0	,
    0.8	,
    0.8
  );
  sLiquidLevel = new DataPointType('livelloAcqua'	,
    1023	,
    -200	,
    600	,
    20	,
    0.8	,
    0.8
  );
  sRH = new DataPointType('umidità'	,
    1023	,
    -200	,
    600	,
    20	,
    0.8	,
    0.8
  );
  spH = new DataPointType('pH'	,
    1023	,
    -200	,
    600	,
    20	,
    0.8	,
    0.8
  );
  pompa1: MotorClass = new MotorClass('Pompa 1', 12, {maxI: 60, maxRPM: 4500, acceleration: 23} as MotorConfigType,
    {state: switchState.OFF, I: 1, RPM: 60, H: 12} as MotorParamType,
    DataPointType.fromTemplate(this.sCurrent, 'current', 5),
    DataPointType.fromTemplate(this.sRPM, 'RPM', 6),
    DataPointType.fromTemplate(this.sHours, 'h', 7));

  pompa2: MotorClass = new MotorClass('Pompa 2', 12, {maxI: 30, maxRPM: 2000, acceleration: 23} as MotorConfigType,
    {state: switchState.OFF, I: 1, RPM: 120, H: 24} as MotorParamType,
    DataPointType.fromTemplate(this.sCurrent, 'current', 13),
    DataPointType.fromTemplate(this.sRPM, 'RPM', 14),
    DataPointType.fromTemplate(this.sHours, 'h', 15));

  ventilatore1: MotorClass = new MotorClass('Ventilatore 1', 12, {maxI: 22, maxRPM: 1400, acceleration: 23} as MotorConfigType,
    {state: switchState.OFF, I: 1, RPM: 120, H: 24} as MotorParamType,
    DataPointType.fromTemplate(this.sCurrent, 'current', 21),
    DataPointType.fromTemplate(this.sRPM, 'RPM', 22),
    DataPointType.fromTemplate(this.sHours, 'h', 23));


  motore1: MotorClass = new MotorClass('Motore 1', 12, {maxI: 90, maxRPM: 1800, acceleration: 23} as MotorConfigType,
    {state: switchState.OFF, I: 1, RPM: 120, H: 24} as MotorParamType,
    DataPointType.fromTemplate(this.sCurrent, 'current', 40),
    DataPointType.fromTemplate(this.sRPM, 'RPM', 41),
    DataPointType.fromTemplate(this.sHours, 'h', 42));

  motore2: MotorClass = new MotorClass('Motore 2', 12, {maxI: 90, maxRPM: 1800, acceleration: 23} as MotorConfigType,
    {state: switchState.OFF, I: 1, RPM: 120, H: 24} as MotorParamType,
    DataPointType.fromTemplate(this.sCurrent, 'current', 44),
    DataPointType.fromTemplate(this.sRPM, 'RPM', 45),
    DataPointType.fromTemplate(this.sHours, 'h', 46));


  root: ObjectType;
  constructor() {

    this.root = new ObjectType('root', 'plant', 1);
    this.root
      .appendObject(new ObjectType('Sezione lavaggio', 'section', 2))
      .newObject()
        .appendObject(new ObjectType('Prelavaggio', 'unit', 3))
        .newObject()
          .appendObject(new ObjectType('Pompa 1', 'device', 4))
          .newObject()
            .appendSensor(this.pompa1.getsCurrent())
            .appendSensor(this.pompa1.getsRPM())
            .appendSensor(this.pompa1.getsHours())
            .getParent()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidFlow, 'liqflow', 8))
          .appendSensor(DataPointType.fromTemplate(this.sTemperature, 'temp', 9))
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 'liqLevel', 10))
          .getParent()
        .getParent()
      .newObject()
        .appendObject(new ObjectType('Lavaggio', 'unit', 11))
        .newObject()
          .appendObject(new ObjectType('Pompa 2', 'device', 12))
          .newObject()
            .appendSensor(this.pompa2.getsCurrent())
            .appendSensor(this.pompa2.getsRPM())
            .appendSensor(this.pompa2.getsHours())
            .getParent()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidFlow, 'liqflow', 16))
          .appendSensor(DataPointType.fromTemplate(this.sTemperature, 'temp', 17))
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 'liqLevel', 18))
          .getParent()
        .getParent()
      .newObject()
        .appendObject(new ObjectType('Asciugatura', 'unit', 19))
        .newObject()
          .appendObject(new ObjectType('Ventilatore', 'device', 20))
          .newObject()
            .appendSensor(this.ventilatore1.getsCurrent())
            .appendSensor(this.ventilatore1.getsRPM())
            .appendSensor(this.ventilatore1.getsHours())
            .getParent()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidFlow, 'liqflow', 24))
          .appendSensor(DataPointType.fromTemplate(this.sTemperature, 'temp', 25))
          .appendSensor(DataPointType.fromTemplate(this.sRH, 'RH', 26))
          .getParent()
        .getParent()

      .appendObject(new ObjectType('Sezione pretrattamento', 'section', 27))
      .newObject()
        .appendObject(new ObjectType('Vasca pre trattamento', 'unit', 28))
        .newObject()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 'liqLevel', 29))
          .appendSensor(DataPointType.fromTemplate(this.spH, 'pH', 30))
          .getParent()
        .appendObject(new ObjectType('Vasca primer', 'unit', 31))
        .newObject()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 'liqLevel', 32))
          .appendSensor(DataPointType.fromTemplate(this.spH, 'pH', 33))
          .getParent()
        .appendObject(new ObjectType('Vasca finisher', 'unit', 34))
        .newObject()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 'liqLevel', 35))
          .appendSensor(DataPointType.fromTemplate(this.spH, 'pH', 36))
          .getParent().getParent()

        .appendObject(new ObjectType('Sezione stoccaggio', 'section', 37))
        .newObject()
          .appendObject(new ObjectType('Impilatore', 'unit', 38))
          .newObject()
            .appendObject(new ObjectType('Motore 1', 'device', 39))
            .newObject()
              .appendSensor(this.ventilatore1.getsCurrent())
              .appendSensor(this.ventilatore1.getsRPM())
              .appendSensor(this.ventilatore1.getsHours())
              .getParent()
            .appendObject(new ObjectType('Motore 2', 'device', 43))
            .newObject()
              .appendSensor(this.ventilatore1.getsCurrent())
              .appendSensor(this.ventilatore1.getsRPM())
              .appendSensor(this.ventilatore1.getsHours())
    ;
  }

}
