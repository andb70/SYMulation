import {OnDestroy, OnInit} from '@angular/core';
import {ObjectType} from './ObjectType';
import {DataPointType, ItranseferFN} from './DataPointType';

export class MeasureGen extends ObjectType implements OnInit, OnDestroy, ItranseferFN {
  transferFN: ItranseferFN = this;
  fields: DataPointType[];

  constructor(public name: string,
              public tagName: string,
              public tag: number) {
    super(name, tagName, tag);
  }

  ngOnInit(): void {
    this.fields = new Object[this.getSensorCount()];
  }

  ngOnDestroy(): void {
  }

  update(inputs: DataPointType[]): DataPointType[] {
    return inputs;
  }

  fnUpdate() {
    this.fields = this.transferFN.update(super.getSensors());
  }


}
