import { ClientConfig } from './types';

// 这些导入在生产构建时会被 Vite 的 define 和 tree-shaking 优化
// 只有当前被选中的客户配置会被最终打包
import { config as clientA } from './clients/client-a';
import { config as clientB } from './clients/client-b';

/**
 * 注入全局常量 __CLIENT_ID__
 * 这个常量在 vite.config.ts 中通过 define 定义
 */
declare const __CLIENT_ID__: string;

const configs: Record<string, ClientConfig> = {
  'client-a': clientA,
  'client-b': clientB,
};

// 获取当前客户端配置
// 在生产构建中，Vite 会根据 __CLIENT_ID__ 进行替换，并剔除未使用的分支
export const currentConfig: ClientConfig = configs[__CLIENT_ID__] || clientA;

/**
 * 功能开关检查器
 */
export const isFeatureEnabled = (featureKey: keyof ClientConfig['features']): boolean => {
  return !!currentConfig.features[featureKey];
};

/**
 * 模块检查器
 */
export const hasModule = (moduleName: string): boolean => {
  return currentConfig.modules.includes(moduleName);
};
