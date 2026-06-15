import React, { lazy, Suspense } from 'react';
import { RouteObject, useRoutes, Navigate } from 'react-router-dom';
import { currentConfig } from '@/configs';
import { AuthGuard } from '@/components';
import { MonitorStatus, ErrorStats, PerformanceStats } from '@/grayscale';

const Layout = lazy(() => import('@/components/Layout'));

const Dashboard = lazy(() => import('@/features/dashboard'));
const Reports = lazy(() => import('@/features/reports'));
const SocialFeed = lazy(() => import('@/features/social-feed'));
const Login = lazy(() => import('@/features/auth'));

interface AppRouterProps {
  monitorStatus: MonitorStatus;
  errorStats: ErrorStats;
  performanceStats: PerformanceStats;
  onRollback: () => void;
  onDismiss: () => void;
}

const moduleRoutes: Record<string, RouteObject> = {
  dashboard: {
    path: 'dashboard',
    element: <Dashboard />,
  },
  reports: {
    path: 'reports',
    element: <Reports />,
  },
  'social-feed': {
    path: 'social-feed',
    element: <SocialFeed />,
  },
};

export const AppRouter: React.FC<AppRouterProps> = ({
  monitorStatus,
  errorStats,
  performanceStats,
  onRollback,
  onDismiss,
}) => {
  const dynamicRoutes = currentConfig.modules
    .map((moduleName) => moduleRoutes[moduleName])
    .filter(Boolean);

  const routes: RouteObject[] = [
    {
      path: '/login',
      element: (
        <Suspense fallback={<div>Loading Login...</div>}>
          <Login onLogin={(username, password) => {
            console.log('Login attempt:', username, password);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            window.location.href = '/';
          }} />
        </Suspense>
      ),
    },
    {
      path: '/',
      element: (
        <Suspense fallback={<div>Loading Layout...</div>}>
          <AuthGuard>
            <Layout
              monitorStatus={monitorStatus}
              errorStats={errorStats}
              performanceStats={performanceStats}
              onRollback={onRollback}
              onDismiss={onDismiss}
            />
          </AuthGuard>
        </Suspense>
      ),
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        ...dynamicRoutes,
        { path: '*', element: <Navigate to="dashboard" replace /> },
      ],
    },
  ];

  return useRoutes(routes);
};
