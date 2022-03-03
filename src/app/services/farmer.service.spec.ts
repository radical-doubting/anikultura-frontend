import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { FarmerService } from './farmer.service';

describe('FarmerService', () => {
  let service: FarmerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FarmerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
