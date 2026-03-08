
export interface FlaggedPosting {
  title: string;
  company: string;
  address: string;
  salary: string;
  postedDaysAgo: number;
  isVerified: boolean;
  isNewBusiness: boolean;
  aiDisclosureStatus: 'Compliant' | 'Non-Compliant' | 'Missing';
  salaryTransparencyStatus: 'Compliant' | 'Anomaly Detected';
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  indicators: string[]; // Replacing "smokingGuns" for legal compliance
  physicalAuditInstructions: string;
  cafcBlock: string;
  forensicAnalysis: string; // Forensic opinion based on public records
}

export interface ScanResult {
  cmaName: string;
  timestamp: string;
  totalMarketVolume: number; // Total postings in past 90 days
  reviewedPostingsCount: number; // Total postings actually audited
  flaggedPostings: FlaggedPosting[];
  summary: string;
}

export interface CityData {
  city: string;
  province: string;
  zoningLink: string;
  registryLink: string;
}
