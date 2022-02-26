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

  public getCurrentSeedStage(): Observable<SeedStage> {
    return this.http
      .get<SeedStage>('/api/crops/seed-stage')
      .pipe(map((data) => data));
  }

  public getSeedStageImagePath(seedStage: SeedStage): string {
    return `../assets/stages/stage${seedStage.id}.png`;
  }
}
