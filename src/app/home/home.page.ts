import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CropService } from '../services/crop.service';
import { FarmerReportService } from '../services/farmer-report.service';
import { FarmlandService } from '../services/farmland.service';
import { PhotoService } from '../services/photo.service';
import { SeedStage } from '../types/crop.type';
import { FarmerReport } from '../types/farmer-report.type';
import { Farmland } from '../types/farmland.type';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private farmerReportForm: FormGroup;
  private farmlands: Farmland[];
  private currentFarmland: Farmland;
  private currentSeedStage: SeedStage;
  private currentSeedStageImagePath: string;

  private submittedFarmerReports: FarmerReport[];
  private plantedFarmerReport: FarmerReport;

  private estimatedYieldDateEarliest: string;
  private estimatedYieldDateLatest: string;
  private estimatedYieldDayEarliest: number;
  private estimatedYieldDayLatest: number;
  private estimatedProfit: number;
  private estimatedYieldAmount: number;

  constructor(
    private photoService: PhotoService,
    private cropService: CropService,
    private farmlandService: FarmlandService,
    private farmerReportService: FarmerReportService,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.farmerReportForm = this.formBuilder.group({
      farmland: ['', Validators.required],
    });

    this.cropService.getCurrentSeedStage().subscribe((data) => {
      this.currentSeedStage = data;
      this.currentSeedStageImagePath = this.cropService.getSeedStageImagePath(
        this.currentSeedStage
      );
    });

    this.farmlandService.getFarmlands().subscribe((data) => {
      const firstFarmland = data[0];
      this.farmlands = data;
      this.currentFarmland = firstFarmland;

      this.farmerReportForm.patchValue({
        farmland: firstFarmland.id,
      });
    });

    this.farmerReportService.getFarmerReports().subscribe((data) => {
      this.submittedFarmerReports = data;
      this.plantedFarmerReport = this.getPlantedFarmerReport(data);

      this.computeEstimates();
    });
  }

  public onFarmlandSelectChange(selectedFarmland: Farmland) {
    this.currentFarmland = selectedFarmland;
  }

  public addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  public hasPlantedFarmerReport(): boolean {
    return this.plantedFarmerReport !== null;
  }

  public getPlantedFarmerReport(
    farmerReports: FarmerReport[]
  ): FarmerReport | null {
    for (const farmerReport of farmerReports) {
      if (farmerReport.seedStage.slug === 'seeds-planted') {
        return farmerReport;
      }
    }
    return null;
  }

  private computeEstimates(): void {
    if (!this.hasPlantedFarmerReport()) {
      return;
    }
    const {
      estimatedYieldDateEarliest,
      estimatedYieldDateLatest,
      estimatedYieldAmount,
    } = this.plantedFarmerReport;

    this.estimatedYieldDateEarliest = estimatedYieldDateEarliest;
    this.estimatedYieldDateLatest = estimatedYieldDateLatest;
    this.estimatedProfit = 0;
    this.estimatedYieldAmount = estimatedYieldAmount;

    this.estimatedYieldDayEarliest = this.getDaysFromNowToDate(
      new Date(estimatedYieldDateEarliest)
    );

    this.estimatedYieldDayLatest = this.getDaysFromNowToDate(
      new Date(estimatedYieldDateLatest)
    );
  }

  private getDaysFromNowToDate(date: Date): number {
    const currentDate = new Date();

    const diff = Math.floor(
      (Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ) -
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) /
        (1000 * 60 * 60 * 24)
    );

    return Math.abs(diff);
  }
}
