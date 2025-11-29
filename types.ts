export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  IMAGING = 'IMAGING',
  RESEARCH = 'RESEARCH',
  LOCATIONS = 'LOCATIONS',
  ASSISTANT = 'ASSISTANT'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface QuickStat {
  label: string;
  value: string;
  trend?: string;
  color: string;
}
