import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ToDoItem} from '../models/to-do-item';
import {StorageService} from '../storage.service';
import {StyRepoService} from '../sty-repo.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent {
  @Input()
  item: ToDoItem;
  @Output()
  removeItem: EventEmitter<ToDoItem> = new EventEmitter<ToDoItem>();
  @Output()
  restoreItem: EventEmitter<ToDoItem> = new EventEmitter<ToDoItem>();
  @Output()
  editItem: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  checkItem: EventEmitter<ToDoItem> = new EventEmitter<ToDoItem>();
  constructor(private storage: StorageService, private styRepo: StyRepoService) { }

  customStyles() {
    return {'base': this.item.category === 'base',
            'ciao': this.item.category === 'ciao',
            'miao': this.item.category === 'miao',
            'bau': this.item.category === 'bau'};

  }
  categoryStyles() {
    return this.styRepo.getStylesByName(this.item.category);
    /*return {'color': 'red', 'background-color': 'grey'};*/
  }
  get isCompleted(): boolean {
    return this.item.isCompleted;
  }
  set isCompleted(value: boolean) {
    this.item.isCompleted = value;
    this.storage.update(this.item);
    this.checkItem.emit(this.item);
  }

  removeMe() {
    this.storage.remove(this.item.Id);
    this.removeItem.emit(this.item);
  }
  deleteMe() {
    this.storage.delete(this.item.Id);
    this.removeItem.emit(this.item);
  }
  restoreMe() {
    this.storage.restore(this.item.Id);
    this.restoreItem.emit(this.item);
  }

  editMe() {
    this.editItem.emit(this.item.Id);
  }


}
