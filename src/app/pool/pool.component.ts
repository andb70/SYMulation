import {Component, Input, OnInit} from '@angular/core';
import {LogicIOService} from '../logic-io.service';
import {PoolClass} from '../models/Pool1Class';
import {DataPointType} from '../models/DataPointType';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css']
})
export class PoolComponent implements OnInit {
  @Input()
  config: PoolClass;
  @Input()
  sRPM: DataPointType;

  constructor(private IOs: LogicIOService) {
    this.IOs.updateIO.subscribe( t => {
      // console.log('pool update');
      this.config.updateParam(this.sRPM);
    });
  }

  ngOnInit(): void { }

  poolSwitch() {
    console.log('pool switch ' + this.config.name);
    this.config.poolSwitch();
  }

  get liquidInput(): number {
    return this.config.liquidFlowIN;
  }
  get liquidInCount(): number {
    return this.config.liquidFlowTotal;
  }
  get liquidOutput(): number {
     return this.config.liquidFlowOUT;
  }
  get liquidLevel(): number {
    return this.config.getsLiquidLevel().scaledValue;
  }
  get actualTemperature(): number {
    return this.config.getsTemperature().scaledValue;
  }




}
