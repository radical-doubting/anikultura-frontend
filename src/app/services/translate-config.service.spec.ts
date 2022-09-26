import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { TranslateConfigService } from './translate-config.service';

describe('TranslateConfigService', () => {
  let service: TranslateConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
    service = TestBed.inject(TranslateConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
