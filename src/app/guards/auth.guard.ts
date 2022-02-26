import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  private redirectTo = '/';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.isAuthenticated();
  }

  public canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.isAuthenticated();
  }

  private isAuthenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService.isLoggedIn().subscribe(async (data) => {
        if (data) {
          resolve(true);
        } else {
          const toast = await this.toastController.create({
            message: 'You must be logged in',
            duration: 2000,
          });

          await toast.present();

          this.router.navigate([this.redirectTo]);

          resolve(false);
        }
      });
    });
  }
}
