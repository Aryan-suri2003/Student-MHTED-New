"use client";

import React from "react";

export interface TooltipItem {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export interface ChartTooltipData {
  title: string;
  subtitle?: string;
  items: TooltipItem[];
}

interface ChartTooltipProps {
  data: ChartTooltipData | null;
  pos: { x: number; y: number } | null;
}

export default function ChartTooltip({ data, pos }: ChartTooltipProps) {
  if (!data || !pos) return null;

  // Compute position to avoid overflowing viewport edges
  const left = Math.min(typeof window !== "undefined" ? window.innerWidth - 300 : 800, Math.max(16, pos.x + 14));
  const top = Math.min(typeof window !== "undefined" ? window.innerHeight - 200 : 600, Math.max(16, pos.y + 14));

  return (
    <div
      className="fixed z-50 pointer-events-none transition-all duration-75 ease-out"
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      <div className="bg-gradient-to-br from-[#e0f2fe] via-[#dbeafe] to-[#bae6fd] text-slate-850 border-2 border-blue-400/90 rounded-2xl p-3.5 shadow-2xl max-w-sm animate-fadeIn">
        {/* Title & Subtitle */}
        <div className="pb-2 mb-2 border-b border-blue-300/80">
          <p className="font-extrabold text-blue-950 text-xs leading-snug">
            {data.title}
          </p>
          {data.subtitle && (
            <p className="text-[10px] text-blue-700 font-bold mt-0.5">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Item Rows */}
        <div className="space-y-1.5 text-xs">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="text-slate-600 font-bold text-[11px]">
                {item.label}:
              </span>
              <span
                className={`font-black text-[11px] ${
                  item.highlight
                    ? "text-blue-900 bg-white/90 px-1.5 py-0.5 rounded-md border border-blue-200 shadow-2xs"
                    : "text-blue-950"
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
