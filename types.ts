
export enum View {
  DASHBOARD = 'DASHBOARD',
  SETTINGS = 'SETTINGS',
  TERMINAL = 'TERMINAL',
  AI_CORE = 'AI_CORE'
}

export interface SystemConfig {
  javaHome: string;
  gradleHome: string;
  gradleVersion: string;
  javaVersion: string;
  jvmOptions: string;
  environmentVariables: Record<string, string>;
}

export interface SystemMetrics {
  cpu: number;
  ram: number;
  disk: number;
  uptime: string;
}

export interface ChatMessage {
  role: 'user' | 'aura';
  content: string;
  timestamp: Date;
}
