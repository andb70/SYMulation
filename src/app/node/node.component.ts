import {Component, Input, OnInit} from '@angular/core';
import {CommDriverService} from '../comm-driver.service';
import {ObjectType} from '../models/ObjectType';
import {Measure} from '../models/Measure';

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

  constructor(private collector: CommDriverService) {
  }

  ngOnInit(): void {

    let s = this.object.getSensors();
    for (let i = 0; i < s.length; i++) {
      this.data.push({fldName: s[i].fldName, value: 0, tag: s[i].tag, timestamp: Measure.getTimeStamp()});
    }
    this.lastData = this.data;
    if (s && s.length > 0) {
      // console.log('subscription: ' + this.object.name);
      this.collector.sync.subscribe(() => {
        this.collector.newData( this.object.name,
                                this.data,
                                this.object.getTags([])
                              );
      });
    }
  }

  onNewData(event) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].tag === event.tag) {
        this.lastData[i] = this.data[i];
        this.data[i] = event;
      }
    }
  }

}
