import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../types/api.type';
import { Farmland } from '../types/farmland.type';

@Injectable({
  providedIn: 'root',
})
export class FarmlandService {
  constructor(private http: HttpClient) {}

  public getFarmlands(): Observable<Farmland[]> {
    return this.http
      .get<ApiResponse<Farmland[]>>('/api/farmlands')
      .pipe(map(({ data }) => data));
  }
}
