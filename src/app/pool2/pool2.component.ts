import {Component, Input} from '@angular/core';
import {LogicIOService} from '../logic-io.service';
import {DeviceClass} from '../models/DeviceClass';
import {DataPointType} from '../models/DataPointType';

@Component({
  selector: 'app-pool2',
  templateUrl: './pool2.component.html',
  styleUrls: ['./pool2.component.css']
})
export class Pool2Component {
  @Input()
  device: DeviceClass;
  @Input()
  sRPM: DataPointType;

  constructor(private IOs: LogicIOService) {
    this.IOs.updateIO.subscribe( t => {
      // console.log('pool update');
      this.device.updateFlowTempRH(this.sRPM);
    });
  }
}
