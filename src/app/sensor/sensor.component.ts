import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ClockService} from '../clock.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements OnInit, OnDestroy {

  private _clockSubscription: Subscription;

  @Input()
  nome = "sensore";
 /* @Input()
    scansione = true;*/
  @Input()
    soglia = 0.5;

  i: number;
  dato: number;

  constructor(private clockService: ClockService) { }

  ngOnInit(): void {
    this.i = 0;
    this._clockSubscription = this.clockService.getClock().subscribe(() => this.Genera());
  }

  ngOnDestroy(): void {
    this._clockSubscription.unsubscribe();
  }

  Genera(){
    this.i++;
    if(this.scansione){
      if(this.i>this.soglia){

      }
    }
    else{

    }


  }


}
