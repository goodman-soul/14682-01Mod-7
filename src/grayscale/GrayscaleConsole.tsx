import React, { useState } from 'react';
import { Settings, X, Bug, Clock, RotateCcw, RefreshCw, Trash2 } from 'lucide-react';
import { versionManager } from './versionManager';
import { errorMonitor } from './errorMonitor';
import { MonitorStatus, ErrorStats, PerformanceStats } from './types';

interface GrayscaleConsoleProps {
  status: MonitorStatus;
  errorStats: ErrorStats;
  performanceStats: PerformanceStats;
}

export const GrayscaleConsole: React.FC<GrayscaleConsoleProps> = ({
  status,
  errorStats,
  performanceStats,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const versionInfo = versionManager.getVersionInfo();
  const isOperator = versionManager.isOperator();

  if (!isOperator) return null;

  const handleSimulateError = () => {
    errorMonitor.recordError(new Error('模拟错误 - Grayscale test error'));
  };

  const handleSimulateSlowPage = () => {
    const path = window.location.pathname;
    errorMonitor.recordPageLoad(path, 5000);
  };

  const handleRollback = () => {
    versionManager.rollback();
  };

  const handleRollforward = () => {
    versionManager.rollforward();
  };

  const handleReset = () => {
    versionManager.reset();
    window.location.reload();
  };

  const handleClearErrors = () => {
    errorMonitor.reset();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="灰度控制台"
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">灰度运维控制台</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-64px)]">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">版本信息</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">当前版本</span>
                    <span className="font-mono font-medium">v{versionInfo.current}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">上一版本</span>
                    <span className="font-mono">v{versionInfo.previous || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">回滚状态</span>
                    <span className={versionInfo.isRolledBack ? 'text-amber-600 font-medium' : 'text-green-600'}>
                      {versionInfo.isRolledBack ? '已回滚' : '正常运行'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">监控状态</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">错误数</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      status.hasError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {errorStats.count}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">页面性能</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      status.isSlow ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {status.isSlow ? '缓慢' : '正常'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">慢页面数</span>
                    <span className="font-mono">{Object.keys(performanceStats.slowPages || {}).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">首屏加载</span>
                    <span className="font-mono">
                      {performanceStats.pageLoadTime ? `${performanceStats.pageLoadTime.toFixed(0)}ms` : '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">模拟测试</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleSimulateError}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <Bug size={16} />
                    模拟错误
                  </button>
                  <button
                    onClick={handleSimulateSlowPage}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium"
                  >
                    <Clock size={16} />
                    模拟慢页面
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">版本操作</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleRollback}
                    disabled={versionInfo.isRolledBack}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCcw size={16} />
                    回滚版本
                  </button>
                  <button
                    onClick={handleRollforward}
                    disabled={!versionInfo.isRolledBack}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={16} />
                    恢复版本
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">数据操作</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleClearErrors}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    清除错误
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <RefreshCw size={16} />
                    重置全部
                  </button>
                </div>
              </div>

              {errorStats.lastError && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">最后错误</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 font-mono overflow-auto max-h-32">
                    {errorStats.lastError.message}
                    {'\n'}
                    {errorStats.lastError.stack}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
