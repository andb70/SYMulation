import {Component, EventEmitter, Input, Output} from '@angular/core';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent {

  constructor(private storage: StorageService) { }


}
