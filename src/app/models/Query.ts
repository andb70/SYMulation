import {Measure} from './Measure';

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
 *  "type":1526567775015
 * }
 *
 * */
export class Query {
  public fields: FieldType[];
  public tags: TagType[];
  private readonly _type: QueryType;
  constructor(public measurement: string, type: string) {
    this.fields = [];
    this.tags = [];
    this._type = new QueryType(type);
  }
  public get type(): QueryType {
    return this._type;
  }
  public addField(fldName: string) {
    let f = new FieldType(fldName);
    this.fields.push(f);
  }
  public get path(): string {
    let p = '';
    this.tags.forEach(t => {
      p = '/' + t.tagName + '/' + t.value + p;
    });
    return p;
  }
}

export class FieldType {
  constructor(
    public fldName: string) {
  }
}

export class TagType {
  constructor(
    public tagName: string,
    public value: number) {
  }
}

export class QueryType {
  constructor(public name: string) { }
  public addParam(paramName: string, value: any) {
    this[paramName] = value;
  }
}


/*
usato nel modo seguente:
    let query = new Query('ElMotor');
    query.addField('campo');

    console.log(this.root.getChild(0).getChild(0).getChild(0).name);
    query.tags = this.root.getChild(0).getChild(0).getChild(0).getTags([]);
    query.type.name = 'avg';
    query.type.addParam( 'startDate',  Measure.getTimeStamp() - 10000);
    query.type.addParam( 'endDate',  Measure.getTimeStamp());

    let query2 = new Query('ElMotor');
    query2.addField('Hours');
    console.log(this.root.getChild(0).getChild(0).getChild(0).name);
    query2.tags = this.root.getChild(0).getChild(0).getChild(0).getTags([]);
    query2.type.name = 'last';




export class Query {
  public fields: FieldType[];
  public tags: TagType[];
  public type: QueryType;
  constructor(public measurement: String) {
    this.fields = [];
    this.tags = [];
    this.type = new QueryType();
  }
  public addField(fldName: string) {
    let f = new FieldType(fldName);
    this.fields.push(f);
  }
}

export class FieldType {
  constructor(
    public fldName: string) {
  }
}

export class TagType {
  constructor(
    public tagName: string,
    public value: number) {
  }
}

export class QueryType {
  public parameters: ParamType[];
  public name: string;
  constructor(
) {
    this.parameters = [];
  }
  public addParam(paramName: string, value: any) {
    let f = new ParamType(paramName, value);
    this.parameters.push(f);
  }

}

export class ParamType {
  constructor(
    public paramName: string,
    public value: any) {
  }
}

 */
