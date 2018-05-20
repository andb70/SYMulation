import {OnDestroy, OnInit} from '@angular/core';
import {ObjectType} from './ObjectType';
import {ItranseferFN} from './ITransferFN';
import {DataPointType} from './DataPointType';

export class MeasureGen extends ObjectType implements OnInit, OnDestroy, ItranseferFN {
  transferFN: ItranseferFN = this;
  fields: object[];
  constructor() { }

  ngOnInit(): void {
    fields = new Object[this.getSensorCount()];
  }

  ngOnDestroy(): void { }

  update(inputs: DataPointType[]): DataPointType[] {
    return inputs;
}

  fnUpdate() {
    this.fields = this.transferFN.update(this.getInputs());
  }



}
