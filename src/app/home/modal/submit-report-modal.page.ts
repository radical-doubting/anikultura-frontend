import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CropService } from 'src/app/services/crop.service';
import { FarmerReportService } from 'src/app/services/farmer-report.service';
import { PhotoService } from 'src/app/services/photo.service';
import { Crop, SeedStage } from 'src/app/types/crop.type';
import {
  FarmerReport,
  FarmerReportBody,
  FarmerReportPhoto,
} from 'src/app/types/farmer-report.type';
import { Farmland } from 'src/app/types/farmland.type';

@Component({
  selector: 'app-submit-report-modal',
  templateUrl: 'submit-report-modal.page.html',
  styleUrls: ['submit-report-modal.page.scss'],
})
export class SubmitReportModalPage implements OnInit, OnDestroy {
  @Input()
  public currentCrop: Crop;

  @Input()
  public currentFarmland: Farmland;

  @Input()
  public currentSeedStage: SeedStage;

  public farmerReportForm: FormGroup;
  public currentPhoto: FarmerReportPhoto;
  public crops: Crop[] = [];

  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private photoService: PhotoService,
    private modalController: ModalController,
    private toastController: ToastController,
    private farmerReportService: FarmerReportService,
    private cropService: CropService,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.subscriptions.add(
      this.photoService.getCurrentPhoto().subscribe((data) => {
        this.currentPhoto = data;
      })
    );

    if (this.isFirstTimeToReport()) {
      this.subscriptions.add(
        this.cropService.getCrops().subscribe((data) => {
          this.crops = data;
        })
      );
    }

    this.farmerReportForm = this.formBuilder.group({
      cropId: [
        this.hasExistingCrop() ? this.currentCrop.id : null,
        Validators.required,
      ],
      farmlandId: [this.currentFarmland.id, Validators.required],
      volumeKg: [null],
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async takePhoto() {
    await this.photoService.takeNewPhoto();
  }

  public hasExistingCrop(): boolean {
    return this.currentCrop !== null;
  }

  public async submitReport() {
    const body: FarmerReportBody = {
      farmerReport: this.farmerReportForm.value,
    };

    if (this.farmerReportForm.invalid) {
      await this.toast('May kulang na mga detalye sa report!');
      return;
    }

    this.subscriptions.add(
      this.farmerReportService.submitFarmerReport(body).subscribe(
        async (data) => {
          this.uploadPhoto(data);
        },
        async (error) => {
          await this.toast('Failed to submit farmer report');
        }
      )
    );
  }

  public uploadPhoto(farmerReport: FarmerReport) {
    this.subscriptions.add(
      this.farmerReportService
        .uploadFarmerReportImage(farmerReport, this.currentPhoto)
        .subscribe(
          async (data) => {
            this.modalController.dismiss({ success: true });
            await this.toast('Successfully submitted farmer report');
          },
          async (error) => {
            await this.toast('Failed to upload image');
          }
        )
    );
  }

  public isFirstTimeToReport(): boolean {
    return !this.hasCurrentSeedStage();
  }

  public isMarketable(): boolean {
    if (this.hasCurrentSeedStage()) {
      return this.currentSeedStage.slug === 'marketable';
    } else {
      return false;
    }
  }

  public hasCurrentSeedStage(): boolean {
    return this.currentSeedStage !== null;
  }

  public hasPhoto(): boolean {
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
