export class Category {

  constructor(public id: number, public name: string) { }
  styles: IStyle[] = [];
  addStyle(name: string, value: string) {
    this.styles.push({'name': name, 'value': value});
  }
}
export interface IStyle {
  name: string;
  value: string;
}
