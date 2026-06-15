import { execSync } from 'child_process';
import fs from 'fs';

const clients = ['client-a', 'client-b'];

console.log('开始执行多客户构建任务...');

clients.forEach(client => {
  console.log(`\n--- 正在构建客户: ${client} ---`);
  try {
    // 使用 cross-env 确保跨平台兼容
    execSync(`npx cross-env VITE_CLIENT_ID=${client} vite build --mode ${client}`, { stdio: 'inherit' });
    console.log(`[成功] 客户 ${client} 构建完成，产物位于 dist/${client}`);
  } catch (error) {
    console.error(`[错误] 客户 ${client} 构建失败:`, error.message);
    process.exit(1);
  }
});

console.log('\n所有客户构建任务已完成！');
