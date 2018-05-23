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


@NgModule({
  declarations: [
    AppComponent,
    NodeComponent,
    SensorComponent,
    MotorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    CommDriverService,
    LogicIOService,
    ClockService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
