import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslateConfigService {
  constructor(private translateService: TranslateService) {
    this.translateService.use('jp'); //This is setting which is the default language
  }

  changeLanguage(type: string) {
    this.translateService.use(type);
  }
}
