import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { CHART_COLORS } from './WaffleChart';

interface TrendDataPoint {
  year: number | string;
  value: number;
}

interface TrendSparklineProps {
  title: string;
  data: TrendDataPoint[];
  colorIndex?: number;
}

export const TrendSparkline: React.FC<TrendSparklineProps> = ({ title, data, colorIndex = 0 }) => {
  const color = CHART_COLORS[colorIndex % CHART_COLORS.length];
  
  if (!data || data.length === 0) return null;

  const firstPoint = data[0];
  const lastPoint = data[data.length - 1];
  
  const delta = lastPoint.value - firstPoint.value;
  const deltaPercent = firstPoint.value > 0 ? (delta / firstPoint.value) * 100 : 0;
  
  const isPositive = deltaPercent > 0;
  const isNegative = deltaPercent < 0;

  let badgeColor = 'text-slate-500 bg-slate-100';
  if (isPositive) badgeColor = 'text-green-600 bg-green-50';
  if (isNegative) badgeColor = 'text-red-600 bg-red-50';

  const minVal = Math.min(...data.map(d => d.value));
  const maxVal = Math.max(...data.map(d => d.value));
  const domain = [minVal * 0.8, maxVal * 1.2];

  return (
    <div className="p-4 flex flex-col h-full relative overflow-hidden group min-h-[140px]">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight leading-none mb-1.5">{title}</h3>
          <div className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
            {lastPoint.value.toLocaleString()}
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded text-[11px] font-semibold ${badgeColor}`}>
          {isPositive ? '+' : ''}{deltaPercent.toFixed(1)}% since {firstPoint.year}
        </div>
      </div>

      <div className="w-full absolute bottom-0 left-0 right-0 h-[65%]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${colorIndex}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.15}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <YAxis hide domain={domain} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color-${colorIndex})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* End point label on hover */}
      <div className="absolute right-2 bottom-2 flex flex-col items-end z-10 opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="text-[10px] font-bold text-slate-700 bg-white/90 px-1.5 py-0.5 rounded shadow-sm border border-slate-100">
           {lastPoint.year}: {lastPoint.value.toLocaleString()}
         </div>
      </div>
    </div>
  );
};
