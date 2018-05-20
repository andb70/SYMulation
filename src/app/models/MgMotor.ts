import {ItranseferFN} from './ITransferFN';
import {DataPointType} from './DataPointType';

export class MgMotor implements ItranseferFN {
  /**
   * riceve in input, nell'ordine:
   * DataPoint Switch
   * DataPoint Current
   * DataPoint RPM
   *
   * genera in uscita un array contenete
   * DataPointType period: intervallo dall'ultima interrogazione
   * DataPointType curAbsorption: assorbimento istantaneo
   * DataPointType lastPeriodON: tempo trascorso dall'ultima interrogazione
   *                         se lo Switch è OFF è zero
   * */
  fields =  new DataPointType[3];
  lastView: number;
  constructor() {
    this.lastView = new Date().getTime();

  }
  update(inputs: DataPointType[]): DataPointType[] {
    let curView = new Date().getTime();
    this.fields[0] = curView - this.lastView;
    this.fields[1] = inputs[1];
    this.fields[2] = inputs[0] ? this.fields[0] : 0;
    this.lastView = curView;
    return this.fields;
  }

}
