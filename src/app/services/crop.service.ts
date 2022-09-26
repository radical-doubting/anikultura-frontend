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
    return this.http.get<Crop[]>('/api/crops').pipe(map((data) => data));
  }

  public getSeedAllocations(): Observable<SeedAllocation[]> {
    return this.http
      .get<ApiResponse<SeedAllocation[]>>('/api/crops/seed-allocation')
      .pipe(map(({ data }) => data));
  }

  public getCurrentSeedStage({ id }: Farmland): Observable<SeedStage> {
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

  public getNextSeedStage({ id }: Farmland): Observable<SeedStage> {
    const body = { farmlandId: id };

    return this.http
      .post<ApiResponse<SeedStage>>('/api/crops/next-seed-stage', body)
      .pipe(
        map(({ data }) => {
          if (Object.keys(data).length === 0) {
            return null;
          }

          return data;
        }),
      );
  }

  public translateSeedStagePastTense({ slug }: SeedStage): string {
    switch (slug) {
      case 'starter-kit-received':
        return 'Nakuha na ang Starter Kit';
      case 'seeds-planted':
        return 'Natanim na ang mga buto';
      case 'seeds-established':
        return 'Nailipat na ang mga buto sa lupang tataniman';
      case 'seeds-vegetative':
        return 'Malalago at malapit na magbunga ang tanim';
      case 'yield-formation-stage':
        return 'Namumulaklak at unti-unting nagbubunga ang tanim';
      case 'ripening-stage':
        return 'Namunga na ang mga tanim at malapit na anihin';
      case 'crops-harvested':
        return 'Naani ko na ang aking mga tanim';
      case 'marketable':
        return 'Maaring ibenta ang mga pananim!';
    }
  }

  public getSeedStageImagePath(seedStage: SeedStage): string {
    if (seedStage === null) {
      return `../assets/stages/stage0.png`;
    } else {
      return `../assets/stages/stage${seedStage.id}.png`;
    }
  }
}
