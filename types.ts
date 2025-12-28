
export enum DetectionCategory {
  HATE_SPEECH = 'Hate Speech',
  OFFENSIVE = 'Offensive Language',
  SAFE = 'Safe / Neutral',
  UNCERTAIN = 'Uncertain'
}

export interface AnalysisResult {
  id: string;
  text: string;
  category: DetectionCategory;
  confidence: number;
  explanation: string;
  timestamp: number;
  flaggedKeywords: string[];
}

export interface StatsData {
  name: string;
  value: number;
  color: string;
}
