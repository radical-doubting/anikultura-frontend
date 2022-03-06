import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AlertController } from '@ionic/angular';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PWAUpdateService {
  constructor(
    private swUpdate: SwUpdate,
    private alertController: AlertController,
  ) {}

  public checkForUpdates(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe((event) => this.promptUser());

      interval(60 * 60 * 1000).subscribe(async () => {
        await this.swUpdate.checkForUpdate();
      });
    }
  }

  private promptUser(): void {
    this.swUpdate.activateUpdate().then(async () => {
      await this.alertController.create({
        header: 'May panibagong update ang app',
        subHeader: '',
        backdropDismiss: false,
        message:
          'Kailangan i-refresh ang app para makuha ang panibagong updates',
        buttons: [
          {
            text: 'Update',
            handler: () => {
              this.installUpdate();
            },
          },
        ],
      });
    });
  }

  private installUpdate(): void {
    window.location.reload();
  }
}
