import { TestBed } from '@angular/core/testing';

import { LocalCachingService } from './local-caching.service';

describe('LocalcachingService', () => {
  let service: LocalCachingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalCachingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
