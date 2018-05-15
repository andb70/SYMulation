import {Component } from '@angular/core';
import {StorageService} from '../storage.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {

  constructor(private storage: StorageService) {
  }

}
