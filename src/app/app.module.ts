import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommDriverService } from './comm-driver.service';

import { HttpClientModule } from '@angular/common/http';
import { ClockService} from './clock.service';
import { SensorComponent } from './sensor/sensor.component';
import {NodeComponent} from './node/node.component';


@NgModule({
  declarations: [
    AppComponent,
    NodeComponent,
    SensorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    CommDriverService,
    ClockService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
