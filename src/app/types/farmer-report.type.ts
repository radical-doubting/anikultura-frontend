import { Crop, SeedStage } from './crop.type';

export class Verifier {
  name: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
}

export class FarmerReport {
  id: number;
  isVerified: boolean;
  verifier?: Verifier;
  estimatedProfit?: number;
  estimatedYieldAmount?: number;
  estimatedYieldDateEarliest?: string;
  estimatedYieldDateLatest?: string;
  crop: Crop;
  seedStage: SeedStage;
  createdAt: Date;
}

export class FarmerReportBody {
  farmerReport: {
    farmlandId: number;
    cropId: number;
    volumeKg: number;
  };
}
