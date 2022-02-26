import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SeedAllocation, SeedStage } from '../types/crop.type';
import { Farmland } from '../types/farmland.type';

@Injectable({
  providedIn: 'root',
})
export class CropService {
  constructor(private http: HttpClient) {}

  public getSeedAllocations(): Observable<SeedAllocation[]> {
    return this.http
      .get<SeedAllocation[]>('/api/crops/seed-allocation')
      .pipe(map((data) => data));
  }

  public getCurrentSeedStage({ id }: Farmland): Observable<SeedStage> {
    const body = { farmlandId: id };
    return this.http
      .post<SeedStage>('/api/crops/current-seed-stage', body)
      .pipe(map((data) => data));
  }

  public getNextSeedStage({ id }: SeedStage): Observable<SeedStage | null> {
    const body = { currentSeedStageId: id };

    return this.http
      .post<SeedStage | null>('/api/crops/next-seed-stage', body)
      .pipe(
        map((data) => {
          if (Object.keys(data).length === 0) {
            return null;
          }

          return data;
        })
      );
  }

  public translateSeedStagePastTense({ slug }: SeedStage): string {
    switch (slug) {
      case 'starter-kit-received':
        return 'Nakuha ko na ang Starter Kit';
      case 'seeds-planted':
        return 'Natanim ko na ang mga buto';
      case 'seeds-established':
        return 'Nailipat na ang mga buto sa lupang tataniman';
      case 'seeds-vegetative':
        return 'Malalago at malapit na magbunga ang tanim';
      case 'yield-formating-stage':
        return 'Namumulaklak at unti-unting nagbubunga ang tanim';
      case 'ripening-stage':
        return 'Nagbunga na ang mga tanim at malapit na anihin';
      case 'crops-harvested':
        return 'Naani ko na ang aking mga tanim';
      case 'marketable':
        return 'Maari mo na ibenta ang iyong pananim!';
    }
  }

  public translateSeedStageFutureTense({ slug }: SeedStage): string {
    switch (slug) {
      case 'starter-kit-received':
        return 'Kuhain ang Starter Kit';
      case 'seeds-planted':
        return 'Itanim ang mga buto';
      case 'seeds-established':
        return 'Ilipat ang mga buto sa lupang tataniman';
      case 'seeds-vegetative':
        return 'Malalago at malapit na magbunga ang tanim';
      case 'yield-formating-stage':
        return 'Namumulaklak at unti-unting nagbubunga ang tanim';
      case 'ripening-stage':
        return 'Nagbunga na ang mga tanim at malapit na anihin';
      case 'crops-harvested':
        return 'Anihin ang aking mga tanim';
      case 'marketable':
        return 'Maari mo na ibenta ang iyong pananim!';
    }
  }

  public getSeedStageImagePath(seedStage: SeedStage): string {
    return `../assets/stages/stage${seedStage.id}.png`;
  }
}
