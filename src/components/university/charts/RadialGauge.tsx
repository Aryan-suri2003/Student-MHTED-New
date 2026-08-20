"use client";
import React from 'react';
import { CHART_COLORS } from './WaffleChart';


interface RadialGaugeProps {
  title: string;
  value: number;
  total: number;
  deltaPercent?: number | null;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({ title, value, total, deltaPercent }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="p-4 flex flex-col h-full items-center justify-between gap-4">
      <div className="w-full flex justify-between items-start">
        <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight leading-none text-left">{title}</h3>

      </div>

      <div className="relative w-24 h-24 flex items-center justify-center mt-2">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="#f1f5f9"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Foreground circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={CHART_COLORS[0]}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-slate-900 tracking-tight leading-none mt-1">{Math.round(percentage)}%</span>
        </div>
      </div>

      <div className="mt-2 text-[11px] font-medium text-slate-500 text-center uppercase tracking-wider">
        <span className="text-slate-800 font-bold">{value.toLocaleString()}</span> out of {total.toLocaleString()}
      </div>
    </div>
  );
};


