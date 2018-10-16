import {Component, Input, OnInit} from '@angular/core';
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

  constructor(private collector: CommDriverService) { }

  ngOnInit(): void {
    /**
     * se l'oggetto contiene sensori sottoscrive object.update
     * dove arrivano e notifiche di cambiamento dei dati di input
     * dei sensori
     * di conseguenza le notifiche vengono inviate al driver di comunicazione
     * per essere trattate
     * */
    this.object.update.subscribe((args) => {
      console.log(this.object.name + 'update.subscribe', args);
      //             newData(name,    fields,  tags,    topic)
      this.collector.newData(args[0], args[1], args[2]);
    });
    this.object.updateMqtt.subscribe((args) => {
      console.log(this.object.name + 'updateMqtt.subscribe', args);
      //                         topic,   value
      this.collector.newDataMqtt(args[0], args[1]);
    });
  }

}
