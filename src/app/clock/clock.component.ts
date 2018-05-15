import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ClockService} from '../clock.service';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit, OnDestroy {

  private _clockSubscription: Subscription;
  time: Date;

  i:number;


  constructor(private clockService: ClockService) { }

  ngOnInit(): void {
    this.i=0;
    this._clockSubscription = this.clockService.getClock().subscribe(() => this.i++);
  }

  ngOnDestroy(): void {
    this._clockSubscription.unsubscribe();
  }

}
