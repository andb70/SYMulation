export class SensorType {

  constructor(public name: string,
              public tag: number,
              public inRange: number,
              public scaleMin: number,
              public scaleMax: number,
              public initValue: number,
              public updtRate: number,
              public updtTimeSec: number,
              public updtTHS: number
  ) { }
}
