import React from 'react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { currentConfig } from '@/configs';

const Dashboard: React.FC = () => {
  const stats = [
    { title: '总用户数', value: '12,543', change: '+12%', icon: Users, color: 'text-blue-600' },
    { title: '总收入', value: '¥89,432', change: '+8%', icon: DollarSign, color: 'text-green-600' },
    { title: '活跃用户', value: '3,421', change: '+15%', icon: Activity, color: 'text-purple-600' },
    { title: '增长率', value: '23.5%', change: '+5%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  // 用户增长趋势图配置
  const userGrowthOption = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210],
        areaStyle: {
          color: 'rgba(59, 130, 246, 0.1)',
        },
        itemStyle: {
          color: '#3b82f6',
        },
      },
    ],
  };

  // 收入分析图配置
  const revenueOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: ['广告', '订阅', '分成', '服务', '其他'],
    },
    series: [
      {
        name: '收入',
        type: 'bar',
        data: [18203, 23489, 29034, 104970, 131744],
        itemStyle: {
          color: '#10b981',
          borderRadius: [0, 4, 4, 0],
        },
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{currentConfig.name} - 业务概览</h1>
          <p className="text-gray-600 mt-1">实时监控您的业务核心指标</p>
        </div>
        <div className="text-sm text-gray-500">最后更新: 2025-02-08 14:30</div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} 较上月</p>
                </div>
                <div className={`${stat.color} bg-gray-50 p-3 rounded-full`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">用户增长趋势</h2>
          <div className="h-64">
            <ReactECharts option={userGrowthOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">收入分析 (按渠道)</h2>
          <div className="h-64">
            <ReactECharts option={revenueOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">最近活动</h2>
        <div className="space-y-4">
          {[
            { user: '张三', action: '完成了订单 #1234', time: '2分钟前', type: 'order' },
            { user: '李四', action: '注册了新账户', time: '5分钟前', type: 'user' },
            { user: '王五', action: '提交了反馈', time: '10分钟前', type: 'feedback' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">{activity.user[0]}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                <p className="text-sm text-gray-600">{activity.action}</p>
              </div>
              <div className="text-xs text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;