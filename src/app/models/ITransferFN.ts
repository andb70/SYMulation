import {DataPointType} from './DataPointType';

export interface ItranseferFN {
  update(inputs: DataPointType[]): DataPointType[];
}
