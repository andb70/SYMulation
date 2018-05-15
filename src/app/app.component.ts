import { Component } from '@angular/core';
import {DataPointType} from './models/DataPointType';
import {StorageService} from './storage.service';
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
  sRPM =new DataPointType('rpm'	,
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
  constructor(private storage: StorageService) {

    this.root = new ObjectType('root', 1);
    this.root
      .appendObject(new ObjectType('Sezione lavaggio', 2))
      .newObject()
        .appendObject(new ObjectType('Prelavaggio', 3))
        .newObject()
          .appendObject(new ObjectType('Pompa 1', 4))
          .newObject()
            .appendSensor(DataPointType.fromTemplate(this.sCurrent, 5))
            .appendSensor(DataPointType.fromTemplate(this.sRPM, 6))
            .appendSensor(DataPointType.fromTemplate(this.sHours, 7))
            .getParent()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidFlow, 8))
          .appendSensor(DataPointType.fromTemplate(this.sTemperature, 9))
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 10))
          .getParent()
        .getParent()
      .newObject()
        .appendObject(new ObjectType('Lavaggio', 11))
        .newObject()
          .appendObject(new ObjectType('Pompa 2', 12))
          .newObject()
            .appendSensor(DataPointType.fromTemplate(this.sCurrent, 13))
            .appendSensor(DataPointType.fromTemplate(this.sRPM, 14))
            .appendSensor(DataPointType.fromTemplate(this.sHours, 15))
            .getParent()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidFlow, 16))
          .appendSensor(DataPointType.fromTemplate(this.sTemperature, 17))
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 18))
          .getParent()
        .getParent()
      .newObject()
        .appendObject(new ObjectType('Asciugatura', 19))
        .newObject()
          .appendObject(new ObjectType('Ventilatore', 20))
          .newObject()
            .appendSensor(DataPointType.fromTemplate(this.sCurrent, 21))
            .appendSensor(DataPointType.fromTemplate(this.sRPM, 22))
            .appendSensor(DataPointType.fromTemplate(this.sHours, 23))
            .getParent()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidFlow, 24))
          .appendSensor(DataPointType.fromTemplate(this.sTemperature, 25))
          .appendSensor(DataPointType.fromTemplate(this.sRH, 26))
          .getParent()
        .getParent()

      .appendObject(new ObjectType('Sezione pretrattamento', 27))
      .newObject()
        .appendObject(new ObjectType('Vasca pre trattamento', 28))
        .newObject()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 29))
          .appendSensor(DataPointType.fromTemplate(this.spH, 30))
          .getParent()
        .appendObject(new ObjectType('Vasca primer', 31))
        .newObject()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 32))
          .appendSensor(DataPointType.fromTemplate(this.spH, 33))
          .getParent()
        .appendObject(new ObjectType('Vasca finisher', 34))
        .newObject()
          .appendSensor(DataPointType.fromTemplate(this.sLiquidLevel, 35))
          .appendSensor(DataPointType.fromTemplate(this.spH, 36))
          .getParent().getParent()

        .appendObject(new ObjectType('Sezione stoccaggio', 37))
        .newObject()
          .appendObject(new ObjectType('Impilatore', 38))
          .newObject()
            .appendObject(new ObjectType('Motore 1', 39))
            .newObject()
              .appendSensor(DataPointType.fromTemplate(this.sCurrent, 40))
              .appendSensor(DataPointType.fromTemplate(this.sRPM, 41))
              .appendSensor(DataPointType.fromTemplate(this.sHours, 42))
              .getParent()
            .appendObject(new ObjectType('Motore 2', 43))
            .newObject()
              .appendSensor(DataPointType.fromTemplate(this.sCurrent, 44))
              .appendSensor(DataPointType.fromTemplate(this.sRPM, 45))
              .appendSensor(DataPointType.fromTemplate(this.sHours, 46))
    ;
  }

}
