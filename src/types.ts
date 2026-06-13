export interface Indicator {
  id: string;
  name: string;
  category: "visual" | "audio" | "metadata" | "ai";
  severity: "low" | "medium" | "high";
  description: string;
  status: "passed" | "warning" | "failed";
}

export interface AnalysisSection {
  title: string;
  rating: "good" | "warning" | "critical";
  text: string;
}

export interface FactCheck {
  query: string;
  claimVerdict: "TRUE" | "FALSE" | "MISLEADING";
  explanation: string;
  source: string;
  confidence: number;
}

export interface EvidenceReport {
  forensicHash: string;
  analyzedAt: string;
  fileSignature: string;
  fingerprintRisk: string;
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  uploadedAt: string;
  verdict: "REAL" | "DEEPFAKE" | "SUSPICIOUS";
  trustScore: number;
  confidence: number;
  summary: string;
  faceMatchScore: number | null;
  audioSplicingDetected: boolean | null;
  metadataManipulated: boolean;
  indicators: Indicator[];
  analysisSections: AnalysisSection[];
  factCheck: FactCheck | null;
  evidenceReport: EvidenceReport;
  isMock?: boolean;
  errorMsg?: string;
}

export interface ActiveScanPhase {
  id: number;
  label: string;
  duration: number; // millisecond simulation duration
  status: "pending" | "scanning" | "completed";
}
