export class Measure {

  constructor(public name: String, public fields: number[], public tags: number[]) {
    this.creationDate = new Date();
  }
  creationDate: Date;


}
