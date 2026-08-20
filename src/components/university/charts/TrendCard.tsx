"use client";
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TrendCardProps {
  title: string;
  value: string | number;
  deltaPercent?: number;
  icon: LucideIcon;
}

export const TrendCard: React.FC<TrendCardProps> = ({ title, value, deltaPercent, icon: Icon }) => {
  return (
    <div className="p-5 flex flex-col h-full relative overflow-hidden group min-h-[160px] bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-6 relative z-10">
        <h3 className="text-[12px] font-bold text-slate-600 uppercase tracking-widest leading-snug mt-1 max-w-[120px]">
          {title}
        </h3>
      </div>
      
      <div className="flex items-end justify-between relative z-10 mt-auto">
        <div className="text-[44px] font-extrabold text-slate-800 tracking-tight leading-none">
          {value}
        </div>
      </div>
    </div>
  );
};


