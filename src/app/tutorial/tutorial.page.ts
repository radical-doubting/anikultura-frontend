import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FarmerService } from '../services/farmer.service';
import { User } from '../types/user.type';

@Component({
  selector: 'app-tutorial',
  templateUrl: 'tutorial.page.html',
  styleUrls: ['tutorial.page.scss'],
})
export class TutorialPage implements OnInit {
  public slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  private homeRoute = '/dashboard/home';

  constructor(private router: Router, private farmerService: FarmerService) {}

  ngOnInit(): void {
    this.farmerService.isTutorialDone().subscribe((data) => {
      if (data) {
        this.router.navigate([this.homeRoute]);
      }
    });
  }

  public onFinish() {
    this.farmerService.updateTutorialState(true).subscribe((data) => {
      this.router.navigate([this.homeRoute]);
    });
  }

  public resetTutorial() {
    this.router.navigate(['/tutorial']);
  }
}
