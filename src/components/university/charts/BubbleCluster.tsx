"use client";
import React from 'react';
import { CHART_COLORS } from './WaffleChart';
import { DeltaIndicator } from './DeltaIndicator';

export interface BubblePart {
  label: string;
  value: number;
  deltaPercent?: number | null;
}

interface BubbleClusterProps {
  title: string;
  total: number;
  totalDeltaPercent?: number | null;
  items: BubblePart[];
}

export const BubbleCluster: React.FC<BubbleClusterProps> = ({ title, total, totalDeltaPercent, items }) => {
  // We want area to be proportional to value. Area = pi * r^2 => r is proportional to sqrt(value)
  const maxVal = Math.max(...items.map(i => i.value), 1);
  const maxRadius = 40; // Max radius in px (80px diameter)
  
  return (
    <div className="bg-white rounded-[12px] p-4 border border-[#E3E7ED] shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight leading-none mb-1.5">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{total.toLocaleString()}</span>
            <DeltaIndicator deltaPercent={totalDeltaPercent} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-6">
        <div className="flex items-center justify-center gap-1 h-[100px] mt-2">
          {items.map((item, i) => {
            const r = (Math.sqrt(item.value) / Math.sqrt(maxVal)) * maxRadius;
            const size = Math.max(r * 2, 12); // min size 12px
            return (
              <div
                key={item.label}
                className="rounded-full flex items-center justify-center shadow-sm opacity-90 transition-all hover:opacity-100 hover:scale-105 cursor-default relative group"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: CHART_COLORS[i % CHART_COLORS.length]
                }}
              >
                {size > 30 && (
                   <span className="text-white font-bold text-[10px] px-1 truncate">{item.value > 1000 ? (item.value / 1000).toFixed(1) + 'k' : item.value}</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-y-2 mt-auto">
          {items.map((item, i) => (
            <div key={item.label} className="flex items-center justify-between gap-1.5 text-[11px] font-medium text-slate-600">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="truncate" title={item.label}>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{item.value.toLocaleString()}</span>
                {item.deltaPercent !== undefined && item.deltaPercent !== null && (
                  <div className="w-12 flex justify-end">
                    <DeltaIndicator deltaPercent={item.deltaPercent} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


