import React from 'react';
import { Wrench, Clock } from 'lucide-react';
import { currentConfig } from '@/configs';
import { versionManager } from './versionManager';

interface MaintenancePageProps {
  title?: string;
  message?: string;
  showVersion?: boolean;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({
  title = '系统维护中',
  message = '我们正在对系统进行升级维护，请稍后再试。',
  showVersion = true,
}) => {
  const versionInfo = versionManager.getVersionInfo();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      style={{
        '--primary-color': currentConfig.theme.primaryColor,
      } as React.CSSProperties}
    >
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[var(--primary-color)] rounded-full flex items-center justify-center">
            <Wrench className="h-10 w-10 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h1>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
          <Clock size={16} />
          <span>预计很快恢复，给您带来不便敬请谅解</span>
        </div>

        {showVersion && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              当前版本: v{versionInfo.current}
              {versionInfo.isRolledBack && (
                <span className="ml-2 text-amber-600">(已回滚)</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
