import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutorial',
  templateUrl: 'tutorial.page.html',
  styleUrls: ['tutorial.page.scss'],
})
export class TutorialPage {
  // Optional parameters to pass to the swiper instance.
  // See http://idangero.us/swiper/api/ for valid options.

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  constructor(private router: Router) {}

  public onFinish() {
    this.router.navigate(['/dashboard/home']);
  }
}
