import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { getDaysFromNowToDate } from '../helpers/time.helper';
import { CropService } from '../services/crop.service';
import { FarmerReportService } from '../services/farmer-report.service';
import { FarmlandService } from '../services/farmland.service';
import { PhotoService } from '../services/photo.service';
import { TranslateConfigService } from '../services/translate-config.service';
import { Crop, SeedStage } from '../types/crop.type';
import { FarmerReport } from '../types/farmer-report.type';
import { Farmland } from '../types/farmland.type';
import { SubmitReportModalPage } from './modal/submit-report-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public farmlandSelectionForm: FormGroup;
  public farmlands: Farmland[];
  public currentFarmland: Farmland;
  public currentSeedStage: SeedStage;
  public nextSeedStage: SeedStage;
  public currentSeedStageImagePath: string;
  public submittedFarmerReports: FarmerReport[] = [];
  public plantedFarmerReport: FarmerReport;

  public estimatedYieldDateEarliest: string;
  public estimatedYieldDateLatest: string;
  public estimatedYieldDayEarliest: number;
  public estimatedYieldDayLatest: number;
  public estimatedProfit: number;
  public estimatedYieldAmount: number;

  private subscriptions = new Subscription();

  private hasLoadedSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private photoService: PhotoService,
    private cropService: CropService,
    private farmlandService: FarmlandService,
    private farmerReportService: FarmerReportService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private translateConfigService: TranslateConfigService,
  ) {}

  public async ngOnInit(): Promise<void> {
    this.setupLanguage();
    this.setupForm();

    await this.showLoadingDialog();

    this.setupFarmlandHooks();
    this.setupLoadingDialogDismiss();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

    modal.onDidDismiss().then(({ data }) => {
      this.photoService.clearPhoto();

      if (data?.success) {
        this.setupFarmlandHooks();
      }
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
    farmerReports: FarmerReport[],
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
    return this.cropService.getSeedStageTranslationKey(seedStage);
  }

  private setupLanguage(): void {
    this.subscriptions.add(
      this.translateConfigService.getLanguagePreference().subscribe((data) => {
        this.translateConfigService.changeLanguage(data.language);
      }),
    );
  }

  private setupForm() {
    this.farmlandSelectionForm = this.formBuilder.group({
      farmland: ['', Validators.required],
    });

    this.subscriptions.add(
      this.farmlandSelectionForm
        .get('farmland')
        .valueChanges.subscribe(async (selectedFarmlandId) => {
          const selectedFarmland = this.getFarmland(selectedFarmlandId);
          this.currentFarmland = selectedFarmland;

          await this.showLoadingDialog();

          this.setupFarmerReportHooks(selectedFarmland);
          this.retrieveSeedStage(selectedFarmland);
        }),
    );
  }

  private setupFarmlandHooks() {
    // if (this.farmlandHookSubscription) {
    //   this.farmlandHookSubscription.unsubscribe();
    // }

    this.subscriptions.add(
      this.farmlandService.getFarmlands().subscribe((farmlands) => {
        this.farmlands = farmlands;
        const firstFarmland = farmlands[0];

        if (!this.currentFarmland) {
          this.currentFarmland = firstFarmland;
        }

        this.farmlandSelectionForm.patchValue({
          farmland: this.currentFarmland.id,
        });

        this.setupFarmerReportHooks(this.currentFarmland);
        this.retrieveSeedStage(this.currentFarmland);
      }),
    );
  }

  private setupFarmerReportHooks(currentFarmland: Farmland) {
    // if (this.farmerReportHookSubscription) {
    //   this.farmerReportHookSubscription.unsubscribe();
    // }

    this.subscriptions.add(
      this.farmerReportService
        .getFarmerReports(currentFarmland)
        .subscribe((data) => {
          this.submittedFarmerReports = data;
          this.plantedFarmerReport = this.getPlantedFarmerReport(data);

          this.computeEstimates();
          this.hasLoadedSubject.next(true);
        }),
    );
  }

  private retrieveSeedStage(farmland: Farmland) {
    // if (this.seedStageHookSubscriptions) {
    //   this.seedStageHookSubscriptions.unsubscribe();
    // }

    const seedStageHookSubscriptions = new Subscription();

    seedStageHookSubscriptions.add(
      this.cropService.getCurrentSeedStage(farmland).subscribe(async (data) => {
        this.currentSeedStage = data;
        this.currentSeedStageImagePath =
          this.cropService.getSeedStageImagePath(data);
      }),
    );

    seedStageHookSubscriptions.add(
      this.cropService.getNextSeedStage(farmland).subscribe((data) => {
        this.nextSeedStage = data;
      }),
    );

    this.subscriptions.add(seedStageHookSubscriptions);
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

    this.estimatedYieldDayEarliest = getDaysFromNowToDate(
      new Date(estimatedYieldDateEarliest),
    );

    this.estimatedYieldDayLatest = getDaysFromNowToDate(
      new Date(estimatedYieldDateLatest),
    );
  }

  private async showLoadingDialog(): Promise<void> {
    const existingDialog = await this.getExistingDialog();

    if (existingDialog) {
      return;
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Loading...',
      spinner: 'dots',
    });

    await loading.present();
  }

  private setupLoadingDialogDismiss(): void {
    this.hasLoadedSubject.asObservable().subscribe(async (hasLoaded) => {
      const existingDialog = await this.getExistingDialog();

      if (hasLoaded && existingDialog) {
        await this.loadingController.dismiss();
      }
    });
  }

  private getExistingDialog(): Promise<HTMLIonLoadingElement> {
    return this.loadingController.getTop();
  }
}
