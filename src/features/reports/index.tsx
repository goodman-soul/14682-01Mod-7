import React, { useState } from 'react';
import { BarChart3, TrendingUp, Filter, FileText } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { currentConfig } from '@/configs';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('本月');
  const [selectedReport, setSelectedReport] = useState('销售报表');

  const reportTypes = [
    { name: '销售报表', icon: BarChart3, description: '销售业绩和趋势分析' },
    { name: '用户分析', icon: TrendingUp, description: '用户行为和数据洞察' },
    { name: '财务报表', icon: FileText, description: '收入和支出详细报告' },
  ];

  const sampleData = [
    { month: '1月', sales: 65000, users: 1200, revenue: 78000 },
    { month: '2月', sales: 59000, users: 1100, revenue: 69000 },
    { month: '3月', sales: 80000, users: 1400, revenue: 92000 },
    { month: '4月', sales: 81000, users: 1350, revenue: 89000 },
    { month: '5月', sales: 56000, users: 1000, revenue: 67000 },
    { month: '6月', sales: 95000, users: 1600, revenue: 108000 },
  ];

  // 综合分析图配置
  const chartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    legend: {
      data: ['销售额', '用户数', '收入'],
    },
    xAxis: [
      {
        type: 'category',
        data: sampleData.map(d => d.month),
        axisPointer: {
          type: 'shadow',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '金额',
        min: 0,
        max: 120000,
        interval: 20000,
        axisLabel: {
          formatter: '¥{value}',
        },
      },
      {
        type: 'value',
        name: '人数',
        min: 0,
        max: 2000,
        interval: 400,
        axisLabel: {
          formatter: '{value} 人',
        },
      },
    ],
    series: [
      {
        name: '销售额',
        type: 'bar',
        tooltip: {
          valueFormatter: (value: number) => '¥' + value.toLocaleString(),
        },
        data: sampleData.map(d => d.sales),
        itemStyle: { color: '#3b82f6' },
      },
      {
        name: '收入',
        type: 'bar',
        tooltip: {
          valueFormatter: (value: number) => '¥' + value.toLocaleString(),
        },
        data: sampleData.map(d => d.revenue),
        itemStyle: { color: '#10b981' },
      },
      {
        name: '用户数',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: (value: number) => value.toLocaleString() + ' 人',
        },
        data: sampleData.map(d => d.users),
        itemStyle: { color: '#f59e0b' },
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{currentConfig.name} - 数据分析中心</h1>
          <p className="text-gray-600 mt-1">基于多维数据的深度洞察报告</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option>本周</option>
            <option>本月</option>
            <option>本季度</option>
            <option>本年</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTypes.map((report, index) => {
          const Icon = report.icon;
          return (
            <div 
              key={index}
              onClick={() => setSelectedReport(report.name)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedReport === report.name 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedReport === report.name ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon size={20} className={selectedReport === report.name ? 'text-blue-600' : 'text-gray-600'} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{selectedReport}分析图表</h2>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">高级筛选</span>
          </div>
        </div>

        <div className="h-96">
          <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">月份</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">销售额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">收入</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.month}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">¥{row.sales.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{row.users.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">¥{row.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;