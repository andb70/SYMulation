import {EventEmitter, Injectable, OnDestroy, OnInit, Output} from '@angular/core';
import * as _ from 'underscore';
import {HttpClient} from '@angular/common/http';
import {Measure} from './models/Measure';
import {ClockService} from './clock.service';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class CommDriverService implements OnInit, OnDestroy {
  private _clockSubscription: Subscription;
  @Output()
  sync = new EventEmitter();

  cue = [];
  maxLength = 30;

  serverLocal = 'http://localhost:8080/api/todoitems/';

  // serverPavo = 'http://192.168.101.77:5000/api/todolist/';
  server = '';
  counter = 0;
  clockRate = 10;
  constructor(private http: HttpClient, private clockService: ClockService) {
    // this.server = this.serverPavo;
    this.server = this.serverLocal;
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
   * riceve una misura da un componente  e la accoda a cue
   * se cue supera l'altezza di soglia:
   *    copia la cue nel buffer <data>
   *    svuota cue
   *    effettua la chiamata POST(data)
   */
  newData(name, fields, tags) {
    this.cue.push(new Measure(name, fields, tags));
    console.log('new measure ' + this.cue[this.cue.length - 1].name);
    if (this.cue.length > this.maxLength) {
      let curLength = this.cue.length;
      let data = this.cue;
      this.cue = [];
      console.log('posting ' + (data.length - 1));
     /* this.http.post(this.server, data).subscribe( () => {
        console.log('posted');
      });*/
    }
  }



}
