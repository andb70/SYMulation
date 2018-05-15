import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list-item/list-item.component';
import { UserInputComponent } from './user-input/user-input.component';
import { FormsModule } from '@angular/forms';
import { StorageService } from './storage.service';
import { StyRepoService } from './sty-repo.service';
import { CategorySelectorComponent } from './category-selector/category-selector.component';
import { ItsSelectComponent } from './its-select/its-select.component';
import { HttpClientModule } from '@angular/common/http';
import { ClockComponent } from './clock/clock.component';
import {ClockService} from "./clock.service";
import { SensorComponent } from './sensor/sensor.component';


@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ListItemComponent,
    UserInputComponent,
    CategorySelectorComponent,
    ItsSelectComponent,
    ClockComponent,
    SensorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    StorageService,
    StyRepoService,
    ClockService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
