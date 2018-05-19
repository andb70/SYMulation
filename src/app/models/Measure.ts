/**
 * restituisce un oggetto nella seguente forma:
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
 * */
export class Measure {

  constructor(public measurement: String, public fields: any, public tags: any, public timestamp?: number) {
    if (!this.timestamp) {
      this.timestamp = Measure.getTimeStamp();
    }
  }

  /**
   * Formatta una misura secondo lo standard Influx e accoda all'array delle misure
   *
   * let measure = new Object();
   * measure['Measure'] = Measure.build(name, fields, tags);
   * this.cue.push(measure);
   *
   * */
/*  public static build(measurement: String, fields: any[], tags: any[]) {
    let oFlds = new Object();
    let oTags = new Object();
    let time = Measure.getTimeStamp();

    fields.forEach(function (f) {
      oFlds[f.fldName] = f.value;
    });

    tags.forEach(function (t) {
      oTags[t.tagName] = t.value;
    });

    return new Measure(measurement, oFlds, oTags, time);
  }*/
  /**
   * restituisce il TimeStamp del momento attuale
   *
   * */
  public static getTimeStamp(): number {
    return new Date().getTime();
  }
}
