import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CommDriverService } from './comm-driver.service';
import { ClockService} from './clock.service';
import { LogicIOService} from './logic-io.service';
import { SensorComponent } from './sensor/sensor.component';
import { NodeComponent} from './node/node.component';
import { MotorComponent } from './motor/motor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';
import { PoolComponent } from './pool/pool.component';


// todo: implementare l'utilizzo del file json per la configurazione della connessione
// export let Settings = require('./../assets/config.json');

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  // hostname: 'localhost',
  hostname: '7technode.ddns.net',
  port: 3000,
  path: '',
  username: 'admin',
  password: 'secret',
  clientId: 'GeneratoreDati Datalogger', // 'Dashboard angular'
  protocol: 'ws'
};

@NgModule({
  declarations: [
    AppComponent,
    NodeComponent,
    SensorComponent,
    MotorComponent,
    PoolComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  providers: [
    CommDriverService,
    LogicIOService,
    ClockService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
