import React from 'react';
import { CHART_COLORS } from './WaffleChart';
import { DeltaIndicator } from './DeltaIndicator';

export interface ComparisonPart {
  label: string;
  value: number;
  deltaPercent?: number | null;
}

interface ComparisonBarProps {
  title: string;
  left: ComparisonPart;
  right: ComparisonPart;
}

export const ComparisonBar: React.FC<ComparisonBarProps> = ({ title, left, right }) => {
  const total = left.value + right.value;
  const leftPct = total > 0 ? (left.value / total) * 100 : 50;
  const rightPct = total > 0 ? (right.value / total) * 100 : 50;

  return (
    <div className="p-4 flex flex-col h-full">
      <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight leading-none mb-6">{title}</h3>

      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="flex items-center w-full h-8 rounded-sm overflow-hidden">
          {/* Left Bar */}
          <div 
            className="h-full flex items-center justify-end px-3 text-white font-bold text-[13px] transition-all"
            style={{ width: `${leftPct}%`, backgroundColor: CHART_COLORS[0] }}
          >
            {leftPct > 10 && left.value.toLocaleString()}
          </div>
          
          {/* Divider */}
          <div className="h-full w-1 flex-shrink-0 bg-white z-10" />

          {/* Right Bar */}
          <div 
            className="h-full flex items-center justify-start px-3 text-white font-bold text-[13px] transition-all"
            style={{ width: `${rightPct}%`, backgroundColor: CHART_COLORS[1] }}
          >
            {rightPct > 10 && right.value.toLocaleString()}
          </div>
        </div>

        <div className="flex justify-between items-start">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[11px] font-medium text-slate-600 uppercase tracking-wider">{left.label}</span>
            <DeltaIndicator deltaPercent={left.deltaPercent} />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[11px] font-medium text-slate-600 uppercase tracking-wider">{right.label}</span>
            <DeltaIndicator deltaPercent={right.deltaPercent} />
          </div>
        </div>
      </div>
    </div>
  );
};
