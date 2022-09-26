import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TranslateConfigService } from '../services/translate-config.service';
import { User, UserProfile } from '../types/user.type';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public farmer: User;

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
}
