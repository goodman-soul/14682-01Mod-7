import React, { useState } from 'react';
import { Wrench, Clock, RotateCcw, Shield, ArrowRight } from 'lucide-react';
import { currentConfig } from '@/configs';
import { versionManager } from './versionManager';
import { errorMonitor } from './errorMonitor';
import { MonitorStatus, ErrorStats, PerformanceStats } from './types';

interface MaintenancePageProps {
  title?: string;
  message?: string;
  showVersion?: boolean;
  status?: MonitorStatus;
  errorStats?: ErrorStats;
  performanceStats?: PerformanceStats;
  onRollback?: () => void;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({
  title = '系统维护中',
  message = '我们正在对系统进行升级维护，请稍后再试。',
  showVersion = true,
  status,
  errorStats,
  performanceStats,
  onRollback,
}) => {
  const versionInfo = versionManager.getVersionInfo();
  const isOperator = versionManager.isOperator();
  const [showOperatorPanel, setShowOperatorPanel] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleRollback = () => {
    if (confirming) {
      if (onRollback) {
        onRollback();
      } else {
        versionManager.rollback();
      }
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  const handleEnterOperator = () => {
    versionManager.setOperator(true);
    setShowOperatorPanel(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      style={{
        '--primary-color': currentConfig.theme.primaryColor,
      } as React.CSSProperties}
    >
      <div className="max-w-md w-full">
        <div className="text-center">
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
        </div>

        {(isOperator || showOperatorPanel) && versionInfo.previous && (
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-amber-600" />
              <span className="font-medium text-amber-800">运维人员控制台</span>
            </div>

            <p className="text-sm text-amber-700 mb-3">
              检测到异常，您可以回滚到上一版本以恢复服务。
            </p>

            {status && errorStats && (
              <div className="text-xs text-amber-600 mb-3 space-y-1">
                <p>错误数: {errorStats.count}</p>
                {performanceStats && (
                  <p>慢页面数: {Object.keys(performanceStats.slowPages || {}).length}</p>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-xs text-amber-600">当前版本</p>
                <p className="text-sm font-medium text-amber-800">v{versionInfo.current}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-amber-500" />
              <div className="flex-1">
                <p className="text-xs text-amber-600">回滚到</p>
                <p className="text-sm font-medium text-amber-800">v{versionInfo.previous}</p>
              </div>
            </div>

            <button
              onClick={handleRollback}
              className={`mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                confirming
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              <RotateCcw size={16} />
              {confirming ? '确认回滚到上一版本' : '一键回滚恢复服务'}
            </button>

            {confirming && (
              <p className="mt-2 text-xs text-red-600 text-center">
                再次点击确认回滚，系统将恢复到 v{versionInfo.previous}
              </p>
            )}
          </div>
        )}

        {!isOperator && !showOperatorPanel && (
          <div className="mt-6 text-center">
            <button
              onClick={handleEnterOperator}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              我是运维人员
            </button>
          </div>
        )}

        {showVersion && (
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
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
