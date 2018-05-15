import { Injectable } from '@angular/core';
import { Category } from './models/category';
import * as _ from 'underscore';

@Injectable()
export class StyRepoService {

  constructor() { }

  // accesso al local storage in lettura e scrittura tramite keyName
  keyName = 'categories';
  private readList() {
    return localStorage.getItem(this.keyName);
  }
  private storeList(categories: Category[]): void {
    localStorage.setItem(this.keyName, JSON.stringify(categories));
  }
  // elimina la chiave dal local storage
  clear(): void {
    localStorage.removeItem(this.keyName);
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
    let found = _.findIndex(list, function(i: Category) {
      return i.id === id;
    });
    return {'found': found, 'list': list};
  }
  private findByName(name: string): Result {
    let pList = this.readList();
    if (!pList) {
      // la chiave non esiste la lista restituita è vuota
      this.firstFill();
      return this.findByName(name); /* {'found': -1, 'list': [] };*/
    }
    let list = JSON.parse(pList);
    let found = _.findIndex(list, function(i: Category) {
      return i.name === name;
    });
    return {'found': found, 'list': list};
  }
  getStylesByName(name: string) {
    let result = this.findByName(name);
    if (result.found < 0) {
      return '';
    }
    let s = result.list[result.found].styles;
    let m = _.map(s, function(style) {return '"' + style.name + '":"' + style.value + '"'; } );
    let r = '{' + _.chain(m).value() + '}';
    return JSON.parse(r);
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
    let ret = _.max(list, function(item: Category) {
      return item.id;
    } );
    return ret.id + 1;
  }


  // restituisce la chiave completa in un array di ToDoItem
  getCategories(): Category[] {
    let pList = this.readList();
    if (pList) {
      return JSON.parse(pList);
    }
    // se la chiave non esiste restituiscce un array di lunghezza 0
    return [];
  }


  // aggiunge un elemento alla chiave
  insert(item: Category): void {
    // alert('inserToStorage\n' + JSON.stringify(item));
    let list = this.getCategories();
    list.push(item);
    this.storeList(list);
  }

  // aggiorna un elemento specifico solo se c'è una corrispondenza
  update(item: Category): void {
    let result = this.findById(item.id);
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

  firstFill() {
    let categories = [];
    let category = new Category(1, 'base');
    category.addStyle('background-color', 'lightgrey');
    categories.push(category);
    category = new Category(2, 'ciao');
    category.addStyle('background-color', 'darkslateblue');
    categories.push(category);
    category = new Category(3, 'miao');
    category.addStyle('background-color', 'forestgreen');
    category.addStyle('color', 'blue');
    categories.push(category);
    category = new Category(4, 'bau');
    category.addStyle('background-color', 'violet');
    categories.push(category);
    this.storeList(categories);
  }

}
interface Result {
  found: number;
  list: Category[];
}
