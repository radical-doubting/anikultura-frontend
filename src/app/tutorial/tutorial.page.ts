import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FarmerService } from '../services/farmer.service';
import { TranslateConfigService } from '../services/translate-config.service';
import { User } from '../types/user.type';

@Component({
  selector: 'app-tutorial',
  templateUrl: 'tutorial.page.html',
  styleUrls: ['tutorial.page.scss'],
})
export class TutorialPage implements OnInit, OnDestroy {
  logs: string[] = [];

  public slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  private subscriptions = new Subscription();

  private homeRoute = '/dashboard/home';

  constructor(
    private router: Router,
    private farmerService: FarmerService,
    private translateConfigService: TranslateConfigService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.farmerService.getTutorialState().subscribe((data) => {
        if (data) {
          this.router.navigate([this.homeRoute]);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onFinish() {
    this.subscriptions.add(
      this.farmerService.updateTutorialState(true).subscribe((data) => {
        this.router.navigate([this.homeRoute]);
      }),
    );
  }

  public resetTutorial() {
    this.router.navigate(['/tutorial']);
  }

  public pushLog(msg: string) {
    this.logs.unshift(msg);
  }

  public handleChange(e) {
    this.translateConfigService.changeLanguage(e.detail.value);
  }
}
