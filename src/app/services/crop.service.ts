import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../types/api.type';
import { Crop, SeedAllocation, SeedStage } from '../types/crop.type';
import { Farmland } from '../types/farmland.type';

@Injectable({
  providedIn: 'root',
})
export class CropService {
  constructor(private http: HttpClient) {}

  public getCrops(): Observable<Crop[]> {
    return this.http
      .get<ApiResponse<Crop[]>>('/api/crops')
      .pipe(map(({ data }) => data));
  }

  public getSeedAllocations(): Observable<SeedAllocation[]> {
    return this.http
      .get<ApiResponse<SeedAllocation[]>>('/api/crops/seed-allocation')
      .pipe(map(({ data }) => data));
  }

  public getCurrentSeedStage({ id }: Farmland): Observable<SeedStage | null> {
    const body = { farmlandId: id };
    return this.http
      .post<ApiResponse<SeedStage>>('/api/crops/current-seed-stage', body)
      .pipe(
        map((response) => {
          if (Object.keys(response).length === 0) {
            return null;
          }

          return response.data;
        }),
      );
  }

  public getNextSeedStage({ id }: Farmland): Observable<SeedStage | null> {
    const body = { farmlandId: id };

    return this.http
      .post<ApiResponse<SeedStage>>('/api/crops/next-seed-stage', body)
      .pipe(
        map((response) => {
          if (Object.keys(response).length === 0) {
            return null;
          }

          return response.data;
        }),
      );
  }

  public getSeedStageTranslationKey({ id }: SeedStage): string {
    return `home.stage-${id}_button`;
  }

  public getSeedStageImagePath(seedStage: SeedStage): string {
    if (seedStage === null) {
      return `../assets/stages/stage0.png`;
    } else {
      return `../assets/stages/stage${seedStage.id}.png`;
    }
  }
}
