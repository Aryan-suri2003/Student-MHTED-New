"use client";
import React, { useEffect, useRef, useState } from 'react';


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

// Gradient definitions: [from, to] for left and right
const LEFT_GRADIENT  = { from: '#6366f1', to: '#8b5cf6' }; // indigo → violet
const RIGHT_GRADIENT = { from: '#ec4899', to: '#f43f5e' }; // pink → rose

const LEFT_LIGHT   = '#ede9fe';
const RIGHT_LIGHT  = '#fce7f3';
const LEFT_TEXT    = '#4f46e5';
const RIGHT_TEXT   = '#db2777';

function useAnimatedValue(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

const RadialRing: React.FC<{ pct: number; color: string; bgColor: string; size?: number }> = ({
  pct, color, bgColor, size = 52,
}) => {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="24" cy="24" r={r} fill="none" stroke={bgColor} strokeWidth="5" />
      <circle
        cx="24" cy="24" r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s cubic-bezier(.4,0,.2,1)' }}
      />
    </svg>
  );
};

export const ComparisonBar: React.FC<ComparisonBarProps> = ({ title, left, right }) => {
  const total = left.value + right.value;
  const leftPct  = total > 0 ? (left.value / total) * 100 : 50;
  const rightPct = total > 0 ? (right.value / total) * 100 : 50;

  const animLeft  = useAnimatedValue(left.value);
  const animRight = useAnimatedValue(right.value);
  const animLeftPct  = useAnimatedValue(Math.round(leftPct));
  const animRightPct = useAnimatedValue(Math.round(rightPct));

  const gradLeftId  = 'cbar-grad-left';
  const gradRightId = 'cbar-grad-right';

  return (
    <div className="p-5 flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative">

      {/* Subtle background blobs */}
      <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full opacity-[0.07]"
        style={{ background: `radial-gradient(circle, ${LEFT_GRADIENT.from}, transparent)` }} />
      <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full opacity-[0.07]"
        style={{ background: `radial-gradient(circle, ${RIGHT_GRADIENT.to}, transparent)` }} />

      {/* Title */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <h3 className="text-[13px] font-bold text-slate-800 tracking-tight leading-none">{title}</h3>
        <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
          Total: {total.toLocaleString()}
        </span>
      </div>

      {/* Segmented gradient bar */}
      <div className="relative z-10 mb-4">
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id={gradLeftId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={LEFT_GRADIENT.from} />
              <stop offset="100%" stopColor={LEFT_GRADIENT.to} />
            </linearGradient>
            <linearGradient id={gradRightId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={RIGHT_GRADIENT.from} />
              <stop offset="100%" stopColor={RIGHT_GRADIENT.to} />
            </linearGradient>
          </defs>
        </svg>

        <div className="flex w-full h-9 rounded-xl overflow-hidden gap-0.5">
          {/* Left segment */}
          <div
            className="h-full flex items-center justify-end px-3 font-bold text-white text-[13px] transition-all duration-1000"
            style={{
              width: `${leftPct}%`,
              background: `linear-gradient(90deg, ${LEFT_GRADIENT.from}, ${LEFT_GRADIENT.to})`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2)`,
            }}
          >
            {leftPct > 18 && <span className="drop-shadow-sm">{animLeft.toLocaleString()}</span>}
          </div>

          {/* Right segment */}
          <div
            className="h-full flex items-center justify-start px-3 font-bold text-white text-[13px] transition-all duration-1000"
            style={{
              width: `${rightPct}%`,
              background: `linear-gradient(90deg, ${RIGHT_GRADIENT.from}, ${RIGHT_GRADIENT.to})`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2)`,
            }}
          >
            {rightPct > 18 && <span className="drop-shadow-sm">{animRight.toLocaleString()}</span>}
          </div>
        </div>

        {/* Tick marks */}
        <div className="flex justify-between mt-1 px-0.5">
          <span className="text-[10px] text-slate-400 font-medium">0%</span>
          <span className="text-[10px] text-slate-400 font-medium">50%</span>
          <span className="text-[10px] text-slate-400 font-medium">100%</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="flex gap-3 relative z-10 mt-auto">

        {/* Left stat card */}
        <div
          className="flex-1 rounded-xl p-3 flex items-center gap-3 border"
          style={{ backgroundColor: LEFT_LIGHT, borderColor: `${LEFT_GRADIENT.to}30` }}
        >
          <div className="shrink-0">
            <RadialRing pct={Math.round(leftPct)} color={LEFT_GRADIENT.from} bgColor={`${LEFT_GRADIENT.from}25`} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider truncate" style={{ color: LEFT_TEXT }}>
              {left.label}
            </p>
            <p className="text-xl font-extrabold leading-tight" style={{ color: LEFT_TEXT }}>
              {animLeft.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-bold" style={{ color: LEFT_TEXT }}>
                {animLeftPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Right stat card */}
        <div
          className="flex-1 rounded-xl p-3 flex items-center gap-3 border"
          style={{ backgroundColor: RIGHT_LIGHT, borderColor: `${RIGHT_GRADIENT.to}30` }}
        >
          <div className="shrink-0">
            <RadialRing pct={Math.round(rightPct)} color={RIGHT_GRADIENT.from} bgColor={`${RIGHT_GRADIENT.from}25`} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider truncate" style={{ color: RIGHT_TEXT }}>
              {right.label}
            </p>
            <p className="text-xl font-extrabold leading-tight" style={{ color: RIGHT_TEXT }}>
              {animRight.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-bold" style={{ color: RIGHT_TEXT }}>
                {animRightPct}%
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
