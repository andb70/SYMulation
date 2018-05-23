import { TestBed, inject } from '@angular/core/testing';

import { LogicIOService } from './logic-io.service';

describe('LogicIOService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogicIOService]
    });
  });

  it('should be created', inject([LogicIOService], (service: LogicIOService) => {
    expect(service).toBeTruthy();
  }));
});
