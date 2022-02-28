import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../types/user.type';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public farmer: User;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe((data) => {
      this.farmer = data;
    });
  }

  public onReturn() {
    this.router.navigate(['/dashboard/home']);
  }

  public getGender(genderRaw: string): string {
    switch (genderRaw) {
      case '1':
        return 'Male';
      case '2':
        return 'Female';
      default:
        return 'Unspecified';
    }
  }
}
