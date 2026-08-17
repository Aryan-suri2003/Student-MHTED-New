"use client";
import React from 'react';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';

interface DeltaIndicatorProps {
  deltaPercent?: number | null;
}

export const DeltaIndicator: React.FC<DeltaIndicatorProps> = ({ deltaPercent }) => {
  if (deltaPercent === null || deltaPercent === undefined) {
    return null;
  }

  const isPositive = deltaPercent > 0;
  const isNegative = deltaPercent < 0;
  const isNeutral = deltaPercent === 0;

  let colorClass = 'text-slate-500 bg-slate-100'; // neutral
  if (isPositive) colorClass = 'text-green-600 bg-green-50';
  if (isNegative) colorClass = 'text-red-600 bg-red-50';

  return (
    <div className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold ${colorClass}`}>
      {isPositive && <ChevronUp className="w-3 h-3" strokeWidth={3} />}
      {isNegative && <ChevronDown className="w-3 h-3" strokeWidth={3} />}
      {isNeutral && <Minus className="w-3 h-3" strokeWidth={3} />}
      <span>{Math.abs(deltaPercent).toFixed(1)}%</span>
    </div>
  );
};


