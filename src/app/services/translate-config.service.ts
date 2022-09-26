import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../types/api.type';
import { LanguagePreference, LanguageOption } from '../types/language.type';

@Injectable({
  providedIn: 'root',
})
export class TranslateConfigService {
  constructor(
    private http: HttpClient,
    private translateService: TranslateService,
  ) {}

  public getLanguagePreference(): Observable<LanguagePreference> {
    return this.http
      .get<ApiResponse<LanguagePreference>>('/api/farmers/language')
      .pipe(map(({ data }) => data));
  }

  public updateLanguagePreference(option: LanguageOption): Observable<void> {
    const body = { language: option };

    return this.http
      .patch<any>('/api/farmers/language', body)
      .pipe(map((data) => {}));
  }

  public changeLanguage(option: LanguageOption): void {
    this.translateService.use(option);
  }
}
