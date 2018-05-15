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
  sensors0 = [];
  sensors1 = [];
  sensors2 = [];
  objects = [];
  constructor(private storage: StorageService) {
    this.sensors0.push(new SensorType('Temperatura1'	,
      1	,
      1023	,
      -200	,
      600	,
      20	,
      0.8	,
      0	,
      0.8
    ));
    this.sensors0.push(new SensorType('Corrente1'	,
      1	,
      1023	,
      0	,
      125	,
      0	,
      0.8	,
      0	,
      0.8
    ));
    this.sensors0.push(new SensorType('Livello1'	,
      1	,
      1023	,
      0	,
      2000	,
      823	,
      0.095	,
      0	,
      0.8
    ));


    this.sensors1.push(new SensorType('Temperatura2'	,
      1	,
      1023	,
      -200	,
      600	,
      20	,
      0.8	,
      0	,
      0.8
    ));
    this.sensors1.push(new SensorType('Corrente2'	,
      1	,
      1023	,
      0	,
      125	,
      0	,
      0.8	,
      0	,
      0.8
    ));



    this.sensors2.push(new SensorType('Temperatura3'	,
      1	,
      1023	,
      -200	,
      600	,
      20	,
      0.8	,
      0	,
      0.8
    ));
    this.sensors2.push(new SensorType('Corrente3'	,
      1	,
      1023	,
      0	,
      125	,
      0	,
      0.8	,
      0	,
      0.8
    ));
    this.sensors2.push(new SensorType('Livello3'	,
      1	,
      1023	,
      0	,
      2000	,
      823	,
      0.095	,
      0	,
      0.8
    ));

    this.objects.push(this.sensors0);
    this.objects.push(this.sensors1);
    this.objects.push(this.sensors2);
  }

}
