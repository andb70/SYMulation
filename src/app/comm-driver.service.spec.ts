import { TestBed, inject } from '@angular/core/testing';

import { CommDriverService } from './comm-driver.service';

describe('CommDriverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommDriverService]
    });
  });

  it('should be created', inject([CommDriverService], (service: CommDriverService) => {
    expect(service).toBeTruthy();
  }));
});
