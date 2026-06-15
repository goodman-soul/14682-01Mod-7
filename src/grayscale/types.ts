export interface VersionInfo {
  current: string;
  previous: string | null;
  isRolledBack: boolean;
}

export interface MonitorConfig {
  errorThreshold: number;
  slowLoadThreshold: number;
  slowPageThreshold: number;
  checkInterval: number;
}

export interface ErrorStats {
  count: number;
  lastError: Error | null;
  lastErrorTime: number | null;
}

export interface PerformanceStats {
  pageLoadTime: number | null;
  slowPages: Record<string, number>;
}

export interface MonitorStatus {
  hasError: boolean;
  isSlow: boolean;
  shouldWarn: boolean;
}
