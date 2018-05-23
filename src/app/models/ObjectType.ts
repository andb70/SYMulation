import {DataPointType} from './DataPointType';
import {Measure} from './Measure';
import {EventEmitter, Output} from '@angular/core';

export class ObjectType {
  private parent: ObjectType = null;
  private children: ObjectType[] = [];
  private sensors: DataPointType[] = [];
  private _measureName: string;
  private _lastUpdate;
  @Output()
  update = new EventEmitter();
  constructor(public name: string,
              public tagName: string,
              public tag: number
  ) {this._lastUpdate =  Measure.getTimeStamp(); }
  onUpdate() {
    let now = Measure.getTimeStamp();
    if (now - this._lastUpdate > 1000) {
      console.log('DataType.update');
      this._lastUpdate = now;
      this.update.emit([this._measureName, this.getFields(), this.getTags([])]);
    }
  }
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

  hasMeasure(name: string) {
    this._measureName = name;
    return this;
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
          fldname: this.sensors[i].fldName,
          value: this.sensors[i].scaledValue/*,
          tag: this.sensors[i],
          timestamp: Measure.getTimeStamp()*/
        }
      );
    }
    return flds;
  }

  getTags(tags: any[]) {
    tags.push({tagName: this.tagName, value: this.tag});
    if (this.getParent()) {
      return this.getParent().getTags(tags);
    }
    return tags;
  }
}
