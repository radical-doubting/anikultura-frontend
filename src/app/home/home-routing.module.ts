import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthGuard } from '../guards/auth.guard';
import { HomePage } from './home.page'; //HomePage = HomeComponent in the tutorial

// Below is HomeRoutes in the tutorial
const routes: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TranslateModule],
  exports: [RouterModule],
})
export class HomeRoutingModule {}

//home-routing.module.ts is home.routes.ts from tutorial and is also home.module.ts
