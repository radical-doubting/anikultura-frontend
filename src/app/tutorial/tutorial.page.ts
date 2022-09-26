import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FarmerService } from '../services/farmer.service';
import { TranslateConfigService } from '../services/translate-config.service';
import { LanguageOption } from '../types/language.type';
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
  private chosenLanguage: LanguageOption = 'fil_PH';

  constructor(
    private router: Router,
    private farmerService: FarmerService,
    private translateConfigService: TranslateConfigService,
  ) {}

  ngOnInit(): void {
    this.translateConfigService.changeLanguage(this.chosenLanguage);

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

    this.subscriptions.add(
      this.translateConfigService
        .updateLanguagePreference(this.chosenLanguage)
        .subscribe((data) => {}),
    );
  }

  public resetTutorial(): void {
    this.router.navigate(['/tutorial']);
  }

  public pushLog(msg: string): void {
    this.logs.unshift(msg);
  }

  public handleChange(e): void {
    this.chosenLanguage = e.detail.value;
    this.translateConfigService.changeLanguage(this.chosenLanguage);
  }
}
