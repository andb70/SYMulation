import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ToDoItem} from '../models/to-do-item';
import {StorageService} from '../storage.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  list: ToDoItem[] = [];
  @Input()
  viewUsed = true;
  @Input()
  viewDeleted = false;
  @Output()
  editToDo: EventEmitter<ToDoItem> = new EventEmitter<ToDoItem>();

  constructor(private storage: StorageService) {
    this.refresh();
  }

  get visibleList() {
    return this.list;
    /*
    if (this.list) {
      return _.filter(this.list, function (item) {
        return (this.viewUsed && !item.isDeleted) || (this.viewDeleted && item.isDeleted);
      }, {'viewUsed': this.viewUsed, 'viewDeleted': this.viewDeleted});
    }*/
  }

  refresh() {
     this.storage.getToDoItems().subscribe( (res) => {
       console.log('successo in http.get: ' + JSON.stringify(res));
       this.list = res as ToDoItem[];
     }, error => {
       console.log('errore in http.get: ' + error.text );
       this.list = this.storage.getToDoItemStorage();
     });
  }

  editItem(Id: number) {
    console.log('onEditItem(' + Id + ')');
    this.storage.onEditItem(Id);
  }
}
