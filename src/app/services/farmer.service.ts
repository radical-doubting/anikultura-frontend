import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FarmerService {
  public isTutorialDoneSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  public updateTutorialState(tutorialDone: boolean): Observable<void> {
    const body = { tutorialDone };

    return this.http.patch<any>('/api/farmers/tutorial', body).pipe(
      map((data) => {
        this.isTutorialDoneSubject.next(tutorialDone);
      })
    );
  }

  public isTutorialDone() {
    return this.isTutorialDoneSubject.asObservable();
  }
}
