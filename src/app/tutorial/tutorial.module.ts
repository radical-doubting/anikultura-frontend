import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialPage } from './tutorial.page';
import { TutorialRoutingModule } from './tutorial-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [IonicModule, CommonModule, TutorialRoutingModule, TranslateModule],
  declarations: [TutorialPage],
})
export class TutorialModule {}
