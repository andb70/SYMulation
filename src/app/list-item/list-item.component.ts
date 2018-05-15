import {Component, EventEmitter, Input, Output} from '@angular/core';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent {
  @Input()
  sensors = [];

  data = [];
  lastData = [];
  constructor(private storage: StorageService) { }

  sendData(event) {
    for (let i = 0; i < this.sensors.length; i++) {
      if (this.sensors[i].tag == event.tag) {
        this.lastData[i] = this.data[i];
        this.data[i] = event;
      }
    }
    console.log(JSON.stringify(event));
  }

}
