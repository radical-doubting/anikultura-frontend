import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthGuard } from '../guards/auth.guard';
import { TutorialPage } from './tutorial.page';

const routes: Routes = [
  {
    path: '',
    component: TutorialPage,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TranslateModule],
  exports: [RouterModule],
})
export class TutorialRoutingModule {}
