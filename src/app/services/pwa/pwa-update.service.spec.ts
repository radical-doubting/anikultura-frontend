import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ServiceWorkerModule } from '@angular/service-worker';

import { PWAUpdateService } from './pwa-update.service';

describe('PWAUpdateService', () => {
  let service: PWAUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
      ],
    });
    service = TestBed.inject(PWAUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
