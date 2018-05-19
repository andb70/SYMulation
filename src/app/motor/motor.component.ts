import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {MotorClass, switchState} from '../models/MotorClass';
import {Subscription} from 'rxjs/Subscription';
import {ClockService} from '../clock.service';

@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.css']
})
export class MotorComponent implements OnInit, OnDestroy {
  private _clockSubscription: Subscription;
  private ticks = 0;
  @Input()
  config: MotorClass;
  private _speed = 0;
  private _stress = 0;
  @Input()
  state = switchState.OFF;

  constructor(private clockService: ClockService) { }

  ngOnInit(): void {
    /**
     * Ad ogni tick del clock valuta se aggiornare il dato e calcola
     * il delta in modo casuale
     * */
    this._clockSubscription = this.clockService.getClock().subscribe(() => {
      if (this.ticks > this.config.refreshInterval) {
        this.config.updateParam();
        this.ticks = 0;
      }
      this.ticks++;
    });
  }

  ngOnDestroy(): void {
    if (this._clockSubscription) {
      this._clockSubscription.unsubscribe();
      this._clockSubscription = null;
    }
  }
  motorSwitch() {
    console.log('motor switch ' + this.config.name);
    this.config.motorSwitch();
  }
  stressValues() {
    return [0, 1, 2, 3];
  }
  get stress(): number {
    return this._stress;
  }
  set stress(value: number) {
    this._stress = value;
    console.log('stress ' + this.config.name + ': ' + this.stress);
  }

  get speed(): number {
    return this._speed;
  }
  set speed(value: number) {
    this._speed = value;
    console.log('speed ' + this.config.name + ': ' + this.speed);
  }
  set targetSpeed(RPM: number) {
    this.config.targetSpeed = RPM;
  }
  get targetSpeed(): number {
    return this.config.targetSpeed;
  }
}
