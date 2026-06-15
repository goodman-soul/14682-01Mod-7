import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { ErrorBoundary, MaintenancePage, errorMonitor, versionManager } from './grayscale';
import './index.css';

const App: React.FC = () => {
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [monitorReady, setMonitorReady] = useState(false);

  useEffect(() => {
    errorMonitor.init();

    const checkStatus = () => {
      const status = errorMonitor.getStatus();
      const isRolledBack = versionManager.isRolledBack();

      if (status.hasError && !versionManager.isOperator() && !isRolledBack) {
        setShowMaintenance(true);
      } else {
        setShowMaintenance(false);
      }
    };

    checkStatus();
    setMonitorReady(true);

    const unsubscribe = errorMonitor.subscribe(() => {
      checkStatus();
    });

    return () => {
      unsubscribe();
      errorMonitor.destroy();
    };
  }, []);

  if (!monitorReady) {
    return null;
  }

  if (showMaintenance) {
    return <MaintenancePage />;
  }

  return (
    <ErrorBoundary
      fallback={<MaintenancePage />}
    >
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
