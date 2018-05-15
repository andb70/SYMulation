import {EventEmitter, Injectable, Output} from '@angular/core';
import { ToDoItem } from './models/to-do-item';
import * as _ from 'underscore';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class StorageService {
  @Output()
  editItem = new EventEmitter();

  //serverLocal = 'http://localhost:8080/api/todoitems/';

  //serverPavo = 'http://192.168.101.77:5000/api/todolist/';
  server = '';
  // accesso al local storage in lettura e scrittura tramite keyName
  keyName = 'keyList';

  constructor(private http: HttpClient) {
    //this.server = this.serverPavo;
    //this.server = this.serverLocal;
  }



  newData(src,data){

  }

  // aggiunge un elemento alla chiave
  insert(item: ToDoItem) {
    // alert('insert\n' + JSON.stringify(item));
    return this.http.post(this.server, item);
  }


  // restituisce la chiave completa in un array di ToDoItem
  getToDoItems() {
    // alert('insert\n' + JSON.stringify(item));
    return this.http.get(this.server);
  }


  // restituisce la chiave completa in un array di ToDoItem
  onEditItem(id: number) {
    console.log('edit ' + this.server + id + '/');
    this.editItem.emit( this.http.get(this.server + id + '/'));
  }









  private readList() {
    return localStorage.getItem(this.keyName);
  }
  private storeList(list: ToDoItem[]): void {
    localStorage.setItem(this.keyName, JSON.stringify(list));
  }
  // elimina la chiave dal local storage
  clear(): void {
    localStorage.removeItem(this.keyName);
  }
  deleteRemoved() {
    let list = _.filter(this.getToDoItemStorage(), function(item) {
      return !item.isDeleted;
    } );
    this.storeList(list);
  }
  restoreAll() {
    let list = this.getToDoItemStorage();
    for (let i of list) {
      i.isDeleted = false;
    }
    this.storeList(list);
  }
  // cerca un Id nella lista e restituisce:
  // chiave vuota: found = -1, list = []
  // non trovato : found = -1, list = lista
  // trovato     : found = posizione, list = lista
  private findById(id: number): Result {
    let pList = this.readList();
    if (!pList) {
      // la chiave non esiste la lista restituita è vuota
      return {'found': -1, 'list': [] };
    }
    let list = JSON.parse(pList);
    let found = _.findIndex(list, function(i: ToDoItem) {
      return i.Id === id;
    });
    return {'found': found, 'list': list};
  }


  // restituisce il prossimo Id univoco utilizzabile per un nuovo elemento
  getNextid(): number {
    let pList = this.readList();
    // se la chiave non esiste il primo Id valido è 1
    if (!pList) {
      return 1;
    }
    // altrimenti cerca l'Id + alto e somma 1
    let list = JSON.parse(pList);
    let ret = _.max(list, function(item: ToDoItem) {
      return item.Id;
    } );
    return ret.Id + 1;
  }


  // restituisce la chiave completa in un array di ToDoItem
  getToDoItemStorage(): ToDoItem[] {
    let pList = this.readList();
    if (pList) {
      return JSON.parse(pList);
    }
    // se la chiave non esiste restituiscce un array di lunghezza 0
    return [];
  }


  // aggiunge un elemento alla chiave
  inserToStorage(item: ToDoItem): void {
    // alert('inserToStorage\n' + JSON.stringify(item));
    let list = this.getToDoItemStorage();
    list.push(item);
    this.storeList(list);
  }


  // aggiorna un elemento specifico solo se c'è una corrispondenza
  update(item: ToDoItem): void {
    let result = this.findById(item.Id);
    if (result.found > -1) {
      result.list[result.found] = item;
      this.storeList(result.list);
    }
  }


/* Delete and remove are defined quite similarly, but the main difference between
   them is that delete means erase (i.e. rendered nonexistent or nonrecoverable),
   while remove connotes take away and set aside (but kept in existence).
*/
  // elimina definitivamente un elemento solo se c'è una corrispondenza
  delete(id: number): void {
    let result = this.findById(id);
    if (result.found > -1) {
      result.list.splice(result.found, 1);
      this.storeList(result.list);
    }
  }
  // rimuove un elemento solo se c'è una corrispondenza
  remove(id: number): void {
    let result = this.findById(id);
    if (result.found > -1) {
      result.list[result.found].isDeleted = true;
      this.storeList(result.list);
    }
  }
  // ripristina un elemento solo se c'è una corrispondenza
  restore(id: number): void {
    let result = this.findById(id);
    if (result.found > -1) {
      result.list[result.found].isDeleted = false;
      this.storeList(result.list);
    }
  }
  get countDeleted(): number {
    let i = _.countBy(this.getToDoItemStorage(), function(item: ToDoItem) {
      return item.isDeleted ? 'deleted' : 'used';
    });
    return i.deleted;
  }
  get hasDeleted(): boolean {
    return this.countDeleted > 0;
  }
}

interface Result {
  found: number;
  list: ToDoItem[];
}
