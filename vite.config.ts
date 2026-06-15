import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载当前模式下的环境变量
  const env = loadEnv(mode, process.cwd());
  const clientId = env.VITE_CLIENT_ID || 'default';

  console.log(`Building for client: ${clientId}`);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      // 输出到客户专属目录
      outDir: `dist/${clientId}`,
      // 这里的逻辑可以进一步优化，比如只包含特定客户的资源
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
    // 通过 define 注入全局常量，用于条件编译
    define: {
      __CLIENT_ID__: JSON.stringify(clientId),
    },
  };
});
