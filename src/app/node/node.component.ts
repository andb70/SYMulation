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
      // console.log('node_object.update' + this.object, args[0], args[1], args[2]);
      //             newData(name,    fields,  tags,    deviceName)
      this.collector.newData(args[0], args[1], args[2], args[3]);
    });
    /*if (this.object.getSensorCount()) {
      console.log('subscription: ' + this.object.name);
      this.collector.sync.subscribe(() => {
        console.log('newData: ' + this.object.name);
        this.collector.newData( this.object.measureName,
          this.object.getFields(),
          this.object.getTags([])
        );
      });
    }*/
  }

}
