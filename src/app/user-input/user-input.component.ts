import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ToDoItem} from '../models/to-do-item';
import {StorageService} from '../storage.service';
import {isNull} from 'util';
import {StyRepoService} from '../sty-repo.service';
import {Category} from '../models/category';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})
export class UserInputComponent {

  sTitle: string;
  sDescription: string;
  sCategory: string;
  private _lCategory: Category;
  private edited: ToDoItem = null;
  private _viewUsed = true;
  private _viewDeleted = false;

  @Output()
  newItem: EventEmitter<ToDoItem> = new EventEmitter<ToDoItem>();
  @Output()
  updateItem: EventEmitter<ToDoItem> = new EventEmitter<ToDoItem>();
  @Output()
  clearList = new EventEmitter();
  @Output()
  restoreDeleted = new EventEmitter();
  @Output()
  emptyDeleted = new EventEmitter();
  constructor(private storage: StorageService, protected categories: StyRepoService) {
    this.storage.editItem.subscribe( (http) => {
      http.subscribe( (res) => {
        this.editToDo(res);
      }, error => {
        alert('errore in http.get id: ' + error.text );
      });
    }, error => {
      alert('errore in editItem.subscribe: ' + error.text );
    });
  }

  get lCategory() {
    return this._lCategory;
  }

  set lCategory(value: Category) {
    this.sCategory = value.name;
    this._lCategory = value;
  }
  get viewUsed(): boolean {
    return this._viewUsed;
  }

  set viewUsed(value: boolean) {
    if (!value) {
      this.viewDeleted = true;
    }
    this._viewUsed = value;
  }

  get viewDeleted(): boolean {
    return this._viewDeleted;
  }

  set viewDeleted(value: boolean) {
    if (!value) {
      this.viewUsed = true;
    }
    this._viewDeleted = value;
  }

  get hasDeleted(): boolean {
    return this.storage.hasDeleted;
  }
  createToDo() {
    let item: ToDoItem = new  ToDoItem(this.storage.getNextid(), this.sTitle, this.sDescription);
    if (this.sCategory) {
      item.category = this._lCategory.name; /*this.sCategory;*/
    }
    this.storage.insert(item).subscribe( () => {
      alert('successo in http.get: '  + item.Title);
      this.newItem.emit(item);
      this.reset();
    }, error => {
      alert('errore in CreateToDo http.get: ' + error.text + ':' + item.Title);
    });
  }
  editToDo(item: ToDoItem) {
    /*  NB: stiamo memorizzando il riferimento, non i valori,
        tutto quello che facciamo lo facciamo sull'elemento contenuto
        nell'array, non in una copia locale   */
    if (this.edited) {
      alert(' elemento non salvato');
      /* TODO: form di richiesta per salvare / annullare le modifiche all'elemento in corso di modifica*/
    }
    this.edited = item;
    this.reset();
  }
  updateToDo() {
    this.edited.Title = this.sTitle;
    this.edited.Description = this.sDescription;
    this.edited.category = this._lCategory.name; /*this.sCategory;*/
    this.storage.update(this.edited);

    this.edited = null;
    this.reset();
    this.updateItem.emit(this.edited);
  }
  reset() {
    if (this.edited) {
      this.sTitle = this.edited.Title;
      this.sDescription = this.edited.Description;
      this.sCategory = this.edited.category;
    } else {
      this.sTitle = '';
      this.sDescription = '';
      this.sCategory = '';
    }
  }
  clear() {
    this.storage.clear();
    this.edited = null;
    this.reset();
    this.clearList.emit();
  }
  restore() {
    this.storage.restoreAll();
    this.restoreDeleted.emit();
  }
  empty() {
    this.storage.deleteRemoved();
    this.emptyDeleted.emit();
  }
  get isNew(): boolean {
    return isNull(this.edited);
  }
}
