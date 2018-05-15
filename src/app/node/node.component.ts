import {Component, EventEmitter, Input, Output} from '@angular/core';
import {StorageService} from '../storage.service';
import {ObjectType} from '../models/ObjectType';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent {
  @Input()
  object: ObjectType = null;

  data = [];
  lastData = [];
  constructor(private storage: StorageService) { }

  sendData(event) {
/*    for (let i = 0; i < this.sensors.length; i++) {
      if (this.sensors[i].tag == event.tag) {
        this.lastData[i] = this.data[i];
        this.data[i] = event;
      }
    }*/
    console.log(JSON.stringify(event));
  }

}
