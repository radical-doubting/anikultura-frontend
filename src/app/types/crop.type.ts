import { Batch } from './batch.type';

export class SeedStage {
  id: number;
  name: string;
  slug: string;
}

export class SeedAllocation {
  seedAmount: number;
  batch: Batch;
}

export class Crop {
  id: number;
  name: string;
}
