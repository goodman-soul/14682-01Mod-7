import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRouter } from './router';
import {
  ErrorBoundary,
  MaintenancePage,
  GrayscaleConsole,
  errorMonitor,
  versionManager,
  MonitorStatus,
  ErrorStats,
  PerformanceStats,
} from './grayscale';
import './index.css';

const RoutePerformanceTracker: React.FC = () => {
  const location = useLocation();
  const startTimeRef = React.useRef<number>(Date.now());

  useEffect(() => {
    const loadTime = Date.now() - startTimeRef.current;
    errorMonitor.recordPageLoad(location.pathname, loadTime);
    startTimeRef.current = Date.now();
  }, [location.pathname]);

  return null;
};

const AppContent: React.FC = () => {
  const [status, setStatus] = useState<MonitorStatus>({
    hasError: false,
    isSlow: false,
    shouldWarn: false,
  });
  const [errorStats, setErrorStats] = useState<ErrorStats>({
    count: 0,
    lastError: null,
    lastErrorTime: null,
  });
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    pageLoadTime: null,
    slowPages: {},
  });
  const [versionInfo, setVersionInfo] = useState(versionManager.getVersionInfo());
  const [isOperator, setIsOperator] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    errorMonitor.init();

    const updateStats = () => {
      setStatus(errorMonitor.getStatus());
      setErrorStats(errorMonitor.getErrorStats());
      setPerformanceStats(errorMonitor.getPerformanceStats());
    };

    updateStats();
    setIsOperator(versionManager.isOperator());
    setVersionInfo(versionManager.getVersionInfo());
    setReady(true);

    const unsubscribeMonitor = errorMonitor.subscribe(() => {
      updateStats();
    });

    const unsubscribeVersion = versionManager.subscribe(() => {
      setVersionInfo(versionManager.getVersionInfo());
      setIsOperator(versionManager.isOperator());
      updateStats();
    });

    return () => {
      unsubscribeMonitor();
      unsubscribeVersion();
      errorMonitor.destroy();
    };
  }, []);

  const handleRollback = useCallback(() => {
    versionManager.rollback();
  }, []);

  const handleDismiss = useCallback(() => {
    errorMonitor.dismissWarning();
  }, []);

  if (!ready) {
    return null;
  }

  const isRolledBack = versionManager.isRolledBack();
  const showMaintenance = status.hasError && !isOperator && !isRolledBack;

  if (showMaintenance) {
    return (
      <MaintenancePage
        status={status}
        errorStats={errorStats}
        performanceStats={performanceStats}
        onRollback={handleRollback}
      />
    );
  }

  return (
    <>
      <ErrorBoundary
        fallback={
          <MaintenancePage
            status={status}
            errorStats={errorStats}
            performanceStats={performanceStats}
            onRollback={handleRollback}
          />
        }
      >
        <RoutePerformanceTracker />
        <AppRouter
          monitorStatus={status}
          errorStats={errorStats}
          performanceStats={performanceStats}
          onRollback={handleRollback}
          onDismiss={handleDismiss}
        />
      </ErrorBoundary>
      <GrayscaleConsole
        status={status}
        errorStats={errorStats}
        performanceStats={performanceStats}
      />
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
