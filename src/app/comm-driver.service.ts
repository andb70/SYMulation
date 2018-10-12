import {Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Measure} from './models/Measure';
import {ClockService} from './clock.service';
import {Clock7} from './models/Clock7';
import {MqttService} from 'ngx-mqtt';

const MqttTopic = 'SYMulation/DataLogger/sensori';
@Injectable()
export class CommDriverService {
  @Output()

  queue = [];
  maxLength = 0;

  server = 'indirizzo_api_che_permette_il_salvataggio_e_il_recupero_della_configurazione_dell\'impianto_tramite_POST_e_GET/';

  clock: Clock7;
  constructor(private http: HttpClient, private clockService: ClockService, private mqttService: MqttService) {
    this.clock = new Clock7();

   /* let serverLocal = 'http://localhost:5001/api/';
    let serverPavo = 'http://192.168.101.47:5000/api/sensor/';
    let serverFabio = 'http://192.168.43.75:5000/api/sensor/';
    let serverFilippo = 'http://192.168.101.129:5000/mqtt/';

    let serverId = 1;
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
    }*/


  }

  /**
   * riceve una misura da un componente e la accoda a queue
   *
   * se queue supera l'altezza di soglia:
   *    copia la queue nel buffer <data>
   *    svuota queue
   *    effettua la chiamata POST(data)
   */




  newData(name, fields, tags, deviceName) {
/*    if (!this.server) {
      return;
    }*/
    this.queue.push(new Measure(name, fields, tags, deviceName));
    /*console.log('new measure ' + this.queue[this.queue.length - 1].name);*/
    /*console.log('new measure ' + this.queue);*/
    if (this.queue.length > this.maxLength) {
      this.fireMeasure();
    } else {
      if (this.clock.isBusy()) {return; }
      this.clock.start(1000, 10000).tick.subscribe( () => {
        console.log('new measure timeout' );
        this.clock.stop7();
        if (this.queue.length > 0) {
          this.fireMeasure();
        }
      });
    }
  }
  fireMeasure() {
    let data = this.queue;
    this.queue = [];
    // console.log('posting ' + (data.length - 1), data);
   /* this.http.post(this.server + 'datalog', data).subscribe( () => {
      console.log('posted');
    });*/

    this.mqttService.publish( MqttTopic, JSON.stringify(data)).subscribe( () => {
      console.log('posted');
    });

  }
  queryMeasure(data: any) {

   /* console.log('query ' + (data.length - 1));
    return this.http.post('http://localhost:8088/api/ToDoItems/' , data);*/

  }

  savePlant(plant: any) {
    console.log('save plant ', this.server + 'saveroot');
    return this.http.post(this.server + 'saveroot', plant);
  }

  loadPlant() {

 /*   console.log('load plant');
    return this.http.get(this.server + 'loadroot');*/
  }


}
