"use client";
import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface TrendCardProps {
  title: string;
  value: string | number;
  deltaPercent: number;
  icon: LucideIcon;
}

export const TrendCard: React.FC<TrendCardProps> = ({ title, value, deltaPercent, icon: Icon }) => {
  return (
    <div className="p-5 flex flex-col h-full relative overflow-hidden group min-h-[160px]">
      {/* Background SVG Line */}
      <svg 
        className="absolute bottom-0 left-0 w-full h-[60%] pointer-events-none" 
        preserveAspectRatio="none" 
        viewBox="0 0 100 100"
      >
        <path 
          d="M -10,100 Q 40,80 110,40" 
          fill="none" 
          stroke="#bbf7d0" 
          strokeWidth="3" 
          vectorEffect="non-scaling-stroke" 
          strokeLinecap="round" 
        />
      </svg>
      
      <div className="flex items-start gap-4 mb-6 relative z-10">
        <h3 className="text-[12px] font-bold text-slate-600 uppercase tracking-widest leading-snug mt-1 max-w-[120px]">
          {title}
        </h3>
      </div>
      
      <div className="flex items-end justify-between relative z-10 mt-auto">
        <div className="text-[44px] font-extrabold text-slate-800 tracking-tight leading-none">
          {value}
        </div>
        <div className="flex items-center gap-1 bg-emerald-50/80 px-2.5 py-1 rounded-md text-emerald-600 font-bold text-[13px] mb-1">
          <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
          {deltaPercent}%
        </div>
      </div>
    </div>
  );
};


