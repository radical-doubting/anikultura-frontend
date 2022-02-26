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
    });
  }

  public onSelectChange(selectedFarmland: Farmland) {
    this.currentFarmland = selectedFarmland;
  }

  public addPhotoToGallery() {
    this.photoService.addNewToGallery();
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
}
