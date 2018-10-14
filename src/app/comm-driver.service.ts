import {Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Measure} from './models/Measure';
import {ClockService} from './clock.service';
import {Clock7} from './models/Clock7';
import {MqttService} from 'ngx-mqtt';
import {Queue} from './models/Queue';

const  server = 'indirizzo_api_che_permette_il_salvataggio_e_il_recupero_della_configurazione_dell\'impianto_tramite_POST_e_GET/';

const  maxLength = 0;
@Injectable()
export class CommDriverService {
  @Output()
  queue = new Queue(maxLength);
  clock: Clock7;
  constructor(private http: HttpClient, private clockService: ClockService, private mqttService: MqttService) {
    this.clock = new Clock7();

   /* let serverLocal = 'http://localhost:5001/api/';
    let serverPavo = 'http://192.168.101.47:5000/api/sensor/';
    let serverFabio = 'http://192.168.43.75:5000/api/sensor/';
    let serverFilippo = 'http://192.168.101.129:5000/mqtt/';

    let serverId = 1;
    scanning (serverId) {
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




  newData(name, fields, tags, MqttTopic: string) {

    if (this.queue.add(new Measure(name, fields, tags), MqttTopic) ) {
      this.fireMeasure(this.queue.pull(MqttTopic), MqttTopic);
    } /*else {
      if (this.clock.isBusy()) {return; }
      this.clock.start(1000, 10000).tick.subscribe( () => {
        console.log('new measure timeout' );
        this.clock.stop7();
        if (this.queue.length > 0) {
          this.fireMeasure();
        }
      });
    }*/
  }
  fireMeasure(data: any, MqttTopic: string) {

    this.mqttService.publish( MqttTopic, JSON.stringify(data)).subscribe( () => {
      console.log('posted');
    });

  }
  queryMeasure(data: any) {

   /* console.log('query ' + (data.length - 1));
    return this.http.post('http://localhost:8088/api/ToDoItems/' , data);*/

  }

  savePlant(plant: any) {
    console.log('save plant ', server + 'saveroot');
    return this.http.post(server + 'saveroot', plant);
  }

  loadPlant() {

 /*   console.log('load plant');
    return this.http.get(this.server + 'loadroot');*/
  }


}
