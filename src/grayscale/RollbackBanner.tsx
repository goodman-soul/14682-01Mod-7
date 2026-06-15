import React from 'react';
import { AlertTriangle, RotateCcw, X, ChevronDown, ChevronUp } from 'lucide-react';
import { versionManager } from './versionManager';
import { errorMonitor } from './errorMonitor';
import { MonitorStatus, ErrorStats, PerformanceStats } from './types';

interface RollbackBannerProps {
  status: MonitorStatus;
  errorStats: ErrorStats;
  performanceStats: PerformanceStats;
  onRollback: () => void;
  onDismiss: () => void;
}

export const RollbackBanner: React.FC<RollbackBannerProps> = ({
  status,
  errorStats,
  performanceStats,
  onRollback,
  onDismiss,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  if (!status.shouldWarn) return null;

  const versionInfo = versionManager.getVersionInfo();

  const handleRollback = () => {
    if (confirming) {
      onRollback();
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-full mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="text-sm text-amber-800">
              <span className="font-medium">
                {status.hasError ? '检测到页面异常错误' : '检测到页面加载缓慢'}
              </span>
              <span className="ml-2 text-amber-700">
                建议回滚到上一版本 (v{versionInfo.previous})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded transition-colors"
              title={expanded ? '收起详情' : '查看详情'}
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            <button
              onClick={handleRollback}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                confirming
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              <RotateCcw size={14} />
              {confirming ? '确认回滚' : '一键回滚'}
            </button>

            <button
              onClick={onDismiss}
              className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded transition-colors"
              title="关闭提示"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-amber-200 text-sm text-amber-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-amber-900 mb-1">错误统计</h4>
                <p>累计错误数: {errorStats.count}</p>
                {errorStats.lastError && (
                  <details className="mt-1">
                    <summary className="cursor-pointer text-amber-700">查看最后错误</summary>
                    <pre className="mt-1 p-2 bg-amber-100 rounded text-xs overflow-auto">
                      {errorStats.lastError.message}
                      {'\n'}
                      {errorStats.lastError.stack}
                    </pre>
                  </details>
                )}
              </div>

              <div>
                <h4 className="font-medium text-amber-900 mb-1">性能统计</h4>
                <p>首页加载时间: {performanceStats.pageLoadTime ? `${performanceStats.pageLoadTime.toFixed(0)}ms` : '未统计'}</p>
                <p>慢页面数: {Object.keys(performanceStats.slowPages).length}</p>
              </div>
            </div>

            <div className="mt-2 text-amber-700 text-xs">
              当前版本: v{versionInfo.current} | 上一版本: v{versionInfo.previous || '无'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
