import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { FarmerReportService } from './farmer-report.service';

describe('FarmerReportService', () => {
  let service: FarmerReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FarmerReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
