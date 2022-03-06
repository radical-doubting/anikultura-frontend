import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { PWAUpdateService } from './services/pwa/pwa-update.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private pwaUpdateService: PWAUpdateService,
  ) {
    this.pwaUpdateService.checkForUpdates();
    this.authService.verify();
  }
}
