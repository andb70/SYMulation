import {ObjectType} from './ObjectType';

export class DataPointType {
  private parent: ObjectType = null;
  public tag: number;
  public fldName: string;
  public slope = 0.5;
  constructor(public name: string,
              public inRange: number,
              public scaleMin: number,
              public scaleMax: number,
              public initValue: number,
              public updtRate: number,
              public updtTHS: number,
              public owner?: any
  ) {
    if (this.owner) {
      if (!this.owner.plug(this)) {
        this.owner = false;
      }
    }
    return this; }

  static  fromTemplate(template: DataPointType, fldName: string, tag: number, owner?: any)  {
    let dtp =  new DataPointType(
      template.name,
      template.inRange,
      template.scaleMin,
      template.scaleMax,
      template.initValue,
      template.updtRate,
      template.updtTHS);
    dtp.tag = tag;
    dtp.fldName = fldName;

    return dtp;
  }
  getDelta() {
    return Math.floor((Math.random() - this.slope) * this.updtRate);
  }
  getParent(): ObjectType {
    return this.parent;
  }
  getIsLeaf(): boolean {
    return (!this.owner);
  }
  setParent(newParent: ObjectType) {
    this.parent = newParent;
    // console.log('append Sns ' + this.getPath());
  }
  getPath(): String {
    if (this.parent) {
      return this.parent.getPath() + '.' + this.name;
    }
    return '.' + this.name;
  }
}
