import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private authService: AuthService,
  ) {}

  public async showConfirm() {
    this.alertController
      .create({
        header: 'Gusto mo na ba log-out?',
        subHeader: '',
        message:
          'Kapag nag-logout ay kailangan muli mag log-in gamit ang username at password',
        buttons: [
          {
            text: 'Hindi muna',
            handler: () => {},
          },
          {
            text: 'Oo, log-out na ako',
            handler: () => {
              this.authService.logout().subscribe((data) => {
                this.router.navigate(['/']);
                this.toast('Nakapag logged out ka na!');
              });
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  private async toast(message: string, duration = 2000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
    });

    await toast.present();
  }
}
