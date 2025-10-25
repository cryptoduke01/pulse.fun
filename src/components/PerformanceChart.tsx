'use client';

import { PerformanceChartProps } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../lib/analysis';
import { format } from 'date-fns';

export function PerformanceChart({ data, height = 200, showTooltip = true }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-background/50 rounded-lg"
        style={{ height }}
      >
        <div className="text-text-secondary text-sm">No chart data available</div>
      </div>
    );
  }

  const formatXAxis = (tickItem: any) => {
    return format(new Date(tickItem), 'MMM dd');
  };

  const formatTooltip = (value: any, name: string) => {
    if (name === 'value') {
      return [formatCurrency(value), 'Portfolio Value'];
    }
    return [value, name];
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis}
            stroke="#a0a0a0"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
            stroke="#a0a0a0"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: '#151515',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                color: '#ffffff',
              }}
              labelStyle={{ color: '#a0a0a0' }}
              formatter={formatTooltip}
              labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy')}
            />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="url(#portfolioGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#8B5CF6' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
