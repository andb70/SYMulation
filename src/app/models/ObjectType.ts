import {SensorType} from './SensorType';

export class ObjectType {

  constructor(public name: string,
              public tag: number
  ) { }
  objects: ObjectType[] = [];
  sensors: SensorType[] = [];

  appendSensor(sensor: SensorType) {
    this.sensors.push(sensor);
  }
  appendObject(object: ObjectType) {
    this.objects.push(object);
  }
}
