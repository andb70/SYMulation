import {DataPointType} from './DataPointType';
import {Measure} from './Measure';
import {EventEmitter, Output} from '@angular/core';
import {JUtil} from './JUtil';
// import {Settings} from '../app.module';

const ObjectUpdateInterval = 2000; // ms di attesa prima che un oggetto notifichi al broker il cambiamento dei dati

export class ObjectType {
  private _id = JUtil.getUID();
  private parent: ObjectType = null;
  private children: ObjectType[] = [];
  private sensors: DataPointType[] = [];
  private _measureName: string;
  private _topic: string;
  private _lastUpdate;
  @Output()
  update = new EventEmitter();
  @Output()
  updateMqtt = new EventEmitter();
  constructor(public name: string,
              public tagName: string,
              public tag: number
  ) {this._lastUpdate =  Measure.getTimeStamp(); }

  static deleteSpaces(topic: string): string {
    return topic.replace(/\s+/g, '').toLowerCase();
  }
  getID(): number {
    return this._id;
  }
  serialize() {
    let o = {};
    o['id'] = this._id;
    o['name'] = this.name;
    o['tagName'] = this.tagName;
    o['tag'] = this.tag;
    o['parent'] = this.parent ? this.parent.getID() : null ;
    o['measureName'] = this._measureName || null;
    o['sensors'] = [];
    o['children'] = [];
    this.sensors.forEach(child => {
      o['sensors'].push(child.serialize());
    });
    this.children.forEach(child => {
      o['children'].push(child.serialize());
    });
    return o;
  }
  onUpdate(sensor: DataPointType) {
    let now = Measure.getTimeStamp();
    if (now - sensor.lastUpdate > ObjectUpdateInterval) {
      /*console.log('ObjectType.onUpdate.update', this._measureName, this.getFields(), this.getTags([]));*/
      sensor.lastUpdate = now;
      this.update.emit([
        this._measureName,
        this.getFields(),
        this.getTags([])
      ]);
      console.log('ObjectType.onUpdate.updateMqtt', ObjectType.deleteSpaces(this._topic + this.getTopic() + sensor.fldName),
        sensor.scaledValue);
      this.updateMqtt.emit([ObjectType.deleteSpaces(this._topic + this.getTopic() + sensor.fldName),
        sensor.scaledValue]);
    }
  }
  getChildren() {
    return this.children.slice(0);
  }
  getChild(index: number) {
    return this.children.slice(0)[index];
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
    sensor.setParent(this);
    return this;
  }

  appendSensors(sensors: DataPointType[]) {
    sensors.forEach(function (s) {
      s.setParent(this);
    }, this);
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

  hasMeasure(name: string, topic: string) {
    this._measureName = name;
    this._topic = topic;
    return this;
  }

  get topic(): string {
    return this._topic;
  }

  get measureName(): string {
    return this._measureName;
  }

  getPath(): String {
    if (this.parent) {
      return this.parent.getPath() + '/' + this.name;
    }
    return '/' + this.name;
  }

  getFields() {
    let flds = [];
    for (let i = 0; i < this.sensors.length; i++) {
      flds.push({
          fldName: this.sensors[i].fldName,
          value: this.sensors[i].scaledValue/*,
          tag: this.sensors[i],
          timestamp: Measure.getTimeStamp()*/
        }
      );
    }
    return flds;
  }

  getTags(tags: any[]) {
    /*tags.push({
      tagName: 'fldname',
      value: this.name
    });*/
    tags.push({tagName: this.tagName, value: this.tag});
    if (this.getParent()) {
      return this.getParent().getTags(tags);
    }
    return tags;
  }
  getTopic(): string {
    if (this.getParent()) {
      return this.getParent().getTopic() + this.name + '/';
    }
    return ''; // this.name + '/';
  }

}
