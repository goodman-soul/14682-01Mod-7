import { VersionInfo } from './types';

const STORAGE_KEY = 'grayscale_version_info';
const ROLLBACK_FLAG = 'grayscale_rolled_back';
const OPERATOR_FLAG = 'grayscale_operator';

const DEFAULT_CURRENT_VERSION = '1.0.0';
const DEFAULT_PREVIOUS_VERSION = '0.9.0';

export const versionManager = {
  getVersionInfo(): VersionInfo {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // ignore
    }

    const info: VersionInfo = {
      current: DEFAULT_CURRENT_VERSION,
      previous: DEFAULT_PREVIOUS_VERSION,
      isRolledBack: false,
    };

    this.saveVersionInfo(info);
    return info;
  },

  saveVersionInfo(info: VersionInfo): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    } catch (e) {
      // ignore
    }
  },

  rollback(): boolean {
    const info = this.getVersionInfo();
    if (!info.previous || info.isRolledBack) {
      return false;
    }

    const rolledBackInfo: VersionInfo = {
      current: info.previous,
      previous: info.current,
      isRolledBack: true,
    };

    this.saveVersionInfo(rolledBackInfo);
    localStorage.setItem(ROLLBACK_FLAG, 'true');
    return true;
  },

  rollforward(): boolean {
    const info = this.getVersionInfo();
    if (!info.isRolledBack || !info.previous) {
      return false;
    }

    const rolledForwardInfo: VersionInfo = {
      current: info.previous,
      previous: info.current,
      isRolledBack: false,
    };

    this.saveVersionInfo(rolledForwardInfo);
    localStorage.removeItem(ROLLBACK_FLAG);
    return true;
  },

  isRolledBack(): boolean {
    return localStorage.getItem(ROLLBACK_FLAG) === 'true';
  },

  isOperator(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('operator') === '1') {
      localStorage.setItem(OPERATOR_FLAG, 'true');
      return true;
    }
    return localStorage.getItem(OPERATOR_FLAG) === 'true';
  },

  setOperator(value: boolean): void {
    if (value) {
      localStorage.setItem(OPERATOR_FLAG, 'true');
    } else {
      localStorage.removeItem(OPERATOR_FLAG);
    }
  },

  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ROLLBACK_FLAG);
    localStorage.removeItem(OPERATOR_FLAG);
  },
};
