import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialPage } from './tutorial.page';
import { TutorialRoutingModule } from './tutorial-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, TutorialRoutingModule],
  declarations: [TutorialPage],
})
export class TutorialModule {}
