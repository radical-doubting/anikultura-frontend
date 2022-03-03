import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, ToastController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AuthPayload, LoginBody } from '../types/auth-payload.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
  ) {}

  public ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.authService.getLoggedInUser().subscribe(async (user) => {
      if (user?.profile?.isTutorialDone) {
        this.router.navigate(['/dashboard/home']);
      } else {
        this.router.navigate(['/tutorial']);
      }

      await this.toast('You are already logged in!');
    });
  }

  public async onSubmit(loginButton: IonButton): Promise<void> {
    if (this.loginForm.invalid) {
      await this.toast('Login page missing some fields!');
      return;
    }

    loginButton.disabled = true;

    this.authService
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe(
        async (data) => {
          if (data.profile.isTutorialDone) {
            this.router.navigate(['/dashboard/home']);
          } else {
            this.router.navigate(['/tutorial']);
          }

          await this.toast('Successfully logged in!');
        },
        async (error) => {
          loginButton.disabled = false;
          await this.toast(`Failed to login: ${error.message}`);
        },
      );
  }

  private async toast(message: string, duration = 2000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
    });

    await toast.present();
  }
}

export class LoginPageModule {}
