import { Component } from '@angular/core';
import {SensorType} from './models/SensorType';
import {StorageService} from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  sensors = [];
  constructor(private storage: StorageService) {
    this.sensors.push(new SensorType('Temperatura1'	,
      1	,
      1023	,
      -200	,
      600	,
      20	,
      0.8	,
      0	,
      0.8
    ));
    this.sensors.push(new SensorType('Corrente'	,
      1	,
      1023	,
      0	,
      125	,
      0	,
      0.8	,
      0	,
      0.8
    ));
    this.sensors.push(new SensorType('Livello'	,
      1	,
      1023	,
      0	,
      2000	,
      823	,
      0.095	,
      0	,
      0.8
    ));
  }
  sendData(event) {
    console.log(JSON.stringify(event));
  }
}
