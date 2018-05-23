import {ObjectType} from './ObjectType';

export class DataPointType implements INotify {
  public tag: number;
  public slope = 0.5;
  public map: number;
  private _value: number;
  private parent: ObjectType;

  public constructor(public fldName: string,
                     public inMin: number,
                     public inMax: number,
                     public scaleMin: number,
                     public scaleMax: number,
                     public initValue: number,
                     public updtRate: number,
                     public updtTHS: number
  ) {
    this._value = DataPointType.scale(initValue, scaleMin, scaleMax, inMin, inMax);
  }

  static fromTemplate(template: DataPointType, tag: number, map?: number) {
    let dtp = new DataPointType(
      template.fldName,
      template.inMin,
      template.inMax,
      template.scaleMin,
      template.scaleMax,
      template.initValue,
      template.updtRate,
      template.updtTHS);
    dtp.tag = tag;
    dtp.map = map;
    return dtp;
  }

  static scale(x: number,
               inMin: number,
               inMax: number,
               outMin: number,
               outMax: number
  ): number {
    return (x - inMin) / (inMax - inMin)
      * (outMax - outMin) + outMin;
  }
  setParent(newParent: ObjectType) {
    this.parent = newParent;
  }
  /**
   * INotify.notify(newValue)
   *
   * utilizzato da LogicIO per passare il nuovo valore
   * al DataPoint
   *
   * */
  notify(newValue: number) {
    this._value = newValue;
    this.parent.onUpdate();
  }

  get value(): number {
    return this._value;
  }

  get scaledValue(): number {
    return DataPointType.scale(this._value,
      this.inMin,
      this.inMax,
      this.scaleMin,
      this.scaleMax);
  }
}


export interface IMap {
  map(inputs: DataPointType[], slots: number[], provider: any): DataPointType[];
}

export interface INotify {
  notify(newValue: number);
}

export interface ItranseferFN {
  update(inputs: DataPointType[]): DataPointType[];
}

export interface ILogicIO {
  value: number;
  nextValue: number;
  callback: INotify;
}

export class CLogicIO implements ILogicIO {
  callback: INotify;
  nextValue: number;
  value: number;

  private constructor() {
    this.callback = null;
  }

  static create(count: number) {
    let a = [];
    for (let i = 0; i < count; i++) {
      a.push(new CLogicIO());
    }
    return a;
  }
}
