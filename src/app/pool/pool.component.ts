import {Component, Input} from '@angular/core';
import {LogicIOService} from '../logic-io.service';
import {DeviceClass} from '../models/DeviceClass';
import {DataPointType} from '../models/DataPointType';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css']
})
export class PoolComponent {
  @Input()
  device: DeviceClass;
  @Input()
  sRPM: DataPointType;

  constructor(private IOs: LogicIOService) {
    this.IOs.updateIO.subscribe( () => {
      this.device.updateFlowTempLevelParam(this.sRPM);
    });
  }

}
