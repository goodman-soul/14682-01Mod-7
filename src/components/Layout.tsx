import React, { useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { currentConfig, isFeatureEnabled } from '@/configs';
import { BarChart3, FileText, MessageSquare } from 'lucide-react';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/login');
  };

  // 动态生成菜单项
  const menuItems = [
    { name: '仪表盘', path: '/dashboard', icon: BarChart3 },
    ...(currentConfig.modules.includes('reports') ? [{ name: '报表分析', path: '/reports', icon: FileText }] : []),
    ...(currentConfig.modules.includes('social-feed') ? [{ name: '社交动态', path: '/social-feed', icon: MessageSquare }] : []),
  ];

  // 优化浏览器标题
  useEffect(() => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    if (currentItem) {
      document.title = `${currentItem.name} - ${currentConfig.name}`;
    } else {
      document.title = currentConfig.name;
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{
      '--primary-color': currentConfig.theme.primaryColor,
      '--border-radius': currentConfig.theme.borderRadius,
    } as React.CSSProperties}>
      {/* 顶部导航 */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--primary-color)] rounded-[var(--border-radius)] flex items-center justify-center text-white font-bold">
            {currentConfig.name.charAt(0)}
          </div>
          <span className="text-xl font-bold">{currentConfig.name}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            欢迎, {localStorage.getItem('username') || '用户'}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            退出登录
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* 侧边栏 */}
        <aside className="w-64 bg-gray-50 border-r p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-[var(--border-radius)] transition-colors ${
                  location.pathname === item.path
                    ? 'bg-[var(--primary-color)] text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 bg-white">
          <Outlet />
        </main>
      </div>

      {/* 底部信息 - 演示功能开关 */}
      {isFeatureEnabled('enableAnalytics') && (
        <footer className="bg-gray-900 text-white text-xs p-2 text-center">
          已启用实时分析系统 (Analytics Enabled)
        </footer>
      )}
    </div>
  );
};

export default Layout;