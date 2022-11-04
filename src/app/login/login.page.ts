import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public isSubmitted: boolean;
  public subscriptions = new Subscription();

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

    const subscription = this.authService
      .getLoggedInUser()
      .pipe(first())
      .subscribe(async (user) => {
        if (user === null) {
          return;
        }

        if (user?.profile?.isTutorialDone) {
          this.router.navigate(['/dashboard/home']);
        } else {
          this.router.navigate(['/tutorial']);
        }

        await this.toast('You are already logged in!');
      });

    this.subscriptions.add(subscription);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      await this.toast('Login page missing some fields!');
      return;
    }

    const subscription = this.authService
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe(
        async (data) => {
          this.isSubmitted = true;

          await this.toast('Successfully logged in!');

          if (data.profile.isTutorialDone) {
            await this.router.navigate(['/dashboard/home']);
          } else {
            await this.router.navigate(['/tutorial']);
          }
        },
        async (error) => {
          this.isSubmitted = false;
          await this.toast(`Failed to login: ${error.message}`);
        },
      );

    this.subscriptions.add(subscription);
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
