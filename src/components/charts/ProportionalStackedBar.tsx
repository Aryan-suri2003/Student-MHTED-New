import React from 'react';
import { CHART_COLORS } from './WaffleChart';

interface ProportionalBarProps {
  value: number;
  max: number;
  colorIndex?: number;
}

export const ProportionalBar: React.FC<ProportionalBarProps> = ({ value, max, colorIndex = 0 }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const color = CHART_COLORS[colorIndex % CHART_COLORS.length];

  return (
    <div className="flex items-center justify-start gap-3 w-full min-w-[120px]">
      <span className="font-bold text-slate-700 min-w-[32px] text-right text-[12px]">
        {value > 0 ? value.toLocaleString() : '--'}
      </span>
      {value > 0 && (
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(100, Math.max(2, percentage))}%`, backgroundColor: color }}
          />
        </div>
      )}
    </div>
  );
};

interface StackedPart {
  label: string;
  value: number;
}

interface StackedBarSummaryProps {
  parts: StackedPart[];
}

export const StackedBarSummary: React.FC<StackedBarSummaryProps> = ({ parts }) => {
  const total = parts.reduce((acc, p) => acc + p.value, 0);

  return (
    <div className="w-full mb-6">
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
        Published Papers Share
      </div>
      {/* The Stacked Bar */}
      <div className="flex items-center w-full h-3 rounded-full overflow-hidden shadow-sm border border-slate-100 mb-3">
        {parts.map((p, i) => {
          const pct = total > 0 ? (p.value / total) * 100 : 0;
          if (pct === 0) return null;
          return (
            <div
              key={p.label}
              className="h-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              title={`${p.label}: ${p.value.toLocaleString()}`}
            />
          );
        })}
      </div>

      {/* The Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {parts.map((p, i) => (
          <div key={p.label} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span className="truncate max-w-[200px]" title={p.label}>{p.label}</span>
            <span className="font-bold text-slate-800 ml-0.5">{((p.value / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
