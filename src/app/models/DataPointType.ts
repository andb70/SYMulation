import {ObjectType} from './ObjectType';

export class DataPointType {
  private parent: ObjectType = null;
  tag: number;
  constructor(public name: string,
              public inRange: number,
              public scaleMin: number,
              public scaleMax: number,
              public initValue: number,
              public updtRate: number,
              public updtTHS: number
  ) {return this; }

  static  fromTemplate(template: DataPointType, tag: number)  {
    let dtp =  new DataPointType(
      template.name,
      template.inRange,
      template.scaleMin,
      template.scaleMax,
      template.initValue,
      template.updtRate,
      template.updtTHS);
    dtp.tag = tag;
    return dtp;
  }

  getParent(): ObjectType {
    return this.parent;
  }
  setParent(newParent: ObjectType) {
    this.parent = newParent;
    console.log('append Sns ' + this.getPath());
  }
  getPath(): String {
    if (this.parent) {
      return this.parent.getPath() + '.' + this.name;
    }
    return '.' + this.name;
  }
}
