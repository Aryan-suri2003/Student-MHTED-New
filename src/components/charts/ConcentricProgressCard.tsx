import React from 'react';
import { LucideIcon, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

export interface ProgressItem {
  label: string;
  value: number;
  deltaPercent: number;
  icon: LucideIcon;
  color: string;
}

interface ConcentricProgressCardProps {
  title: string;
  subtitle: string;
  total: number;
  totalLabel: string;
  totalDelta: number;
  items: ProgressItem[];
}

export const ConcentricProgressCard: React.FC<ConcentricProgressCardProps> = ({
  title,
  subtitle,
  total,
  totalLabel,
  totalDelta,
  items
}) => {
  const SVG_SIZE = 240;
  const CENTER = SVG_SIZE / 2;
  const STROKE_WIDTH = 14;
  const GAP_FRACTION = 0.25;
  const START_ANGLE = 45; // Starts at bottom-right, goes clockwise, gap on the right
  
  // Find max value to determine the 100% fill length
  const maxVal = Math.max(...items.map(i => i.value));

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100/50 flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
          Today <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Chart & Total Section */}
      <div className="flex items-center relative mb-8">
        {/* SVG Chart */}
        <div className="w-[180px] h-[180px] flex-shrink-0 -ml-4">
          <svg width="100%" height="100%" viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
            {items.map((item, idx) => {
              const radius = 96 - (idx * 26);
              const circumference = 2 * Math.PI * radius;
              const trackLength = circumference * (1 - GAP_FRACTION);
              const fillLength = maxVal > 0 ? trackLength * (item.value / maxVal) : 0;
              
              return (
                <g key={idx}>
                  {/* Background Track */}
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={radius}
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth={STROKE_WIDTH}
                    strokeLinecap="round"
                    strokeDasharray={`${trackLength} ${circumference}`}
                    strokeDashoffset="0"
                    transform={`rotate(${START_ANGLE} ${CENTER} ${CENTER})`}
                  />
                  {/* Filled Track */}
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth={STROKE_WIDTH}
                    strokeLinecap="round"
                    strokeDasharray={`${fillLength} ${circumference}`}
                    strokeDashoffset="0"
                    transform={`rotate(${START_ANGLE} ${CENTER} ${CENTER})`}
                    className="transition-all duration-1000 ease-out"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Total Stats embedded perfectly into the gap area */}
        <div className="absolute left-[160px] top-1/2 -translate-y-1/2 flex flex-col justify-center">
          <div className="text-[32px] font-extrabold text-slate-900 leading-none tracking-tight">
            {total.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 font-semibold tracking-wide mt-1.5">
            {totalLabel}
          </div>
          <div className={`mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold w-max ${
            totalDelta >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {totalDelta >= 0 ? '+' : ''}{totalDelta}%
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="flex flex-col gap-3.5 mt-auto">
        {items.map((item, idx) => {
          const isPositive = item.deltaPercent >= 0;
          return (
            <div key={idx} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-slate-100 transition-colors">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-900">
                  {item.value.toLocaleString()}
                </span>
                <div className={`flex items-center justify-center min-w-[60px] px-2 py-1 rounded text-[11px] font-bold ${
                  isPositive ? 'bg-emerald-100/80 text-emerald-700' : 'bg-rose-100/80 text-rose-700'
                }`}>
                  {isPositive ? '+' : ''}{item.deltaPercent}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
