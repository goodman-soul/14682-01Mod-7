# Multi-Tenant Frontend (多租户前端框架)

这是一个基于 React 18, Vite 和 TypeScript 构建的高性能多租户（Multi-tenant）前端项目模板。它允许开发者为不同的客户（租户）定制功能、样式和配置，并生成独立的构建产物。

## 🌟 核心特性

- **多客户配置驱动**: 通过环境变量和配置文件轻松管理不同客户的差异化需求。
- **条件编译 & Tree Shaking**: 利用 Vite 的 `define` 功能，在构建时根据 `__CLIENT_ID__` 自动剔除无关代码。
- **动态主题定制**: 每个客户可以拥有独立的颜色、Logo 和 UI 风格。
- **一键多客户构建**: 自动化脚本支持一次性构建所有客户的生产环境产物。

## 🚀 快速开始

### 开发环境运行

```bash
# 运行 Client A
npm run dev -- --mode client-a

# 运行 Client B
npm run dev -- --mode client-b
```

#### 测试账号信息

| 用户名 | 密码 | 角色 |
| :--- | :--- | :--- |
| `demo@example.com` | `demo123` | 演示账户 |

注意：项目使用 `cross-env` 在命令行或 `.env` 文件中注入 `VITE_CLIENT_ID`。

### 生产环境构建

```bash
# 构建特定客户 (例如 Client A)
npm run build:client-a

# 一键构建所有客户
npm run build:all
```

构建产物将存放在 `dist/[client-id]` 目录下。

## 🛠️ 技术栈

- **核心框架**: React 18 (Hooks, Suspense, Lazy)
- **构建工具**: Vite 5 (Define, Tree Shaking, Multi-mode)
- **路由管理**: React Router 6 (Dynamic Routing)
- **样式方案**: Tailwind CSS + CSS Variables (Theme Customization)
- **图标库**: Lucide React
- **图表库**: ECharts + echarts-for-react

## 🏗️ 核心架构详述

### 1. 条件编译 (Conditional Compilation)

在 `vite.config.ts` 中，我们利用 `define` 插件注入了 `__CLIENT_ID__` 常量。Vite 在构建过程中会将代码中的 `__CLIENT_ID__` 替换为字面量字符串，配合 Tree Shaking，未被引用的客户配置和代码会被物理删除，确保产物精简。

### 2. 动态主题定制 (Theming)

通过在根组件注入 CSS 变量实现主题切换：
```tsx
<div style={{
  '--primary-color': currentConfig.theme.primaryColor,
  '--border-radius': currentConfig.theme.borderRadius,
}}>
```
在 Tailwind 中通过配置文件引用这些变量，实现样式的动态响应。

### 3. 动态路由加载 (Dynamic Routing)

路由表根据 `currentConfig.modules` 动态生成。只有配置中声明的模块才会被注册到路由系统中，增强了系统的安全性与灵活性。

## 📝 如何新增一个客户？

1. **创建环境变量文件**: 复制 `.env.client-a` 为 `.env.client-new`，修改 `VITE_CLIENT_ID=client-new`。
2. **创建配置文件**: 在 `src/configs/clients/` 下创建 `client-new.ts`，定义该客户的功能开关、模块和主题。
3. **注册配置**: 在 `src/configs/index.ts` 中导入并将其加入 `configs` 映射表。
4. **添加构建脚本**: 在 `package.json` 中添加 `"build:client-new": "cross-env VITE_CLIENT_ID=client-new vite build --mode client-new"`。
5. **更新自动化脚本**: 修改 `scripts/build-all.js` 中的 `clients` 数组。

## 📂 目录结构说明

```text
.
├── scripts/                # 自定义构建脚本
│   └── build-all.js        # 一键构建所有客户脚本
├── src/
│   ├── components/         # 公共 UI 组件
│   │   └── Layout.tsx      # 基础布局组件
│   ├── configs/            # 多客户配置中心
│   │   ├── clients/        # 各个客户的具体配置
│   │   │   ├── client-a.ts
│   │   │   └── client-b.ts
│   │   ├── index.ts        # 配置导出入口与逻辑处理
│   │   └── types.ts        # 配置项的 TypeScript 类型定义
│   ├── features/           # 业务功能模块 (按特性划分)
│   │   ├── dashboard/      # 控制面板模块
│   │   ├── reports/        # 报表模块
│   │   └── social-feed/    # 社交模块
│   ├── router/             # 路由配置 (基于配置动态加载)
│   ├── App.tsx             # 根组件
│   ├── main.tsx            # 入口文件
│   └── index.css           # 全局样式
├── .env.client-a           # 客户 A 的环境变量
├── .env.client-b           # 客户 B 的环境变量
├── index.html              # HTML 模板
├── package.json            # 项目依赖与脚本
├── tailwind.config.js      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
└── vite.config.ts          # Vite 配置文件
```

## 关键代码示例 (TypeScript)

### 客户配置定义 (`src/configs/types.ts`)

```typescript
export interface ClientConfig {
  id: string;
  name: string;
  features: {
    enableAnalytics: boolean;
    enableSocialSharing: boolean;
    [key: string]: boolean;
  };
  modules: string[];
  theme: {
    primaryColor: string;
    logoUrl: string;
    borderRadius: string;
  };
}
```

### 运行时配置获取 (`src/configs/index.ts`)

利用 Vite 注入的全局常量 `__CLIENT_ID__` 实现条件编译：

```typescript
import { config as clientA } from './clients/client-a';
import { config as clientB } from './clients/client-b';

declare const __CLIENT_ID__: string;

const configs: Record<string, ClientConfig> = {
  'client-a': clientA,
  'client-b': clientB,
};

// 在构建时，非当前客户的配置会被 Tree Shaking 剔除
export const currentConfig = configs[__CLIENT_ID__] || clientA;
```

## ⚙️ Vite 配置示例 (`vite.config.ts`)

通过 `define` 注入构建时常量，并动态设置 `outDir`：

```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const clientId = env.VITE_CLIENT_ID || 'default';

  return {
    plugins: [react()],
    define: {
      __CLIENT_ID__: JSON.stringify(clientId), // 注入全局常量
    },
    build: {
      outDir: `dist/${clientId}`, // 为每个客户生成独立的输出目录
    },
    // ... 其他配置
  };
});
```

## 🌐 环境变量配置

每个客户对应一个 `.env` 文件，例如 `.env.client-a`：

```env
VITE_CLIENT_ID=client-a
VITE_APP_TITLE=企业客户 A - 定制系统
```

## 📦 构建脚本示例

### package.json 脚本

```json
"scripts": {
  "build:client-a": "cross-env VITE_CLIENT_ID=client-a vite build --mode client-a",
  "build:client-b": "cross-env VITE_CLIENT_ID=client-b vite build --mode client-b",
  "build:all": "node scripts/build-all.js"
}
```

### 批量构建脚本 (`scripts/build-all.js`)

```javascript
const { execSync } = require('child_process');
const clients = ['client-a', 'client-b'];

clients.forEach(client => {
  console.log(`正在构建客户: ${client}...`);
  execSync(`npx cross-env VITE_CLIENT_ID=${client} vite build --mode ${client}`, { stdio: 'inherit' });
});
```

## 🚀 快速开始

1. **安装依赖**: `npm install`
2. **启动开发服务器**: `npm run dev`
3. **构建特定客户**: `npm run build:client-a`
4. **构建所有客户**: `npm run build:all`
