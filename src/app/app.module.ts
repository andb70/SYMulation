import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatCardModule, MatInputModule, MatSelectModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';

import { CommDriverService } from './comm-driver.service';
import { ClockService} from './clock.service';
import { LogicIOService} from './logic-io.service';
import { SensorComponent } from './sensor/sensor.component';
import { NodeComponent} from './node/node.component';
import { MotorComponent } from './motor/motor.component';
import { PoolComponent } from './pool/pool.component';
import { Pool1Component } from './pool1/pool1.component';
import { Pool2Component } from './pool2/pool2.component';


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
    PoolComponent,
    Pool1Component,
    Pool2Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
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
