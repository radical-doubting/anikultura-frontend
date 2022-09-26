import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  FarmerReport,
  FarmerReportBody,
  FarmerReportPhoto,
} from '../types/farmer-report.type';
import { Farmland } from '../types/farmland.type';

@Injectable({
  providedIn: 'root',
})
export class FarmerReportService {
  constructor(private http: HttpClient) {}

  public submitFarmerReport(
    body: FarmerReportBody,
    photo: FarmerReportPhoto,
  ): Observable<FarmerReport> {
    const formData = new FormData();
    formData.append('image', this.dataURIToBlob(photo.dataUrl));
    formData.append('data', JSON.stringify(body.farmerReport));

    return this.http
      .post<FarmerReport>('/api/farmer-reports', formData)
      .pipe(map((data) => data));
  }

  public getFarmerReports({ id }: Farmland): Observable<FarmerReport[]> {
    return this.http
      .get<FarmerReport[]>(`/api/farmer-reports/${id}`)
      .pipe(map((data) => data));
  }

  private dataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }
}
