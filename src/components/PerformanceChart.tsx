'use client';

import { PerformanceChartProps } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../lib/analysis';
import { format } from 'date-fns';
import { BarChart3, Loader2 } from 'lucide-react';

export function PerformanceChart({ data, height = 200, showTooltip = true, isLoading = false }: PerformanceChartProps & { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center bg-background/50 rounded-lg animate-pulse"
        style={{ height }}
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-2 animate-spin" />
          <div className="text-text-secondary text-sm">Loading chart...</div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-background/50 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <BarChart3 className="w-12 h-12 mb-2 text-text-secondary mx-auto" />
          <div className="text-text-secondary text-sm">No chart data available</div>
        </div>
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
