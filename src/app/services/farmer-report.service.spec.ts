import { TestBed } from '@angular/core/testing';

import { FarmerReportService } from './farmer-report.service';

describe('FarmerReportService', () => {
  let service: FarmerReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FarmerReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
