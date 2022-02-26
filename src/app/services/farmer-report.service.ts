import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FarmerReport, FarmerReportBody } from '../types/farmer-report.type';

@Injectable({
  providedIn: 'root',
})
export class FarmerReportService {
  constructor(private http: HttpClient) {}

  public submitFarmerReport(body: FarmerReportBody): Observable<void> {
    return this.http
      .post<FarmerReport>('/api/farmer-reports', body)
      .pipe(map((data) => {}));
  }

  public getFarmerReports(): Observable<FarmerReport[]> {
    return this.http
      .get<FarmerReport[]>('/api/farmer-reports')
      .pipe(map((data) => data));
  }
}
