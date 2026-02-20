export enum View {
  DASHBOARD = 'DASHBOARD',
  STUDIO = 'STUDIO',
  GUIDE = 'GUIDE',
  TUTORIAL = 'TUTORIAL',
  VOICE_ASSISTANT = 'VOICE_ASSISTANT',
}

export interface GameProject {
  id: string;
  name: string;
  description: string;
  code: string;
  createdAt: number;
  lastModified: number;
  thumbnail?: string; // CSS color or pattern
  tags: string[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface GeneratorConfig {
  model: string;
  thinkingBudget?: number;
}