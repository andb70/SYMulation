import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Measure} from './models/Measure';
import {ClockService} from './clock.service';
import {Clock7} from './models/Clock7';

@Injectable()
export class CommDriverService {
  @Output()
  /*sync = new EventEmitter();*/

  cue = [];
  maxLength = 10;

  server: string;

  clock: Clock7;
  constructor(private http: HttpClient, private clockService: ClockService) {
    this.clock = new Clock7();
    let serverLocal = 'http://localhost:5001/api/';
    let serverPavo = 'http://192.168.101.47:5000/api/sensor/';
    let serverFabio = 'http://192.168.43.75:5000/api/sensor/';
    let serverFilippo = 'http://192.168.101.129:5000/mqtt/';

    let serverId = 0;
    switch (serverId) {
      case 0:
        this.server = serverLocal;
        break;
      case 1:
        this.server = serverPavo;
        break;
      case 2:
        this.server = serverFabio;
        break;
      case 3:
        this.server = serverFilippo;
        break;
      default:
        this.server = null;
    }

/*    this.clock = new Clock7();
    this.clock.start(0, 1000).tick.subscribe( () => {
      /!*console.log('tick');*!/
      this.sync.emit();
    });*/

  }

  /**
   * riceve una misura da un componente e la accoda a cue
   *
   * se cue supera l'altezza di soglia:
   *    copia la cue nel buffer <data>
   *    svuota cue
   *    effettua la chiamata POST(data)
   */
  newData(name, fields, tags) {
    if (!this.server) {
      return;
    }
    this.cue.push(new Measure(name, fields, tags));
    /*console.log('new measure ' + this.cue[this.cue.length - 1].name);*/
    /*console.log('new measure ' + this.cue);*/
    if (this.cue.length > this.maxLength) {
      this.fireMeasure();
    } else {
      if (this.clock.isBusy()) {return; }
      this.clock.start(1000, 10000).tick.subscribe( () => {
        console.log('new measure timeout' );
        this.clock.stop7();
        if (this.cue.length > 0) {
          this.fireMeasure();
        }
      });
    }
  }
  fireMeasure() {
    let data = this.cue;
    this.cue = [];
    console.log('posting ' + (data.length - 1));
    this.http.post(this.server + 'datalog', data).subscribe( () => {
      console.log('posted');
    });

  }
  queryMeasure(data: any) {

    console.log('query ' + (data.length - 1));
    return this.http.post('http://localhost:8088/api/ToDoItems/' , data);

  }

  savePlant(plant: any) {

    console.log('save plant ', 'http://localhost:8088/api/ToDoItems/' + 'saveroot');
    return this.http.post('http://localhost:8088/api/ToDoItems/' + 'saveroot', plant);
  }

  loadPlant() {

    console.log('load plant');
    return this.http.get(this.server + 'loadroot');
  }


}
