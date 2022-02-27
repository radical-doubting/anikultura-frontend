import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FarmerReportService } from 'src/app/services/farmer-report.service';
import { PhotoService } from 'src/app/services/photo.service';
import {
  FarmerReportBody,
  FarmerReportPhoto,
} from 'src/app/types/farmer-report.type';

@Component({
  selector: 'app-submit-report-modal',
  templateUrl: 'submit-report-modal.page.html',
  styleUrls: ['submit-report-modal.page.scss'],
})
export class SubmitReportModalPage implements OnInit {
  @Input()
  public cropId: number;

  @Input()
  public farmlandId: number;

  private currentPhoto: FarmerReportPhoto;

  constructor(
    private router: Router,
    private photoService: PhotoService,
    private toastController: ToastController,
    private farmerReportService: FarmerReportService
  ) {}

  ngOnInit(): void {
    this.photoService.getCurrentPhoto().subscribe((data) => {
      this.currentPhoto = data;
    });
  }

  public takePhoto() {
    this.photoService.takeNewPhoto();
  }

  public submitReport() {
    const body: FarmerReportBody = {
      farmerReport: {
        cropId: this.cropId,
        farmlandId: this.cropId,
      },
    };

    this.farmerReportService.submitFarmerReport(body).subscribe(
      async (data) => {
        await this.toast('Successfull submitted farmer report');
      },
      async (error) => {
        await this.toast('Failed to submit farmer report');
      }
    );
  }

  public hasPhoto() {
    return this.currentPhoto !== null;
  }

  public onReturn() {
    this.router.navigate(['/dashboard/home']);
  }

  private async toast(message: string, duration = 2000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
    });

    await toast.present();
  }
}
