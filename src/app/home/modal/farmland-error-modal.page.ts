import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-farmland-error-modal',
  templateUrl: 'farmland-error-modal.page.html',
  styleUrls: ['farmland-error-modal.page.scss'],
})
export class FarmlandErrorModalPage {
  constructor(private modalController: ModalController) {}

  public dismiss(): void {
    this.modalController.dismiss();
  }
}
