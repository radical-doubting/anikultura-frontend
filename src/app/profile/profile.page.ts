import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TranslateConfigService } from '../services/translate-config.service';
import { LanguageOption } from '../types/language.type';
import { User, UserProfile } from '../types/user.type';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public farmer: User;
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private translateConfigService: TranslateConfigService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.getLoggedInUser().subscribe((data) => {
        this.farmer = data;
      }),
    );

    this.subscriptions.add(
      this.translateConfigService.getLanguagePreference().subscribe((data) => {
        this.translateConfigService.changeLanguage(data.language);
      }),
    );
  }

  public getAge(birthday: string): number {
    const timeDiff = Math.abs(Date.now() - new Date(birthday).getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
  }

  public onReturn() {
    this.router.navigate(['/dashboard/home']);
  }

  public handleChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const chosenLanguage = customEvent.detail.value as LanguageOption;

    this.translateConfigService.changeLanguage(chosenLanguage);

    this.subscriptions.add(
      this.translateConfigService
        .updateLanguagePreference(chosenLanguage)
        .subscribe((data) => {}),
    );
  }
}
