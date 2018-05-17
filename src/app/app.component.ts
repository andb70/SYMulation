import { Component } from '@angular/core';
import {DataPointType} from './models/DataPointType';
import {CommDriverService} from './comm-driver.service';
import {ObjectType} from './models/ObjectType';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  sensors = [];
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

  root: ObjectType;
  constructor(private collector: CommDriverService) {

    this.root = new ObjectType('root', 'plant1', 1);
    this.root
      .appendObject(new ObjectType('Sezione lavaggio', 's1', 2))
      .newObject()
        .appendObject(new ObjectType('Prelavaggio', 't1', 3))
        .newObject()
          .appendObject(new ObjectType('Pompa 1', 'o1', 4))
          .newObject()
            .appendSensor(DataPointType.fromTemplate(this.sCurrent, 'current', 5))
            .appendSensor(DataPointType.fromTemplate(this.sRPM, 'RPM', 6))
            .appendSensor(DataPointType.fromTemplate(this.sHours, 'h', 7))
            .getParent()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidFlow, 'liqflow', 8))
          .appendSensor(DataPointType.fromTemplate(this.sTemperature, 'temp', 9))
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 'liqLevel', 10))
          .getParent()
        .getParent()
      .newObject()
        .appendObject(new ObjectType('Lavaggio', 't2', 11))
        .newObject()
          .appendObject(new ObjectType('Pompa 2', 'o2', 12))
          .newObject()
            .appendSensor(DataPointType.fromTemplate(this.sCurrent, 'current', 13))
            .appendSensor(DataPointType.fromTemplate(this.sRPM, 'RPM', 14))
            .appendSensor(DataPointType.fromTemplate(this.sHours, 'h', 15))
            .getParent()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidFlow, 'liqflow', 16))
          .appendSensor(DataPointType.fromTemplate(this.sTemperature, 'temp', 17))
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 'liqLevel', 18))
          .getParent()
        .getParent()
      .newObject()
        .appendObject(new ObjectType('Asciugatura', 't3', 19))
        .newObject()
          .appendObject(new ObjectType('Ventilatore', 'o3', 20))
          .newObject()
            .appendSensor(DataPointType.fromTemplate(this.sCurrent, 'current', 21))
            .appendSensor(DataPointType.fromTemplate(this.sRPM, 'RPM', 22))
            .appendSensor(DataPointType.fromTemplate(this.sHours, 'h', 23))
            .getParent()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidFlow, 'liqflow', 24))
          .appendSensor(DataPointType.fromTemplate(this.sTemperature, 'temp', 25))
          .appendSensor(DataPointType.fromTemplate(this.sRH, 'RH', 26))
          .getParent()
        .getParent()

      .appendObject(new ObjectType('Sezione pretrattamento', 's2', 27))
      .newObject()
        .appendObject(new ObjectType('Vasca pre trattamento', 't4', 28))
        .newObject()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 'liqLevel', 29))
          .appendSensor(DataPointType.fromTemplate(this.spH, 'pH', 30))
          .getParent()
        .appendObject(new ObjectType('Vasca primer', 't5', 31))
        .newObject()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 'liqLevel', 32))
          .appendSensor(DataPointType.fromTemplate(this.spH, 'pH', 33))
          .getParent()
        .appendObject(new ObjectType('Vasca finisher', 't6', 34))
        .newObject()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 'liqLevel', 35))
          .appendSensor(DataPointType.fromTemplate(this.spH, 'pH', 36))
          .getParent().getParent()

        .appendObject(new ObjectType('Sezione stoccaggio', 's3', 37))
        .newObject()
          .appendObject(new ObjectType('Impilatore', 't7', 38))
          .newObject()
            .appendObject(new ObjectType('Motore 1', 'o4', 39))
            .newObject()
              .appendSensor(DataPointType.fromTemplate(this.sCurrent, 'current', 40))
              .appendSensor(DataPointType.fromTemplate(this.sRPM, 'RPM', 41))
              .appendSensor(DataPointType.fromTemplate(this.sHours, 'h', 42))
              .getParent()
            .appendObject(new ObjectType('Motore 2', 'o5', 43))
            .newObject()
              .appendSensor(DataPointType.fromTemplate(this.sCurrent, 'current', 44))
              .appendSensor(DataPointType.fromTemplate(this.sRPM, 'RPM', 45))
              .appendSensor(DataPointType.fromTemplate(this.sHours, 'h', 46))
    ;
  }

}
