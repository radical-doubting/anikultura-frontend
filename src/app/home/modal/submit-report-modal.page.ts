import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoService } from 'src/app/services/photo.service';
import { FarmerReportPhoto } from 'src/app/types/farmer-report.type';

@Component({
  selector: 'app-submit-report-modal',
  templateUrl: 'submit-report-modal.page.html',
  styleUrls: ['submit-report-modal.page.scss'],
})
export class SubmitReportModalPage implements OnInit {
  private currentPhoto: FarmerReportPhoto;

  constructor(private router: Router, private photoService: PhotoService) {}

  ngOnInit(): void {
    this.photoService.getCurrentPhoto().subscribe((data) => {
      this.currentPhoto = data;
    });
  }

  public takePhoto() {
    this.photoService.takeNewPhoto();
  }

  public hasPhoto() {
    return this.currentPhoto !== null;
  }

  public onReturn() {
    this.router.navigate(['/dashboard/home']);
  }
}
