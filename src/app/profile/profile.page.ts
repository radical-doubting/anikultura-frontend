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
  private chosenLanguage: LanguageOption = 'fil_PH';

  constructor(
    private router: Router,
    private authService: AuthService,
    private translateConfigService: TranslateConfigService,
  ) {}

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe((data) => {
      this.farmer = data;
    });
  }

  public getAge(birthday: string): number {
    const timeDiff = Math.abs(Date.now() - new Date(birthday).getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
  }

  public onReturn() {
    this.router.navigate(['/dashboard/home']);
  }

  public handleChange(e): void {
    this.chosenLanguage = e.detail.value;
    this.translateConfigService.changeLanguage(this.chosenLanguage);
    this.subscriptions.add(
      this.translateConfigService
        .updateLanguagePreference(this.chosenLanguage)
        .subscribe((data) => {}),
    );
  }
}
