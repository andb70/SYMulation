import {Component, Input} from '@angular/core';
import {LogicIOService} from '../logic-io.service';
import {DeviceClass} from '../models/DeviceClass';

@Component({
  selector: 'app-pool1',
  templateUrl: './pool1.component.html',
  styleUrls: ['./pool1.component.css']
})
export class Pool1Component {
  @Input()
  device: DeviceClass;

  constructor(private IOs: LogicIOService) {
    this.IOs.updateIO.subscribe( t => {
      // console.log('pool update');
      this.device.updateFlowTempRH();
    });
  }
}
