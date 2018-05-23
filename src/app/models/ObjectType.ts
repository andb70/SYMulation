import {DataPointType} from './DataPointType';
import * as _ from 'underscore';
import {Measure} from './Measure';

export class ObjectType {
  private parent: ObjectType = null;
  private children: ObjectType[] = [];
  private sensors: DataPointType[] = [];
  constructor(public name: string,
              public tagName: string,
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
    // console.log('append Obj ' + this.getPath());
  }

  appendSensor(sensor: DataPointType) {
    this.sensors.push(sensor);
    return this;
  }

  appendSensors(sensors: DataPointType[]) {
    this.sensors = this.sensors.concat(sensors);
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
  getTags(tags: any[]) {
    tags.push({tagName: this.tagName, value: this.tag});
    if (this.getParent()) {
      return this.getParent().getTags(tags);
    }
    return tags;
  }
}
