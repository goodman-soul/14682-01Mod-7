import { MonitorConfig, ErrorStats, PerformanceStats, MonitorStatus } from './types';

const DEFAULT_CONFIG: MonitorConfig = {
  errorThreshold: 3,
  slowLoadThreshold: 2000,
  slowPageThreshold: 2,
  checkInterval: 60000,
};

const STORAGE_KEY = 'grayscale_monitor_data';
const DISMISSED_KEY = 'grayscale_warning_dismissed';

interface MonitorData {
  errorStats: ErrorStats;
  performanceStats: PerformanceStats;
  lastResetTime: number;
}

class ErrorMonitor {
  private config: MonitorConfig;
  private data: MonitorData;
  private listeners: Set<(status: MonitorStatus) => void> = new Set();
  private initialized = false;
  private warningDismissed = false;
  private rollbackSuppressed = false;

  constructor(config?: Partial<MonitorConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.data = this.loadData();
    this.warningDismissed = localStorage.getItem(DISMISSED_KEY) === 'true';
  }

  private loadData(): MonitorData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.lastResetTime < this.config.checkInterval) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }

    return this.createEmptyData();
  }

  private createEmptyData(): MonitorData {
    return {
      errorStats: {
        count: 0,
        lastError: null,
        lastErrorTime: null,
      },
      performanceStats: {
        pageLoadTime: null,
        slowPages: {},
      },
      lastResetTime: Date.now(),
    };
  }

  private saveData(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      // ignore
    }
  }

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);

    if (document.readyState === 'complete') {
      this.recordPageLoadTime();
    } else {
      window.addEventListener('load', this.recordPageLoadTime);
    }
  }

  destroy(): void {
    window.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.removeEventListener('load', this.recordPageLoadTime);
    this.initialized = false;
  }

  private handleError = (event: ErrorEvent): void => {
    if (this.rollbackSuppressed) return;
    this.recordError(event.error || new Error(event.message));
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    if (this.rollbackSuppressed) return;
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));
    this.recordError(error);
  };

  recordError(error: Error): void {
    if (this.rollbackSuppressed) return;

    this.data.errorStats.count++;
    this.data.errorStats.lastError = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } as Error;
    this.data.errorStats.lastErrorTime = Date.now();
    this.warningDismissed = false;
    localStorage.removeItem(DISMISSED_KEY);
    this.saveData();
    this.notifyListeners();
  }

  private recordPageLoadTime = (): void => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.startTime;
      this.data.performanceStats.pageLoadTime = loadTime;
      this.saveData();
      this.notifyListeners();
    }
  };

  recordPageLoad(pagePath: string, loadTime: number): void {
    if (this.rollbackSuppressed) return;

    this.data.performanceStats.slowPages[pagePath] = loadTime;
    this.saveData();
    this.notifyListeners();
  }

  getStatus(): MonitorStatus {
    const hasError = this.data.errorStats.count >= this.config.errorThreshold;
    const isSlow = this.checkIsSlow();

    return {
      hasError,
      isSlow,
      shouldWarn: (hasError || isSlow) && !this.warningDismissed && !this.rollbackSuppressed,
    };
  }

  private checkIsSlow(): boolean {
    const { pageLoadTime, slowPages } = this.data.performanceStats;

    if (pageLoadTime && pageLoadTime > this.config.slowLoadThreshold) {
      return true;
    }

    const slowPageCount = Object.values(slowPages).filter(
      (time) => time > this.config.slowLoadThreshold
    ).length;

    return slowPageCount >= this.config.slowPageThreshold;
  }

  getErrorStats(): ErrorStats {
    return { ...this.data.errorStats };
  }

  getPerformanceStats(): PerformanceStats {
    return { ...this.data.performanceStats };
  }

  subscribe(callback: (status: MonitorStatus) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    const status = this.getStatus();
    this.listeners.forEach((callback) => callback(status));
  }

  dismissWarning(): void {
    this.warningDismissed = true;
    localStorage.setItem(DISMISSED_KEY, 'true');
    this.notifyListeners();
  }

  reset(): void {
    this.data = this.createEmptyData();
    this.warningDismissed = false;
    localStorage.removeItem(DISMISSED_KEY);
    this.saveData();
    this.notifyListeners();
  }

  suppressOnRollback(): void {
    this.rollbackSuppressed = true;
    this.reset();
  }

  unsuppress(): void {
    this.rollbackSuppressed = false;
    this.reset();
  }

  isSuppressed(): boolean {
    return this.rollbackSuppressed;
  }

  getConfig(): MonitorConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<MonitorConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export const errorMonitor = new ErrorMonitor();
