import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CropService } from '../services/crop.service';
import { FarmerReportService } from '../services/farmer-report.service';
import { FarmlandService } from '../services/farmland.service';
import { PhotoService } from '../services/photo.service';
import { Crop, SeedStage } from '../types/crop.type';
import { FarmerReport } from '../types/farmer-report.type';
import { Farmland } from '../types/farmland.type';
import { SubmitReportModalPage } from './modal/submit-report-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private farmlandSelectionForm: FormGroup;
  private farmlands: Farmland[];
  private currentFarmland: Farmland;
  private currentSeedStage: SeedStage;
  private nextSeedStage: SeedStage;
  private currentSeedStageImagePath: string;

  private submittedFarmerReports: FarmerReport[] = [];
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
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {}

  public ngOnInit(): void {
    this.setupForm();
    this.setupFarmlandHooks();
  }

  public async onBeginSubmitFarmerReport() {
    const modal = await this.modalController.create({
      component: SubmitReportModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        currentFarmland: this.currentFarmland,
        currentCrop: this.getExistingCrop(),
        currentSeedStage: this.currentSeedStage,
      },
    });

    modal.onDidDismiss().then((data) => {
      this.photoService.clearPhoto();
    });

    return await modal.present();
  }

  public hasSubmittedReports(): boolean {
    return this.submittedFarmerReports.length > 0;
  }

  public hasPlantedFarmerReport(): boolean {
    return this.plantedFarmerReport !== null;
  }

  public getFarmland(id: number): Farmland {
    return this.farmlands.find((farmland) => farmland.id === id);
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

  public getExistingCrop(): Crop {
    if (this.hasSubmittedReports()) {
      return this.submittedFarmerReports[0].crop;
    }

    return null;
  }

  public translateSeedStage(seedStage: SeedStage): string {
    return this.cropService.translateSeedStagePastTense(seedStage);
  }

  private setupForm() {
    this.farmlandSelectionForm = this.formBuilder.group({
      farmland: ['', Validators.required],
    });

    this.farmlandSelectionForm
      .get('farmland')
      .valueChanges.subscribe((selectedFarmlandId) => {
        const selectedFarmland = this.getFarmland(selectedFarmlandId);
        this.setupFarmerReportHooks(selectedFarmland);
        this.retrieveSeedStage(selectedFarmland);
      });
  }

  private setupFarmlandHooks() {
    this.farmlandService.getFarmlands().subscribe((data) => {
      const firstFarmland = data[0];
      this.farmlands = data;
      this.currentFarmland = firstFarmland;

      this.setupFarmerReportHooks(firstFarmland);
      this.retrieveSeedStage(firstFarmland);

      this.farmlandSelectionForm.patchValue({
        farmland: firstFarmland.id,
      });
    });
  }

  private setupFarmerReportHooks(currentFarmland: Farmland) {
    this.farmerReportService
      .getFarmerReports(currentFarmland)
      .subscribe((data) => {
        this.submittedFarmerReports = data;
        this.plantedFarmerReport = this.getPlantedFarmerReport(data);

        this.computeEstimates();
      });
  }

  private retrieveSeedStage(farmland: Farmland) {
    this.cropService.getCurrentSeedStage(farmland).subscribe((data) => {
      this.currentSeedStage = data;
      this.currentSeedStageImagePath =
        this.cropService.getSeedStageImagePath(data);
    });

    this.cropService.getNextSeedStage(farmland).subscribe((data) => {
      this.nextSeedStage = data;
    });
  }

  private computeEstimates(): void {
    if (!this.hasPlantedFarmerReport()) {
      return;
    }
    const {
      estimatedProfit,
      estimatedYieldAmount,
      estimatedYieldDateEarliest,
      estimatedYieldDateLatest,
    } = this.plantedFarmerReport;

    this.estimatedProfit = estimatedProfit;
    this.estimatedYieldAmount = estimatedYieldAmount;
    this.estimatedYieldDateEarliest = estimatedYieldDateEarliest;
    this.estimatedYieldDateLatest = estimatedYieldDateLatest;

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
