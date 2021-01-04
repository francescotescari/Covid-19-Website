import { TestBed } from '@angular/core/testing';

import { LoadmanagerService } from './loadmanager.service';

describe('LoadmanagerService', () => {
  let service: LoadmanagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadmanagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
