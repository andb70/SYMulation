import { TestBed, inject } from '@angular/core/testing';

import { StyRepoService } from './sty-repo.service';

describe('StyRepoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StyRepoService]
    });
  });

  it('should be created', inject([StyRepoService], (service: StyRepoService) => {
    expect(service).toBeTruthy();
  }));
});
