import {DataPointType} from './DataPointType';
import * as _ from 'underscore';

export class ObjectType {
  private parent: ObjectType = null;
  private children: ObjectType[] = [];
  private sensors: DataPointType[] = [];
  constructor(public name: string,
              public tag: number
  ) { }
  getChildren() {
    return this.children.slice(0);
  }
  getSensors() {
    return this.sensors.slice(0);
  }
  getSensorCount() {
    return this.sensors.length;
  }
  getParent(): ObjectType {
    return this.parent;
  }
  setParent(newParent: ObjectType) {
    this.parent = newParent;
    console.log('append Obj ' + this.getPath());
  }

  appendSensor(sensor: DataPointType) {
    sensor.setParent(this);
    this.sensors.push(sensor);
    return this;
  }
  appendObject(object: ObjectType) {
    object.setParent(this);
    this.children.push(object);
    return this;
  }
  newObject() {
    return this.children[this.children.length - 1];
  }
  getPath(): String {
    if (this.parent) {
      return this.parent.getPath() + '/' + this.name;
    }
    return '/' + this.name;
  }
}
