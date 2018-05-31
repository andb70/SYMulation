// To parse this data:
//
//   import { Convert, Welcome } from "./file";
//
//   const welcome = Convert.toWelcome(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Result {
  measurement: string;
  result:      Result[];
}

export interface Result {
  fields:    Field[];
  tags:      Tag[];
  timestamp: number;
}

export interface Field {
  Hours: number;
}

export interface Tag {
  device?:  number;
  unit?:    number;
  section?: number;
  plant?:   number;
}
