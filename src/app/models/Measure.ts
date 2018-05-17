import {Timestamp} from 'rxjs/operators/timestamp';

export class Measure {
  timestamp: number;
  constructor(public measurement: String, public fields: any[], public tags: any[]) {
    /**
     * TODO: sistemare i fields e i tags
     *
     * attualmente l'eggeto restutuito è nella seguente forma:
     * {
     *  "measurement":"Prelavaggio",
     *  "fields":
     *    [
     *      {"fldName":"liqflow","value":0,"tag":8,"timestamp":1526567763084},
     *      {"fldName":"temp","value":0,"tag":9,"timestamp":1526567763084},
     *      {"fldName":"liqLevel","value":220.17693185330756,"tag":10,"timestamp":1526567770004}
     *    ],
     *  "tags":
     *    [
     *      {"tagName":"t1","value":3},
     *      {"tagName":"s1","value":2},
     *      {"tagName":"plant1","value":1}
     *    ],
     *  "timestamp":1526567775015
     * }
     *
     *  TODO: usare la seguente forma:
     *
     *  {
     *   measurement: 'tide',
     *   tags: {
     *     unit: locationObj.rawtide.tideInfo[0].units,
     *     location: locationObj.rawtide.tideInfo[0].tideSite,
     *   },
     *   fields: { height: tidePoint.height },
     *   timestamp: tidePoint.epoch,
     * }
     *
     * */
    this.timestamp = Measure.getTimeStamp();
  }

  public static objfy(name: string, value: any) {
    // '{ "name":"John", "age":30, "city":"New York"}'
    return JSON.parse('{ "' + name + '":"' + value + '"}');
  }

  public static fldfy(data: any) {
    let flds = [];
    data.forEach(function (d) {
      flds.push(Measure.objfy(d.fldname, d.value));
    });
    return flds;
  }

  /* public static build()*/
  public static getTimeStamp(): number {
    return new Date().getTime();
  }
}
