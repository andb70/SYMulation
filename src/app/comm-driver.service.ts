import {EventEmitter, Injectable, OnDestroy, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Measure} from './models/Measure';
import {ClockService} from './clock.service';
import {Subscription} from 'rxjs/Subscription';
/*import * as _ from 'underscore';*/

@Injectable()
export class CommDriverService implements OnInit, OnDestroy {
  private _clockSubscription: Subscription;
  @Output()
  sync = new EventEmitter();

  cue = [];
  maxLength = 10;

  serverLocal = 'http://localhost:8088/api/datalog';
  serverPavo = 'http://192.168.101.26:5000/api/sensor/write';
  serverFabio = 'http://192.168.43.75:5000/api/sensor/write';
  serverFilippo = 'http://192.168.101.129:5000/mqtt/prova';

  server = '';
  counter = 9;
  clockRate = 10;
  constructor(private http: HttpClient, private clockService: ClockService) {
    let serverId = 0;
    switch (serverId) {
      case 0:
        this.server = this.serverLocal;
        break;
      case 1:
        this.server = this.serverPavo;
        break;
      case 2:
        this.server = this.serverFilippo;
        break;
    }

    this._clockSubscription = this.clockService.getClock().subscribe(() => {
      if (this.counter > this.clockRate) {
        this.counter = 0;
        this.sync.emit();
      }
      this.counter++;
    });  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this._clockSubscription.unsubscribe();
  }

  /**
   * riceve una misura da un componente e la accoda a cue
   *
   * se cue supera l'altezza di soglia:
   *    copia la cue nel buffer <data>
   *    svuota cue
   *    effettua la chiamata POST(data)
   */
  newData(name, fields, tags) {
    this.cue.push(new Measure(name, fields, tags));
    /*console.log('new measure ' + this.cue[this.cue.length - 1].name);*/
    /*console.log('new measure ' + this.cue);*/
    if (this.cue.length > this.maxLength) {
      let data = this.cue;
      this.cue = [];
      console.log('posting ' + (data.length - 1));
      /*console.log(data);*/
      this.http.post(this.server, data).subscribe( () => {
        console.log('posted 2 server');
      });
/*      this.http.post(this.serverFabio, data).subscribe( () => {
        console.log('posted 2 Pavo');
      });*/
    }
  }



}
