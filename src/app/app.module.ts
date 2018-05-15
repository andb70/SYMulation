import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list-item/list-item.component';
import { FormsModule } from '@angular/forms';
import { StorageService } from './storage.service';

import { HttpClientModule } from '@angular/common/http';
import { ClockService} from './clock.service';
import { SensorComponent } from './sensor/sensor.component';
import {SensorType} from './models/SensorType';


@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ListItemComponent,
    SensorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    StorageService,
    ClockService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
