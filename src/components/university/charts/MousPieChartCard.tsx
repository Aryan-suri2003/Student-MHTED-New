"use client";
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export interface ProgressItem {
  label: string;
  value: number;
  deltaPercent: number;
  color: string;
}

interface MousPieChartCardProps {
  title: string;
  subtitle: string;
  total: number;
  totalLabel: string;
  totalDelta: number;
  items: ProgressItem[];
}

export const MousPieChartCard: React.FC<MousPieChartCardProps> = ({
  title,
  subtitle,
  total,
  totalLabel,
  totalDelta,
  items
}) => {
  return (
    <div className="p-5 flex flex-col h-full w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
        </div>
        <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
          Today <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="flex flex-col flex-1 items-center justify-center gap-2 relative">
        <div className="w-full h-[180px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                nameKey="label"
                stroke="none"
                cornerRadius={4}
              >
                {items.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', fontSize: '12px', fontWeight: 600, padding: '8px 12px' }}
                formatter={(val: any) => val.toLocaleString()}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-slate-900 leading-none">{total.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-medium mt-1">{totalLabel}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full mt-2">
          {items.map((item, idx) => {
            const isPositive = item.deltaPercent >= 0;
            return (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[12px] font-semibold text-slate-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-bold text-slate-900">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


