import {Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Measure, MqttPacket} from './models/Measure';
import {ClockService} from './clock.service';
import {Clock7} from './models/Clock7';
import {MqttService} from 'ngx-mqtt';
import {Queue} from './models/Queue';

const  server = 'indirizzo_api_che_permette_il_salvataggio_e_il_recupero_della_configurazione_dell\'impianto_tramite_POST_e_GET/';

const  maxLength = 4;
@Injectable()
export class CommDriverService {
  @Output()
  queue = new Queue(maxLength);
  clock: Clock7;
  constructor(private http: HttpClient, private clockService: ClockService, private mqttService: MqttService) {
    this.clock = new Clock7();

   /* let serverLocal = 'http://localhost:5001/api/'; */



  }

  /**
   * riceve una misura da un componente e la accoda a queue
   *
   * se queue supera l'altezza di soglia:
   *    copia la queue nel buffer <data>
   *    svuota queue
   *    effettua la chiamata POST(data)
   */




  newDataMqtt(MqttTopic: string, value: number) {
    // console.log('newDataMqtt', MqttTopic, value);
    if (this.queue.add(new MqttPacket(value), MqttTopic) ) {
      this.fireMeasure(this.queue.pull(MqttTopic), MqttTopic);
    }
  }
  newData(name, fields, tags) {
    const MqttTopicInflux = 'SYMulation/DataLogger/sensori';

    if (this.queue.add(new Measure(name, fields, tags), MqttTopicInflux) ) {
      this.fireMeasure(this.queue.pull(MqttTopicInflux), MqttTopicInflux);
    }
  }
  fireMeasure(data: any, MqttTopic: string) {
    console.log('fire measure', MqttTopic, data);
    this.mqttService.publish( MqttTopic, JSON.stringify(data)).subscribe( () => {
      console.log('fired');
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
