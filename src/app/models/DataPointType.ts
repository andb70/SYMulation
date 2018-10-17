import {ObjectType} from './ObjectType';
import {JUtil} from './JUtil';

/**
 * function block di mappatura e scalatura di un ingresso fisico
 *
 * il DataPoint si appoggia su un ingresso logico di tipo CLogicIO
 * e il cui indice è <map> che simula un ingresso fisico: analogico o fld seriale
 *
 * nel momento in cui il DataPoint viene arruolato da un oggetto come sensore
 * l'oggetto proprietario esegue il mapping del sensore all'ingresso logico,
 * creando una corrispondenza tra il DataPoint e il CLoggicIO con indice = map,
 * questo, in SIMULAZIONE  consente all'oggetto proprietaro del sensore di aggiornarne
 * il valore (motore > sensore RPM), e.g:
 *    il motore aumenta la velocità e deve aggiornare il valore contenuto dal
 *    CLogicIO in modo che di conseguenza aumenti anche la lettura del DataPoint
 *
 * sia CLogicIO implementano l'interfaccia INotify che permette di passare il nuovo valore:
 * quando IO.service esegue il task ciclico di lettura
 * 1. _________________
 *  emette l'evento updateIO
 *  che viene ricevuto da tutti i COMPONENTI che richiamano updateParam dei loro oggetti
 *  di configurazione (e.g. di tipo  MotorClass, che arruola il sensore rRPM di tipo DataPoint)
 * da updateParam l'oggetto proprietario prepara tutti i nuovi valori degli ingressi logici
 * e li notifica ad IOs.service mediante una chaimata simile alla seguente:
 *    this.IOs.nextValue( this.sLiquidFlow.map, this.param.LiquidFlow);
 * 2. _________________
 *  notifica i cambiamenti a tutti i DataPoint mappati con una chiamata simile;
 *    IOs[map].callback.notify(IOs[map].value);
 *
 */
export class DataPointType implements INotify {
  private _id = JUtil.getUID();
  public tag: number;
  public map: number; // indice del LogicIO a cui appoggiare il valore
  private _value: number;
  private _valueOld: number;
  private parent: ObjectType;
  public lastUpdate = 0;
   public constructor(public fldName: string,
                     public inMin: number,
                     public inMax: number,
                     public scaleMin: number,
                     public scaleMax: number,
                     public initValue: number,
                     public updtRate: number,
                     public updtTHS: number,
                     public unit: string
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
      template.updtTHS,
      template.unit);
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
      let result = (x - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
      result = result < outMin ? outMin : result;
      result = result > outMax ? outMax : result;
      return result;
  }

  getID(): number {
    return this._id;
  }
  serialize() {
    let o = new Object();
    o['id'] = this._id;
    o['tag'] = this.tag;
    o['map'] = this.map;
    o['value'] = this._value;
    o['parent'] = this.parent.getID();
    o['fldName'] = this.fldName;
    o['inMin'] = this.inMin;
    o['inMax'] = this.inMax;
    o['scaleMin'] = this.scaleMin;
    o['scaleMax'] = this.scaleMax;
    o['initValue'] = this.initValue;
    o['updtRate'] = this.updtRate;
    o['updtTHS'] = this.updtTHS;
    return o;
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
    this._valueOld = this._value;
    this._value = newValue;
    // console.log('DataType.notify', this.fldName, newValue);
    this.parent.onUpdate(this);
  }

  get value(): number {
    return this._value;
  }

  get increment(): number {
    return this._value - this._valueOld ;
  }
  scaleToInput(newValue: number): number {
    return DataPointType.scale(newValue,
      this.scaleMin,
      this.scaleMax,
      this.inMin,
      this.inMax);
  }
  scaleToOutput(newValue: number): number {
    return DataPointType.scale(newValue,
      this.inMin,
      this.inMax,
      this.scaleMin,
      this.scaleMax);
  }
  get scaledValue(): number {
    return DataPointType.scale(this._value,
      this.inMin,
      this.inMax,
      this.scaleMin,
      this.scaleMax);
  }
  get scaledIncrement(): number {
    return DataPointType.scale(this.increment,
      this.inMin,
      this.inMax,
      this.scaleMin,
      this.scaleMax);
  }

  get percentValue(): number {
    return DataPointType.scale(this._value,
      this.inMin,
      this.inMax,
      0,
      1);
  }
}


export interface INotify {
  notify(newValue: number);
}

export interface ILogicIO {
  value: number;
  nextValue: number;
  callback: INotify;
  cycles: number;
}

export class CLogicIO implements ILogicIO {
  callback: INotify;
  nextValue = 0;
  value = 0;
  cycles = 0;

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
