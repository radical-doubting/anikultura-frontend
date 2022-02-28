import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { HomeRoutingModule } from './home-routing.module';
import { SubmitReportModalPage } from './modal/submit-report-modal.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    HomeRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [HomePage, SubmitReportModalPage],
})
export class HomeModule {}
