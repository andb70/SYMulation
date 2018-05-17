import {EventEmitter, Injectable, Output} from '@angular/core';
import * as _ from 'underscore';
import {HttpClient} from '@angular/common/http';
import {Measure} from './models/Measure';

@Injectable()
export class CommDriverService {
 /* @Output()*/
  cue = [];
  maxLength = 1;

  serverLocal = 'http://localhost:8080/api/todoitems/';

  // serverPavo = 'http://192.168.101.77:5000/api/todolist/';
  server = '';
  // accesso al local storage in lettura e scrittura tramite keyName

  constructor(private http: HttpClient) {
    // this.server = this.serverPavo;
    this.server = this.serverLocal;
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
    if (this.cue.length > this.maxLength) {
      let curLength = this.cue.length;
      let data = this.cue
      this.cue = [];

      this.http.post(this.server, data).subscribe( () => {
        console.log('posted');
      });
    }
  }

  // aggiunge un elemento alla chiave
  insert(item) {
    // alert('insert\n' + JSON.stringify(item));
    return this.http.post(this.server, item);
  }



}
