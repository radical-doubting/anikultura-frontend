import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../types/api.type';
import { TutorialState } from '../types/farmer.type';

@Injectable({
  providedIn: 'root',
})
export class FarmerService {
  constructor(private http: HttpClient) {}

  public getTutorialState(): Observable<boolean> {
    return this.http
      .get<ApiResponse<TutorialState>>('/api/farmers/tutorial')
      .pipe(map(({ data }) => data.isTutorialDone));
  }

  public updateTutorialState(tutorialDone: boolean): Observable<void> {
    const body = { tutorialDone };

    return this.http
      .patch<any>('/api/farmers/tutorial', body)
      .pipe(map((data) => {}));
  }
}
