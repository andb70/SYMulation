import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommDriverService} from '../comm-driver.service';
import {ObjectType} from '../models/ObjectType';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {
  @Input()
  object: ObjectType = null;

  data = [];
  lastData = [];
  constructor(private storage: CommDriverService) { }
  ngOnInit(): void {
    console.log(this.object.name + ', sensors: ' + this.object.getSensorCount());
    /*this.data = new [this.object.getSensorCount()];
    this.lastData = new [this.object.getSensorCount()];*/
    let s = this.object.getSensors();
    for (let i = 0; i < s.length; i++) {
        this.data.push({name: s[i].name, value: 0, tag: s[i].tag});
      }
      this.lastData = this.data;
  }
  onNewData(event) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].tag == event.tag) {
        this.lastData[i] = this.data[i];
        this.data[i] = event;
      }
    }

    /*console.log(event);*/
  }

}
