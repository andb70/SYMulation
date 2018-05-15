import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-its-select',
  templateUrl: './its-select.component.html',
  styleUrls: ['./its-select.component.css']
})
export class ItsSelectComponent implements OnInit {
  list: string[];
  selectedValue: string;
  styles: ITSStyle[];
  selectedStyle : ITSStyle;
  constructor() {
    this.list = ['1', '2', '3', '4'];
    this.selectedValue = this.list[0];

    this.styles = [
      new ITSStyle(1, 'style 1', 'pnlGreen'),
      new ITSStyle(2, 'style 2', 'pnlBlue'),
      new ITSStyle(3, 'style 3'),
    ];
    this.selectedStyle = this.styles[0];
  }

  ngOnInit() {
  }
  showValue() {
    alert (this.selectedValue);
  }
  showStyle() {
    alert (this.selectedStyle);
  }
}

class ITSStyle {
  constructor (public id: number,
               public description: string,
               public cssClass: string = 'pnlRed') {
      }

}
