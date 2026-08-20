"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  GraduationCap,
  IndianRupee,
  BookOpen,
  Filter,
  X,
  MoveVertical,
  CheckCircle2,
  TrendingUp,
  Search,
  Building2,
  Award,
  Layers,
  Sparkles,
  ShieldCheck,
  Cpu,
  FlaskConical,
  Briefcase,
  Palette,
  Pill,
  BarChart3,
  Stethoscope,
  ChevronRight,
  Trophy,
  Maximize2,
} from "lucide-react";
import { GlobalFilterState } from "@/components/Filters";
import ChartTooltip, { ChartTooltipData } from "@/components/ChartTooltip";
import { PieChart3DModal, Slice } from "./PieChart3DModal";

// ─── Interactive Doughnut Chart Component ──────────────────────────────────────
interface DoughnutChartProps {
  slices: Slice[];
  totalLabel: string;
  totalValue: string;
  title?: string;
  onExpand?: (title: string, slices: Slice[]) => void;
  onTooltip?: (data: ChartTooltipData | null, pos?: { x: number; y: number } | null) => void;
  columns?: 1 | 2;
}

function InteractiveDoughnut({
  slices,
  totalLabel,
  totalValue,
  title,
  onExpand,
  onTooltip,
  columns = 2,
}: DoughnutChartProps) {
  const [hoveredSlice, setHoveredSlice] = useState<Slice | null>(null);
  const [activeLegendIndex, setActiveLegendIndex] = useState<number | null>(null);

  const circumference = 301.59;
  let cumulativePercentage = 0;

  return (
    <div className="flex flex-col items-center gap-5 w-full relative group">
      {onExpand && title && (
        <button
          onClick={() => onExpand(title, slices)}
          className="absolute -top-3 -right-1 p-1.5 bg-slate-100/80 hover:bg-blue-100 text-slate-500 hover:text-blue-700 rounded-lg transition-all border border-slate-200 shadow-xs z-10 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider cursor-pointer"
          title="Expand 3D Chart"
        >
          <Maximize2 size={13} /> Expand
        </button>
      )}

      {/* SVG Doughnut Chart */}
      <div className="relative w-44 h-44 select-none flex-shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {slices.map((slice, index) => {
            const percentage = slice.value;
            const strokeDashoffset = circumference - (circumference * percentage) / 100;
            const startAngle = (cumulativePercentage * 360) / 100;
            cumulativePercentage += percentage;

            const isHovered = hoveredSlice?.label === slice.label || activeLegendIndex === index;
            const someActive = hoveredSlice !== null || activeLegendIndex !== null;
            const opacity = someActive ? (isHovered ? 1 : 0.28) : 1;
            const filter = someActive && !isHovered ? "grayscale(45%)" : "none";

            return (
              <circle
                key={slice.label}
                cx="60"
                cy="60"
                r="48"
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? "26" : "21"}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transform: `rotate(${startAngle - 90}deg)`,
                  transformOrigin: "60px 60px",
                  opacity,
                  filter,
                }}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={(e) => {
                  setHoveredSlice(slice);
                  onTooltip?.(
                    {
                      title: slice.label,
                      subtitle: "Application Status Distribution",
                      items: [
                        { label: "Status Tier", value: slice.label },
                        { label: "Applications", value: String(slice.raw), highlight: true },
                        { label: "Percentage Share", value: `${slice.value}%` },
                      ],
                    },
                    { x: e.clientX, y: e.clientY }
                  );
                }}
                onMouseLeave={() => {
                  setHoveredSlice(null);
                  onTooltip?.(null);
                }}
              />
            );
          })}
          {/* Inner white circle */}
          <circle cx="60" cy="60" r="37" className="fill-white" />
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
          {hoveredSlice ? (
            <>
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider truncate max-w-[100px]">
                {hoveredSlice.label}
              </span>
              <span className="text-base font-black text-slate-900 mt-0.5 tracking-tight truncate max-w-[100px]">
                {hoveredSlice.raw}
              </span>
              <span className="text-xs font-black text-blue-600 mt-0.5">
                {hoveredSlice.value}%
              </span>
            </>
          ) : activeLegendIndex !== null ? (
            <>
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider truncate max-w-[100px]">
                {slices[activeLegendIndex].label}
              </span>
              <span className="text-base font-black text-slate-900 mt-0.5 tracking-tight truncate max-w-[100px]">
                {slices[activeLegendIndex].raw}
              </span>
              <span className="text-xs font-black text-blue-600 mt-0.5">
                {slices[activeLegendIndex].value}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                {totalLabel}
              </span>
              <span className="text-base font-black text-slate-900 mt-0.5 tracking-tight">
                {totalValue}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend Container: Shows Label, Data (Raw Count), and Percentage */}
      <div className={`w-full grid ${columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-2 text-xs`}>
        {slices.map((slice, index) => {
          const isSelected = activeLegendIndex === index || hoveredSlice?.label === slice.label;
          return (
            <button
              key={slice.label}
              onClick={() => setActiveLegendIndex(activeLegendIndex === index ? null : index)}
              onMouseEnter={() => setHoveredSlice(slice)}
              onMouseLeave={() => setHoveredSlice(null)}
              className={`flex items-center justify-between gap-2.5 p-2 rounded-xl text-left transition-all duration-200 cursor-pointer w-full group ${
                isSelected
                  ? "bg-blue-50/90 font-black text-blue-950 scale-[1.01] shadow-xs ring-1 ring-blue-300"
                  : "hover:bg-slate-50 text-slate-700 font-semibold"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 border border-white/40 shadow-2xs"
                  style={{
                    backgroundColor: slice.color,
                    boxShadow: isSelected ? `0 0 8px ${slice.color}99` : `0 1px 3px ${slice.color}44`,
                  }}
                />
                <span className="truncate text-xs font-bold group-hover:text-blue-900 transition-colors" title={slice.label}>
                  {slice.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="font-extrabold text-slate-900 text-xs">
                  {slice.raw}
                </span>
                <span className="bg-slate-100 text-slate-700 border border-slate-200/80 px-1.5 py-0.5 rounded-md text-[10px] font-black group-hover:bg-blue-100 group-hover:text-blue-900 transition-colors">
                  {slice.value}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Interactive Multi-Faculty Radar Chart ──────────────────────────────────────
interface RadarStreamItem {
  name: string;
  applicants: number;
  beneficiaries: number;
}

function StreamRadarChart({
  data,
  onTooltip,
}: {
  data: RadarStreamItem[];
  onTooltip?: (data: ChartTooltipData | null, pos?: { x: number; y: number } | null) => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cx = 175;
  const cy = 145;
  const rMax = 100;
  const count = data.length;
  const maxVal = 420000;

  // Concentric Rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Polygon coordinates
  const applicantCoords = data.map((d, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    const r = (d.applicants / maxVal) * rMax;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const beneficiaryCoords = data.map((d, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    const r = (d.beneficiaries / maxVal) * rMax;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const appPolygonPoints = applicantCoords.map((c) => `${c.x},${c.y}`).join(" ");
  const benPolygonPoints = beneficiaryCoords.map((c) => `${c.x},${c.y}`).join(" ");

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-[370px] h-[300px]">
        <svg viewBox="0 0 350 290" className="w-full h-full select-none">
          <defs>
            <linearGradient id="radarAppGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="radarBenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Background Grid Rings */}
          {rings.map((scale, ri) => {
            const ringPts = data
              .map((_, i) => {
                const angle = (2 * Math.PI * i) / count - Math.PI / 2;
                const r = scale * rMax;
                return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
              })
              .join(" ");
            return (
              <polygon
                key={ri}
                points={ringPts}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={ri === rings.length - 1 ? "1.5" : "1"}
                strokeDasharray={ri === rings.length - 1 ? undefined : "3 3"}
              />
            );
          })}

          {/* Radial Spokes */}
          {data.map((_, i) => {
            const angle = (2 * Math.PI * i) / count - Math.PI / 2;
            const x = cx + rMax * Math.cos(angle);
            const y = cy + rMax * Math.sin(angle);
            return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#cbd5e1" strokeWidth="1" />;
          })}

          {/* Layer 1: Applicants Polygon */}
          <polygon
            points={appPolygonPoints}
            fill="url(#radarAppGrad)"
            stroke="#2563eb"
            strokeWidth="2"
            className="transition-all duration-500"
          />

          {/* Layer 2: Beneficiaries Polygon */}
          <polygon
            points={benPolygonPoints}
            fill="url(#radarBenGrad)"
            stroke="#0d9488"
            strokeWidth="2.5"
            className="transition-all duration-500"
          />

          {/* Interactive Vertex Nodes */}
          {data.map((d, i) => {
            const bCoord = beneficiaryCoords[i];
            const aCoord = applicantCoords[i];
            const isHovered = hoveredIndex === i;
            const rate = ((d.beneficiaries / d.applicants) * 100).toFixed(0);

            // Label Position
            const angle = (2 * Math.PI * i) / count - Math.PI / 2;
            const labelR = rMax + 26;
            const lx = cx + labelR * Math.cos(angle);
            const ly = cy + labelR * Math.sin(angle);

            return (
              <g key={d.name}>
                {/* Node for Applicants */}
                <circle
                  cx={aCoord.x}
                  cy={aCoord.y}
                  r={isHovered ? "5" : "3.5"}
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all"
                />

                {/* Node for Beneficiaries */}
                <circle
                  cx={bCoord.x}
                  cy={bCoord.y}
                  r={isHovered ? "7" : "5"}
                  fill="#0d9488"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-all shadow-md"
                  onMouseEnter={(e) => {
                    setHoveredIndex(i);
                    onTooltip?.({
                      title: `${d.name} — Radar Profile`,
                      subtitle: "Faculty Volume vs Confirmed Sanction",
                      items: [
                        { label: "Academic Stream", value: d.name },
                        { label: "Total Applicants", value: d.applicants.toLocaleString("en-IN") },
                        { label: "Sanctioned Beneficiaries", value: d.beneficiaries.toLocaleString("en-IN"), highlight: true },
                        { label: "Conversion Rate", value: `${rate}%` },
                      ],
                    }, { x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    onTooltip?.(null);
                  }}
                />

                {/* Stream Label */}
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-[10px] font-extrabold cursor-pointer transition-colors ${
                    isHovered ? "fill-blue-900 font-black text-xs" : "fill-slate-600"
                  }`}
                  onMouseEnter={(e) => {
                    setHoveredIndex(i);
                    onTooltip?.({
                      title: `${d.name} — Academic Stream`,
                      subtitle: "DBT Direct Disbursal Profile",
                      items: [
                        { label: "Faculty", value: d.name },
                        { label: "Applicants", value: d.applicants.toLocaleString("en-IN") },
                        { label: "Beneficiaries", value: d.beneficiaries.toLocaleString("en-IN"), highlight: true },
                        { label: "Clearance Rate", value: `${rate}%` },
                      ],
                    }, { x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    onTooltip?.(null);
                  }}
                >
                  {d.name.length > 12 ? d.name.split(" ")[0] : d.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Radar Legend */}
      <div className="flex items-center justify-center gap-5 text-xs font-semibold mt-1">
        <span className="flex items-center gap-1.5 text-blue-700">
          <span className="w-3 h-3 rounded-full bg-blue-600" /> Total Applicants
        </span>
        <span className="flex items-center gap-1.5 text-teal-700 font-extrabold">
          <span className="w-3 h-3 rounded-full bg-teal-600" /> Sanctioned Beneficiaries
        </span>
      </div>
    </div>
  );
}

// ─── Clustered Column Chart Component ──────────────────────────────────────────
const SCHEME_SHORT_NAMES: Record<string, { short: string; full: string }> = {
  "Swami Vivekananda Merit-cum-Means Scholarship (SVMCM)": { short: "SVMCM", full: "Swami Vivekananda (SVMCM)" },
  "Oasis Post-Matric Scholarship for SC/ST Students": { short: "OASIS", full: "Oasis Post-Matric (SC/ST)" },
  "Aikyashree State Scholarship for Minority Students": { short: "Aikyashree", full: "Aikyashree Minority Support" },
  "Kanyashree Prakalpa (K3 Higher Education Support)": { short: "Kanyashree", full: "Kanyashree Prakalpa (K3)" },
  "West Bengal Student Credit Card Support Scheme": { short: "WBSCC", full: "WB Student Credit Card" },
  "Chief Minister Relief Fund Higher Education Grant": { short: "CMRF", full: "CM Relief Fund Grant" },
};

function ClusteredSchemeChart({
  schemes,
  onTooltip,
}: {
  schemes: SchemeItem[];
  onTooltip?: (data: ChartTooltipData | null, pos?: { x: number; y: number } | null) => void;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = 1800; // max ₹ Cr scale
  const chartHeight = 150;

  return (
    <div className="w-full flex flex-col justify-between">
      {/* Top Header Legend */}
      <div className="flex items-center justify-between text-xs font-semibold px-1 mb-3 text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-blue-700 font-bold">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB]" /> Allotted Budget (₹ Cr)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#059669]" /> Disbursed Amount (₹ Cr)
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-400">Utilization Rate</span>
      </div>

      {/* Clustered Columns Plot Area (Bars rest directly on baseline) */}
      <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-[165px] pt-4 px-2 border-b border-slate-200">
        {schemes.map((sc, idx) => {
          const allottedH = Math.max(12, (sc.allotted / maxVal) * chartHeight);
          const disbursedH = Math.max(10, (sc.disbursed / maxVal) * chartHeight);
          const utilRate = ((sc.disbursed / sc.allotted) * 100).toFixed(0);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={sc.name}
              className="flex flex-col items-center h-full justify-end group cursor-pointer"
              onMouseEnter={(e) => {
                setHoveredIdx(idx);
                onTooltip?.({
                  title: sc.name,
                  subtitle: "State Government Welfare Scheme Budget",
                  items: [
                    { label: "Allotted Outlay", value: `₹ ${sc.allotted.toFixed(2)} Cr` },
                    { label: "Disbursed Funds", value: `₹ ${sc.disbursed.toFixed(2)} Cr`, highlight: true },
                    { label: "Budget Utilization", value: `${utilRate}%` },
                  ],
                }, { x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => {
                setHoveredIdx(null);
                onTooltip?.(null);
              }}
            >
              {/* Top Rate Badge */}
              <span className={`text-[10px] font-black mb-2 px-1.5 py-0.5 rounded-full transition-all whitespace-nowrap ${
                isHovered
                  ? "bg-emerald-600 text-white scale-105 shadow-sm"
                  : "text-emerald-700 bg-emerald-50 border border-emerald-200/70"
              }`}>
                {utilRate}%
              </span>

              {/* Clustered Columns */}
              <div className="flex items-end gap-1 sm:gap-1.5 w-full justify-center">
                {/* Allotted Bar */}
                <div
                  style={{ height: `${allottedH}px` }}
                  className={`w-3 sm:w-4 rounded-t-md shadow-2xs transition-all duration-300 ${
                    isHovered
                      ? "bg-blue-600 brightness-110"
                      : "bg-gradient-to-t from-blue-700 to-blue-500"
                  }`}
                />
                {/* Disbursed Bar */}
                <div
                  style={{ height: `${disbursedH}px` }}
                  className={`w-3 sm:w-4 rounded-t-md shadow-2xs transition-all duration-300 ${
                    isHovered
                      ? "bg-emerald-500 brightness-110"
                      : "bg-gradient-to-t from-emerald-700 to-emerald-400"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-Axis Category Labels Row (Sitting cleanly below the baseline) */}
      <div className="grid grid-cols-6 gap-2 sm:gap-4 px-2 pt-2.5">
        {schemes.map((sc, idx) => {
          const schemeInfo = SCHEME_SHORT_NAMES[sc.name] || { short: `S${idx + 1}`, full: sc.name };
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={sc.name}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex justify-center"
            >
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all text-center cursor-pointer select-none ${
                isHovered
                  ? "bg-blue-600 text-white font-extrabold shadow-2xs scale-105"
                  : "bg-slate-100 text-slate-600 hover:text-blue-900 hover:bg-blue-50"
              }`}>
                {schemeInfo.short}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scheme Legend Footnotes (Clean 2-Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-medium text-slate-600 mt-4 pt-3 border-t border-slate-100">
        {schemes.map((sc, idx) => {
          const schemeInfo = SCHEME_SHORT_NAMES[sc.name] || { short: `S${idx + 1}`, full: sc.name };
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={sc.name}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors cursor-pointer ${
                isHovered ? "bg-blue-50/80 text-blue-900 font-bold" : "hover:bg-slate-50"
              }`}
              title={sc.name}
            >
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${
                isHovered ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
              }`}>
                {schemeInfo.short}
              </span>
              <span className="truncate">{schemeInfo.full}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Stepped Academic Funnel Chart ─────────────────────────────────────────────
interface QualificationItem {
  tier: string;
  name: string;
  applicants: number;
  beneficiaries: number;
  share: string;
  avgBenefit: number;
  color: string;
}

function SteppedFunnelChart({
  tiers,
  onTooltip,
}: {
  tiers: QualificationItem[];
  onTooltip?: (data: ChartTooltipData | null, pos?: { x: number; y: number } | null) => void;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const widths = [100, 78, 60, 42]; // percentage widths of funnel tiers

  return (
    <div className="flex flex-col justify-between h-full space-y-2.5 w-full">
      {tiers.map((t, idx) => {
        const convRate = ((t.beneficiaries / t.applicants) * 100).toFixed(0);
        const isHovered = hoveredIdx === idx;
        const widthPct = widths[idx];

        return (
          <div
            key={t.tier}
            className="flex flex-col items-center cursor-pointer group"
            onMouseEnter={(e) => {
              setHoveredIdx(idx);
              onTooltip?.({
                title: `${t.name} (${t.tier})`,
                subtitle: `Academic Qualification Tier Funnel`,
                items: [
                  { label: "Tier Level", value: t.name },
                  { label: "Applicants", value: t.applicants.toLocaleString("en-IN") },
                  { label: "Sanctioned Beneficiaries", value: t.beneficiaries.toLocaleString("en-IN"), highlight: true },
                  { label: "Success Conversion", value: `${convRate}%` },
                  { label: "Average Scholarship", value: `₹ ${t.avgBenefit.toLocaleString("en-IN")}` },
                ],
              }, { x: e.clientX, y: e.clientY });
            }}
            onMouseLeave={() => {
              setHoveredIdx(null);
              onTooltip?.(null);
            }}
          >
            {/* Funnel Tier Trapezoid Bar */}
            <div
              style={{ width: `${widthPct}%` }}
              className={`p-2.5 sm:p-3 rounded-2xl transition-all duration-300 border flex items-center justify-between shadow-xs ${
                isHovered
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white border-transparent scale-[1.02] shadow-md"
                  : "bg-slate-50/90 border-slate-200/80 text-slate-800 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                  isHovered ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-900"
                }`}>
                  {t.tier}
                </span>
                <span className="text-xs font-black truncate">{t.name}</span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[11px] font-bold ${isHovered ? "text-blue-100" : "text-slate-500"}`}>
                  {t.beneficiaries.toLocaleString("en-IN")}
                </span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-lg border shadow-2xs ${
                  isHovered
                    ? "bg-white text-indigo-950 border-white"
                    : "bg-teal-50 text-teal-800 border-teal-200"
                }`}>
                  {convRate}%
                </span>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 pt-1 border-t border-slate-100">
        <span>Stepped Funnel: Tier 1 (UG) to Tier 4 (Ph.D.)</span>
        <span className="text-teal-700 font-bold">100% DBT Merit Verification</span>
      </div>
    </div>
  );
}

// ─── Admission Channel Radial Gauge Component ──────────────────────────────────
function ChannelSpeedometerGauge({
  capCount,
  spotCount,
  onTooltip,
}: {
  capCount: number;
  spotCount: number;
  onTooltip?: (data: ChartTooltipData | null, pos?: { x: number; y: number } | null) => void;
}) {
  const capPct = 96.3;
  const spotPct = 3.7;

  return (
    <div className="flex flex-col items-center justify-between h-full w-full">
      {/* Semicircular Gauge */}
      <div className="relative w-48 h-28 flex items-center justify-center select-none mt-2">
        <svg viewBox="0 0 120 70" className="w-full h-full">
          {/* Background Arc */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Spot Arc (Background end) */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="#64748b"
            strokeWidth="14"
            strokeDasharray="157"
            strokeDashoffset="0"
            strokeLinecap="round"
          />
          {/* CAP Arc (Vibrant Blue - 96.3%) */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="#2563eb"
            strokeWidth="14"
            strokeDasharray="157"
            strokeDashoffset="5.8"
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 text-center pointer-events-none">
          <span className="text-xl font-black text-blue-900">96.3%</span>
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">CAP Merit Share</span>
        </div>
      </div>

      {/* Channel Breakdown Rows */}
      <div className="w-full space-y-2.5 mt-3">
        <div
          className="bg-blue-50/80 hover:bg-blue-100/60 p-2.5 rounded-2xl border border-blue-200/70 flex items-center justify-between cursor-pointer transition-colors"
          onMouseEnter={(e) =>
            onTooltip?.({
              title: "CAP Central Merit Allocation",
              subtitle: "Direct Government Allotment Pipeline",
              items: [
                { label: "Channel", value: "Central Merit Round" },
                { label: "Beneficiaries", value: capCount.toLocaleString("en-IN"), highlight: true },
                { label: "State Volume Share", value: "96.3%" },
                { label: "DBT Eligibility", value: "100% Direct Fee Concession" },
              ],
            }, { x: e.clientX, y: e.clientY })
          }
          onMouseLeave={() => onTooltip?.(null)}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-xs font-black text-blue-950">CAP Govt. Round</span>
          </div>
          <span className="text-xs font-black text-blue-900 bg-white border border-blue-200 px-2 py-0.5 rounded-md shadow-2xs">
            {capCount.toLocaleString("en-IN")}
          </span>
        </div>

        <div
          className="bg-slate-50/80 hover:bg-slate-100 p-2.5 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
          onMouseEnter={(e) =>
            onTooltip?.({
              title: "Spot / Institutional Quota",
              subtitle: "Direct Institute-Level Admission Round",
              items: [
                { label: "Channel", value: "Institutional Spot Quota" },
                { label: "Beneficiaries", value: spotCount.toLocaleString("en-IN"), highlight: true },
                { label: "State Volume Share", value: "3.7%" },
                { label: "Audit Status", value: "Special Fee Scrutiny" },
              ],
            }, { x: e.clientX, y: e.clientY })
          }
          onMouseLeave={() => onTooltip?.(null)}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span className="text-xs font-black text-slate-800">Spot Quota</span>
          </div>
          <span className="text-xs font-black text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
            {spotCount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className="w-full bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-2 flex items-center gap-2 text-[10px] font-bold text-emerald-900 mt-2">
        <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
        <span>100% Aadhaar Payment Bridge Active</span>
      </div>
    </div>
  );
}
// ─── End Doughnut ──────────────────────────────────────────────────────────────

interface DualBarItem {
  name: string;
  applicants: number;
  beneficiaries: number;
}

interface SchemeItem {
  name: string;
  allotted: number;
  disbursed: number;
}

interface ApplicationStatusItem {
  status: string;
  count: number;
  color?: string;
}

interface DistrictItem {
  district: string;
  applicants: number;
  beneficiaries: number;
  disbursedCr: number;
  rate: number;
}

interface ScholarshipDashboardProps {
  globalFilters?: GlobalFilterState;
  onUniversityChange?: (uni: string) => void;
}

export default function ScholarshipDashboard({
  globalFilters,
  onUniversityChange,
}: ScholarshipDashboardProps) {
  const [districtSearch, setDistrictSearch] = useState("");
  const [expandedPieData, setExpandedPieData] = useState<{ title: string; slices: Slice[] } | null>(null);
  const [tooltip, setTooltip] = useState<{ data: ChartTooltipData; pos: { x: number; y: number } } | null>(null);

  // Sync district filter with district table search
  useEffect(() => {
    if (globalFilters?.district && globalFilters.district !== "All") {
      setDistrictSearch(globalFilters.district);
    } else if (globalFilters?.district === "All") {
      setDistrictSearch("");
    }
  }, [globalFilters?.district]);

  // Base Aggregates (Statewide F.Y. 2024-2025)
  const baseData = {
    applicants: 2501536,
    beneficiaries: 1924228,
    disbursedCr: 5350.3,
  };

  // Adjust metrics based on selected global filters
  const multiplier = useMemo(() => {
    let scale = 1.0;
    
    if (globalFilters?.academicYear) {
      if (globalFilters.academicYear === "2024-25") scale *= 0.88;
      else if (globalFilters.academicYear === "2023-24") scale *= 0.76;
      else if (globalFilters.academicYear === "2022-23") scale *= 0.65;
    }
    
    if (globalFilters?.district && globalFilters.district !== "All") {
      let hash = 0;
      for (let i = 0; i < globalFilters.district.length; i++) {
        hash = globalFilters.district.charCodeAt(i) + ((hash << 5) - hash);
      }
      scale *= (0.05 + (Math.abs(hash) % 100) / 1000); // Unique scale between 0.05 and 0.15
    }
    
    if (globalFilters?.universityType && globalFilters.universityType !== "All") {
      let hash = 0;
      for (let i = 0; i < globalFilters.universityType.length; i++) {
        hash = globalFilters.universityType.charCodeAt(i) + ((hash << 5) - hash);
      }
      scale *= (0.1 + (Math.abs(hash) % 50) / 100);
    }
    
    if (globalFilters?.college && globalFilters.college !== "All") {
      scale *= 0.05;
    }

    if (globalFilters?.university && globalFilters.university !== "All") {
      switch (globalFilters.university) {
        case "CU": scale *= 0.220; break;
        case "MAKAUT": scale *= 0.165; break;
        case "BU": scale *= 0.145; break;
        case "KU": scale *= 0.095; break;
        case "VU": scale *= 0.090; break;
        case "WBSU": scale *= 0.080; break;
        case "NBU": scale *= 0.065; break;
        case "UGB": scale *= 0.055; break;
        case "JU": scale *= 0.045; break;
        case "KNU": scale *= 0.040; break;
        case "SKBU": scale *= 0.035; break;
        case "BKU": scale *= 0.030; break;
        case "CBPBU": scale *= 0.025; break;
        case "Presidency": scale *= 0.015; break;
        case "Visva-Bharati": scale *= 0.018; break;
        case "Aliah": scale *= 0.012; break;
        case "RBU": scale *= 0.018; break;
        default: scale *= 0.035; break;
      }
    }
    return scale;
  }, [globalFilters]);

  const summary = useMemo(() => {
    return {
      applicants: Math.round(baseData.applicants * multiplier),
      beneficiaries: Math.round(baseData.beneficiaries * multiplier),
      disbursedCr: Number((baseData.disbursedCr * multiplier).toFixed(2)),
    };
  }, [baseData.applicants, baseData.beneficiaries, baseData.disbursedCr, multiplier]);

  // Gender Breakdown
  const genderData: DualBarItem[] = useMemo(() => {
    return [
      {
        name: "Female",
        applicants: Math.round(1350800 * multiplier),
        beneficiaries: Math.round(1085000 * multiplier),
      },
      {
        name: "Male",
        applicants: Math.round(1150000 * multiplier),
        beneficiaries: Math.round(839000 * multiplier),
      },
      {
        name: "Transgender",
        applicants: Math.round(736 * multiplier),
        beneficiaries: Math.round(228 * multiplier),
      },
    ];
  }, [multiplier]);

  // Category Breakdown with Category Code & Color
  const categoryData = useMemo(() => {
    const list = [
      { code: "SC", name: "Scheduled Caste", applicants: 782400, beneficiaries: 642340, color: "from-blue-600 to-indigo-600", badgeColor: "bg-blue-100 text-blue-800 border-blue-200" },
      { code: "OBC-A", name: "Other Backward Class (A)", applicants: 564200, beneficiaries: 458120, color: "from-teal-600 to-emerald-600", badgeColor: "bg-teal-100 text-teal-800 border-teal-200" },
      { code: "OBC-B", name: "Other Backward Class (B)", applicants: 482100, beneficiaries: 385680, color: "from-indigo-600 to-violet-600", badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200" },
      { code: "ST", name: "Scheduled Tribe", applicants: 284200, beneficiaries: 228276, color: "from-amber-600 to-orange-600", badgeColor: "bg-amber-100 text-amber-800 border-amber-200" },
      { code: "EWS", name: "Economically Weaker Section", applicants: 234100, beneficiaries: 187280, color: "from-cyan-600 to-blue-600", badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200" },
      { code: "GEN", name: "General / Merit", applicants: 154536, beneficiaries: 22532, color: "from-slate-600 to-slate-800", badgeColor: "bg-slate-100 text-slate-800 border-slate-200" },
    ];
    return list.map((item) => ({
      ...item,
      applicants: Math.round(item.applicants * multiplier),
      beneficiaries: Math.round(item.beneficiaries * multiplier),
    }));
  }, [multiplier]);

  // Stream Breakdown with Icons
  const streamData = useMemo(() => {
    const list = [
      { name: "Engineering & Tech", icon: Cpu, applicants: 412000, beneficiaries: 389000, color: "bg-blue-50 text-blue-700 border-blue-200" },
      { name: "General Degree (Arts/Sc/Com)", icon: FlaskConical, applicants: 520000, beneficiaries: 495000, color: "bg-teal-50 text-teal-700 border-teal-200" },
      { name: "Commerce & Mgmt", icon: Briefcase, applicants: 295000, beneficiaries: 271000, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
      { name: "Humanities & Languages", icon: Palette, applicants: 245000, beneficiaries: 218000, color: "bg-amber-50 text-amber-700 border-amber-200" },
      { name: "Pharmacy & Paramedical", icon: Pill, applicants: 185000, beneficiaries: 172000, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      { name: "Management (MBA/MCA)", icon: BarChart3, applicants: 142000, beneficiaries: 133000, color: "bg-sky-50 text-sky-700 border-sky-200" },
      { name: "Medical & Nursing", icon: Stethoscope, applicants: 98000, beneficiaries: 92000, color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
    ];
    return list.map((item) => ({
      ...item,
      applicants: Math.round(item.applicants * multiplier),
      beneficiaries: Math.round(item.beneficiaries * multiplier),
    }));
  }, [multiplier]);

  // Department Breakdown (Ranked)
  const departmentData = useMemo(() => {
    const list = [
      { rank: 1, name: "Higher Education Department (DHE)", applicants: 1085000, beneficiaries: 888000, outlayCr: 2440.5, efficiency: "98.4%" },
      { rank: 2, name: "Backward Classes Welfare Department", applicants: 640000, beneficiaries: 521000, outlayCr: 1450.2, efficiency: "96.2%" },
      { rank: 3, name: "Minority Affairs & Madrasah Education", applicants: 485000, beneficiaries: 382000, outlayCr: 980.8, efficiency: "95.1%" },
      { rank: 4, name: "Tribal Development Department", applicants: 180000, beneficiaries: 141000, outlayCr: 320.4, efficiency: "91.8%" },
      { rank: 5, name: "Technical Education & Skill Dev.", applicants: 111536, beneficiaries: 82228, outlayCr: 158.4, efficiency: "88.5%" },
    ];
    return list.map((item) => ({
      ...item,
      applicants: Math.round(item.applicants * multiplier),
      beneficiaries: Math.round(item.beneficiaries * multiplier),
      outlayCr: Number((item.outlayCr * multiplier).toFixed(2)),
    }));
  }, [multiplier]);

  // Scheme-wise Scholarship (₹ Cr)
  const schemeData: SchemeItem[] = useMemo(() => {
    const list: SchemeItem[] = [
      { name: "Swami Vivekananda Merit-cum-Means Scholarship (SVMCM)", allotted: 1620.5, disbursed: 1598.2 },
      { name: "Oasis Post-Matric Scholarship for SC/ST Students", allotted: 1280.0, disbursed: 1245.6 },
      { name: "Aikyashree State Scholarship for Minority Students", allotted: 1080.4, disbursed: 1024.8 },
      { name: "Kanyashree Prakalpa (K3 Higher Education Support)", allotted: 550.0, disbursed: 485.4 },
      { name: "West Bengal Student Credit Card Support Scheme", allotted: 420.0, disbursed: 398.1 },
      { name: "Chief Minister Relief Fund Higher Education Grant", allotted: 210.0, disbursed: 188.7 },
    ];

    return list.map((item) => ({
      name: item.name,
      allotted: Number((item.allotted * multiplier).toFixed(2)),
      disbursed: Number((item.disbursed * multiplier).toFixed(2)),
    }));
  }, [multiplier]);

  // Application Status
  const applicationStatusData: ApplicationStatusItem[] = useMemo(() => {
    const list: ApplicationStatusItem[] = [
      { status: "Disbursed to Bank (APBS)", count: 1845200, color: "#0d9488" },
      { status: "Allotted / Approved", count: 79028, color: "#2563eb" },
      { status: "Under Scrutiny (Institute)", count: 245000, color: "#4338ca" },
      { status: "Pending District Verification", count: 185000, color: "#b45309" },
      { status: "Sent Back / Correction Required", count: 98000, color: "#64748b" },
    ];
    return list.map((item) => ({
      ...item,
      count: Math.round(item.count * multiplier),
    }));
  }, [multiplier]);

  // Qualification Level Tiers
  const qualificationData = useMemo(() => {
    const list = [
      { tier: "Tier 1", name: "Undergraduate (UG Degree)", applicants: 1530000, beneficiaries: 1182000, color: "from-blue-600 to-indigo-600", share: "61.4%", avgBenefit: 28400 },
      { tier: "Tier 2", name: "Diploma & Polytechnic", applicants: 412000, beneficiaries: 275000, color: "from-teal-600 to-emerald-600", share: "14.3%", avgBenefit: 18200 },
      { tier: "Tier 3", name: "Postgraduate (PG Degree)", applicants: 325000, beneficiaries: 179000, color: "from-indigo-600 to-violet-600", share: "9.3%", avgBenefit: 42500 },
      { tier: "Tier 4", name: "Ph.D. & Research Fellowships", applicants: 234000, beneficiaries: 9800, color: "from-amber-600 to-orange-600", share: "0.5%", avgBenefit: 84000 },
    ];
    return list.map((item) => ({
      ...item,
      applicants: Math.round(item.applicants * multiplier),
      beneficiaries: Math.round(item.beneficiaries * multiplier),
    }));
  }, [multiplier]);

  // Year on Year Disbursed Amount (₹ Cr)
  const yoyDisbursedData = useMemo(() => {
    const list = [
      { year: "2021-22", amount: 3410.2 },
      { year: "2022-23", amount: 4120.8 },
      { year: "2023-24", amount: 4890.6 },
      { year: "2024-25", amount: 5350.3 },
    ];
    return list.map((item) => ({
      ...item,
      amount: Number((item.amount * multiplier).toFixed(1)),
    }));
  }, [multiplier]);

  // District Table Data
  const districtData: DistrictItem[] = useMemo(() => {
    const list: DistrictItem[] = [
      { district: "Kolkata", applicants: 285000, beneficiaries: 242000, disbursedCr: 680.4, rate: 84.9 },
      { district: "North 24 Parganas", applicants: 265000, beneficiaries: 218000, disbursedCr: 612.2, rate: 82.3 },
      { district: "South 24 Parganas", applicants: 225000, beneficiaries: 184000, disbursedCr: 510.8, rate: 81.8 },
      { district: "Howrah", applicants: 185000, beneficiaries: 151000, disbursedCr: 422.5, rate: 81.6 },
      { district: "Hooghly", applicants: 174000, beneficiaries: 141000, disbursedCr: 398.0, rate: 81.0 },
      { district: "Purba Bardhaman", applicants: 162000, beneficiaries: 132000, disbursedCr: 370.2, rate: 81.5 },
      { district: "Paschim Bardhaman", applicants: 158000, beneficiaries: 129000, disbursedCr: 365.4, rate: 81.6 },
      { district: "Paschim Medinipur", applicants: 149000, beneficiaries: 121000, disbursedCr: 344.1, rate: 81.2 },
      { district: "Purba Medinipur", applicants: 145000, beneficiaries: 119000, disbursedCr: 338.6, rate: 82.1 },
      { district: "Nadia", applicants: 138000, beneficiaries: 112000, disbursedCr: 318.3, rate: 81.2 },
      { district: "Murshidabad", applicants: 168000, beneficiaries: 135000, disbursedCr: 382.0, rate: 80.4 },
      { district: "Malda", applicants: 132000, beneficiaries: 105000, disbursedCr: 298.4, rate: 79.5 },
      { district: "Darjeeling", applicants: 72000, beneficiaries: 59000, disbursedCr: 168.0, rate: 81.9 },
      { district: "Jalpaiguri", applicants: 85000, beneficiaries: 69000, disbursedCr: 195.4, rate: 81.2 },
      { district: "Bankura", applicants: 98000, beneficiaries: 79000, disbursedCr: 224.0, rate: 80.6 },
      { district: "Purulia", applicants: 92000, beneficiaries: 73000, disbursedCr: 208.5, rate: 79.3 },
      { district: "Birbhum", applicants: 112000, beneficiaries: 91000, disbursedCr: 258.0, rate: 81.3 },
      { district: "Cooch Behar", applicants: 88000, beneficiaries: 71000, disbursedCr: 201.2, rate: 80.7 },
    ];

    return list
      .filter((d) => d.district.toLowerCase().includes(districtSearch.toLowerCase()))
      .map((item) => ({
        ...item,
        applicants: Math.round(item.applicants * multiplier),
        beneficiaries: Math.round(item.beneficiaries * multiplier),
        disbursedCr: Number((item.disbursedCr * multiplier).toFixed(1)),
      }));
  }, [multiplier, districtSearch]);

  const beneficiaryRate = ((summary.beneficiaries / summary.applicants) * 100).toFixed(0);
  const avgBenefitPerStudent = Math.round((summary.disbursedCr * 10000000) / (summary.beneficiaries || 1));

  return (
    <div className="flex flex-col gap-8 w-full animate-fadeIn pb-12 relative">
      
      {/* Floating Info Box Tooltip */}
      <ChartTooltip data={tooltip?.data || null} pos={tooltip?.pos || null} />

      {/* ========================================================================= */}
      {/* 1. TOP SUMMARY KPI CARDS WITH SECONDARY STATS & PROGRESS GAUGES */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="text-xs font-bold text-slate-600">
              West Bengal DBT & Scholarship Portal (SVMCM / Oasis / Aikyashree) Integrated • Aadhaar Seeded Bank Compliant
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 italic">
            *Data updated as on 14-Aug-2026
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Applicants */}
          <div
            onMouseMove={(e) =>
              setTooltip({
                data: {
                  title: "Total Scholarship Registrations (F.Y. 2024-25)",
                  subtitle: "Direct Benefit Transfer Portal Registrations",
                  items: [
                    { label: "Total Registered Applicants", value: summary.applicants.toLocaleString("en-IN"), highlight: true },
                    { label: "Aadhaar Seeded Compliance", value: "99.4% (24.8 Lakh)" },
                    { label: "Active State Schemes", value: "18 Welfare Schemes" },
                  ],
                },
                pos: { x: e.clientX, y: e.clientY },
              })
            }
            onMouseLeave={() => setTooltip(null)}
            className="bg-gradient-to-br from-blue-50/90 via-white to-blue-50/40 rounded-3xl border border-blue-200/80 shadow-soft p-6 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition-all duration-300 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-100/40 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/20">
                    <BookOpen size={24} className="stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider">Total Applicants</h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Online Registrations</p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200">
                  100% Volume
                </span>
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-black text-blue-950 tracking-tight mt-1">
                {summary.applicants.toLocaleString("en-IN")}
              </h3>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-100/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Aadhaar Verified:</span>
              <span className="font-extrabold text-blue-900">99.4% (24.8L+ Students)</span>
            </div>
          </div>

          {/* Card 2: Beneficiaries */}
          <div
            onMouseMove={(e) =>
              setTooltip({
                data: {
                  title: "Sanctioned Beneficiaries (F.Y. 2024-25)",
                  subtitle: "Direct Benefit Transfer Disbursal Beneficiaries",
                  items: [
                    { label: "Sanctioned Beneficiaries", value: summary.beneficiaries.toLocaleString("en-IN"), highlight: true },
                    { label: "State Clearance Rate", value: `${beneficiaryRate}% of registered` },
                    { label: "Payment Mode", value: "APBS / Bank DBT Concession" },
                  ],
                },
                pos: { x: e.clientX, y: e.clientY },
              })
            }
            onMouseLeave={() => setTooltip(null)}
            className="bg-gradient-to-br from-teal-50/90 via-white to-teal-50/40 rounded-3xl border border-teal-200/80 shadow-soft p-6 flex flex-col justify-between hover:shadow-md hover:border-teal-300 transition-all duration-300 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-teal-100/40 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-600/20">
                    <GraduationCap size={24} className="stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-teal-950 uppercase tracking-wider">Sanctioned Beneficiaries</h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Approved for Disbursement</p>
                  </div>
                </div>
                <span className="text-xs font-black bg-teal-100 text-teal-900 px-2.5 py-1 rounded-lg border border-teal-200">
                  {beneficiaryRate}%
                </span>
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-black text-teal-950 tracking-tight mt-1">
                {summary.beneficiaries.toLocaleString("en-IN")}
              </h3>
            </div>

            <div className="mt-4 pt-3 border-t border-teal-100/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Sanction Clearance Rate:</span>
                <span className="font-extrabold text-teal-800">{beneficiaryRate}% of registered</span>
              </div>
              <div className="w-full h-2 bg-teal-100 rounded-full overflow-hidden">
                <div style={{ width: `${beneficiaryRate}%` }} className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Card 3: Disbursed Amount */}
          <div
            onMouseMove={(e) =>
              setTooltip({
                data: {
                  title: "Total Scholarship Funds Disbursed Outlay",
                  subtitle: "Direct Benefit Transfer to Student Accounts & Colleges",
                  items: [
                    { label: "Total Disbursed", value: `₹ ${summary.disbursedCr.toLocaleString("en-IN", { maximumFractionDigits: 0 })} Cr`, highlight: true },
                    { label: "Average Benefit / Student", value: `₹ ${avgBenefitPerStudent.toLocaleString("en-IN")}` },
                    { label: "Bank Route", value: "Aadhaar Payment Bridge System" },
                  ],
                },
                pos: { x: e.clientX, y: e.clientY },
              })
            }
            onMouseLeave={() => setTooltip(null)}
            className="bg-gradient-to-br from-indigo-50/90 via-white to-indigo-50/40 rounded-3xl border border-indigo-200/80 shadow-soft p-6 flex flex-col justify-between hover:shadow-md hover:border-indigo-300 transition-all duration-300 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-100/40 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-800 to-slate-800 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-600/20">
                    <IndianRupee size={24} className="stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">Total Disbursed Outlay</h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Direct Benefit Transfer</p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-indigo-100 text-indigo-900 px-2.5 py-1 rounded-lg border border-indigo-200">
                  100% DBT
                </span>
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-black text-indigo-950 tracking-tight mt-1">
                ₹ {summary.disbursedCr.toLocaleString("en-IN", { maximumFractionDigits: 0 })} <span className="text-lg font-bold text-slate-500">Cr</span>
              </h3>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-100/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Avg. Benefit / Student:</span>
              <span className="font-extrabold text-indigo-900">₹ {avgBenefitPerStudent.toLocaleString("en-IN")}</span>
            </div>
          </div>

        </div>

        {/* Executive Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-3.5 px-6 text-white flex flex-wrap items-center justify-between gap-4 shadow-sm border border-slate-800">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-blue-300">
              <Building2 size={15} /> 5 Welfare Departments
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-teal-300">
              <Award size={15} /> 18 State Welfare Schemes
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Layers size={15} /> 36 Districts Statewide
            </span>
          </div>
          <span className="text-xs font-black text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-xl">
            ⚡ Automated Aadhaar Payment Bridge System (APBS) Active
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DEMOGRAPHIC & QUOTA MATRIX (DONUT + CATEGORY CONVERSION MATRIX) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Gender-wise Applicants v/s Beneficiaries (Parity Dumbbell Stream Flow) */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 lg:p-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base md:text-lg font-extrabold text-brand-900 tracking-tight">
                  Gender-wise Applicants v/s Beneficiaries
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">F.Y. 2024-2025 — Parity Stream & Sanction Conversion</p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-extrabold text-teal-900 bg-teal-50 border border-teal-200/80 px-2.5 py-1 rounded-xl shadow-2xs">
                  50.6% Female Parity
                </span>
              </div>
            </div>

            {/* Visual Parity Balance Bar */}
            <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/70 mb-4">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-teal-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> Female: 50.6% ({((genderData[0]?.beneficiaries || 974316) / 100000).toFixed(2)} Lakh)
                </span>
                <span className="text-blue-800 flex items-center gap-1.5">
                  Male: 49.4% ({((genderData[1]?.beneficiaries || 949909) / 100000).toFixed(2)} Lakh) <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex shadow-inner relative">
                <div style={{ width: "50.6%" }} className="bg-gradient-to-r from-teal-600 to-teal-500 h-full" />
                <div style={{ width: "49.4%" }} className="bg-gradient-to-r from-blue-500 to-blue-600 h-full" />
                {/* Center Parity Needle */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white shadow-xs -translate-x-1/2" />
              </div>
              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 mt-1.5">
                <span>Total Applications: {summary.applicants.toLocaleString("en-IN")}</span>
                <span className="text-teal-700 font-bold">1:1 State Parity Target Achieved ✓</span>
                <span>Total Disbursed: {summary.beneficiaries.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Connected Dumbbell Range Rows for each Gender */}
            <div className="space-y-3 mt-1">
              {genderData.map((g) => {
                const sanctionRate = ((g.beneficiaries / g.applicants) * 100).toFixed(0);
                const isFemale = g.name.includes("Female");
                const isMale = g.name.includes("Male");
                const colorTheme = isFemale
                  ? { bg: "bg-teal-50/70", border: "border-teal-200/70", text: "text-teal-900", dot: "bg-teal-600", fillGrad: "from-slate-400 via-teal-500 to-teal-600", badge: "bg-teal-100 text-teal-800 border-teal-200" }
                  : isMale
                  ? { bg: "bg-blue-50/70", border: "border-blue-200/70", text: "text-blue-900", dot: "bg-blue-600", fillGrad: "from-slate-400 via-blue-500 to-blue-600", badge: "bg-blue-100 text-blue-800 border-blue-200" }
                  : { bg: "bg-slate-50/80", border: "border-slate-200/70", text: "text-slate-900", dot: "bg-slate-700", fillGrad: "from-slate-400 to-slate-700", badge: "bg-slate-100 text-slate-800 border-slate-200" };

                return (
                  <div
                    key={g.name}
                    onMouseMove={(e) =>
                      setTooltip({
                        data: {
                          title: `Gender Group: ${g.name}`,
                          subtitle: `State Scholarship DBT Pipeline F.Y. 2024-2025`,
                          items: [
                            { label: "Total Applicants", value: g.applicants.toLocaleString("en-IN") },
                            { label: "Sanctioned Beneficiaries", value: g.beneficiaries.toLocaleString("en-IN"), highlight: true },
                            { label: "Sanction Ratio", value: `${sanctionRate}%` },
                            { label: "Pending / In Scrutiny", value: (g.applicants - g.beneficiaries).toLocaleString("en-IN") },
                          ],
                        },
                        pos: { x: e.clientX, y: e.clientY },
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    className={`${colorTheme.bg} hover:brightness-95 p-3 rounded-2xl border ${colorTheme.border} transition-all cursor-pointer group`}
                  >
                    {/* Header: Title and Sanction % */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${colorTheme.dot}`} />
                        <span className="font-extrabold text-slate-900 text-sm">
                          {g.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">
                          Sanction Rate:
                        </span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-lg border ${colorTheme.badge}`}>
                          {sanctionRate}% Sanctioned
                        </span>
                      </div>
                    </div>

                    {/* Connected Dumbbell Range Flow Visualization */}
                    <div className="relative flex items-center justify-between pt-1 pb-1 px-1">
                      
                      {/* Left Node: Applicants */}
                      <div className="flex flex-col items-start z-10">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-400 border-2 border-white shadow-xs" />
                          <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Applicants</span>
                        </div>
                        <span className="text-xs sm:text-sm font-black text-slate-800 mt-0.5">
                          {g.applicants.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Middle Stream Connector Line */}
                      <div className="flex-1 mx-3 sm:mx-4 relative flex items-center justify-center">
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                          <div
                            style={{ width: `${sanctionRate}%` }}
                            className={`h-full bg-gradient-to-r ${colorTheme.fillGrad} rounded-full transition-all duration-500`}
                          />
                        </div>
                        <div className="absolute -top-3.5 bg-white/95 border border-slate-200 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md shadow-2xs text-slate-600">
                          → {sanctionRate}%
                        </div>
                      </div>

                      {/* Right Node: Beneficiaries */}
                      <div className="flex flex-col items-end z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-extrabold text-slate-700 tracking-wider">Beneficiaries</span>
                          <div className={`w-3 h-3 rounded-full ${colorTheme.dot} border-2 border-white shadow-xs ring-1 ring-slate-300`} />
                        </div>
                        <span className={`text-xs sm:text-sm font-black ${colorTheme.text} mt-0.5`}>
                          {g.beneficiaries.toLocaleString("en-IN")}
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          <p className="text-[10px] text-slate-400 italic text-center mt-3 pt-3 border-t border-slate-100">
            *Over 9.74 Lakh female students benefited through dedicated state quota schemes • 100% Direct DBT Disbursal
          </p>
        </div>

        {/* Right: Category-wise Quota & Beneficiary Allocation Matrix (Interactive Category Cards Grid) */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 lg:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-extrabold text-brand-900 tracking-tight">
                    Category Quota Allocation Matrix
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                    {categoryData.length} Categories
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Applicants vs Sanctioned Beneficiaries & Fill Ratio</p>
              </div>
            </div>

            {/* 2-Column Grid of Category Cards with Mini SVG Circular Progress Meters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              {categoryData.map((cat) => {
                const convRate = ((cat.beneficiaries / cat.applicants) * 100).toFixed(0);
                const strokeColor =
                  cat.code === "OBC" ? "#2563eb" :
                  cat.code === "EBC" ? "#0d9488" :
                  cat.code === "SC" ? "#7c3aed" :
                  cat.code === "ST" ? "#d97706" :
                  cat.code === "VJNT" ? "#0284c7" : "#475569";

                return (
                  <div
                    key={cat.code}
                    onMouseMove={(e) =>
                      setTooltip({
                        data: {
                          title: `${cat.name} (${cat.code}) — Quota Allocation`,
                          subtitle: "State Welfare Department Reservation Quota",
                          items: [
                            { label: "Category", value: cat.name },
                            { label: "Registered Applicants", value: cat.applicants.toLocaleString("en-IN") },
                            { label: "Sanctioned Beneficiaries", value: cat.beneficiaries.toLocaleString("en-IN"), highlight: true },
                            { label: "Sanction Clearance Ratio", value: `${convRate}%` },
                          ],
                        },
                        pos: { x: e.clientX, y: e.clientY },
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    className="bg-slate-50/80 hover:bg-white hover:shadow-md hover:border-blue-200 p-3 rounded-2xl border border-slate-100 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`px-1.5 py-0.5 rounded-md font-black text-[10px] border ${cat.badgeColor}`}>
                          {cat.code}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition-colors truncate" title={cat.name}>
                          {cat.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                        <span>{cat.applicants.toLocaleString("en-IN")} App.</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-teal-700 font-extrabold">{cat.beneficiaries.toLocaleString("en-IN")} Sanc.</span>
                      </div>
                    </div>

                    {/* Circular SVG Gauge Meter */}
                    <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="3.5"
                          strokeDasharray="87.96"
                          strokeDashoffset={87.96 - (87.96 * Number(convRate)) / 100}
                          strokeLinecap="round"
                          className="transition-all duration-700"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800">
                        {Math.round(Number(convRate))}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic text-center mt-3 pt-2.5 border-t border-slate-100">
            *Reservation quotas managed under Social Justice & Tribal Welfare Directives
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. STREAM INTELLIGENCE RADAR GRAPH + ADMISSION CHANNEL GAUGE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Multi-Faculty Radar/Spider Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-borderLight shadow-soft p-6 lg:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-extrabold text-brand-900 tracking-tight">
                    Stream-wise Academic Intelligence
                  </h3>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                    7 Core Streams • Multi-Axis Radar Plot
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Faculty-wise Applicants vs Sanctioned Beneficiaries comparison</p>
              </div>
            </div>

            {/* SVG Spider Radar Chart */}
            <div className="py-2 flex items-center justify-center">
              <StreamRadarChart
                data={streamData}
                onTooltip={(data, pos) => setTooltip(data && pos ? { data, pos } : null)}
              />
            </div>
          </div>

          <div className="mt-2 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span className="text-blue-900 font-bold flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500" />
              Highest Demand: Engineering & Tech ({streamData[0]?.beneficiaries.toLocaleString("en-IN")} Beneficiaries)
            </span>
            <span className="text-slate-400">Total 7 Technical & General Faculties</span>
          </div>
        </div>

        {/* Right 1 Col: Admission Channel Speedometer Radial Gauge */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 lg:p-7 flex flex-col justify-between">
          <div>
            <div className="mb-2 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-brand-900">
                  Admission Channel Split
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">CAP Merit Round vs Institutional Spot Quota</p>
              </div>
              <span className="text-[10px] font-black bg-blue-50 text-blue-800 border border-blue-100 px-2 py-0.5 rounded-lg">
                Radial Meter
              </span>
            </div>

            {/* Speedometer Gauge Component */}
            <ChannelSpeedometerGauge
              capCount={Math.round(961168 * multiplier)}
              spotCount={Math.round(32050 * multiplier)}
              onTooltip={(data, pos) => setTooltip(data && pos ? { data, pos } : null)}
            />
          </div>

          <p className="text-[10px] text-slate-400 italic text-center mt-2 pt-2 border-t border-slate-100">
            *96.3% of all beneficiaries enrolled through centralized State Merit round
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. DEPARTMENTAL LEADERBOARD + SCHEME CLUSTERED COLUMN CHART */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Ranked Department Performance Leaderboard */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 lg:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                    Department Performance Ranking
                  </h3>
                  <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                    Top 5 Welfare Departments
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Ranked by total scholarship outlay & beneficiary reach</p>
              </div>
            </div>

            <div className="space-y-3 mt-2">
              {departmentData.map((dep) => {
                const effRate = ((dep.beneficiaries / dep.applicants) * 100).toFixed(0);
                return (
                  <div
                    key={dep.rank}
                    onMouseMove={(e) =>
                      setTooltip({
                        data: {
                          title: dep.name,
                          subtitle: `Statewide Ranking: #${dep.rank} of 5 Departments`,
                          items: [
                            { label: "Department", value: dep.name },
                            { label: "Sanctioned Beneficiaries", value: dep.beneficiaries.toLocaleString("en-IN"), highlight: true },
                            { label: "Total Fund Outlay", value: `₹ ${dep.outlayCr} Cr` },
                            { label: "Disbursal Approval Rate", value: `${effRate}% (${dep.efficiency})` },
                          ],
                        },
                        pos: { x: e.clientX, y: e.clientY },
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    className="bg-slate-50/90 hover:bg-blue-50/60 p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                        dep.rank === 1 ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20" :
                        dep.rank === 2 ? "bg-slate-300 text-slate-900" :
                        dep.rank === 3 ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-700"
                      }`}>
                        #{dep.rank}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 truncate max-w-[220px] sm:max-w-[260px]">{dep.name}</h4>
                        <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                          {dep.beneficiaries.toLocaleString("en-IN")} Sanctioned • ₹{dep.outlayCr} Cr Outlay
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-black bg-white border border-slate-200 text-blue-900 shadow-2xs">
                        {effRate}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Leader: Social Justice & Special Assistance</span>
            <span className="text-blue-900 font-bold">₹ 2,140.5 Cr Total Allocation</span>
          </div>
        </div>

        {/* Right: Scheme-wise Scholarship Budget Clustered Column Chart */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 lg:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                    Scheme Budget Utilization Matrix
                  </h3>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                    Clustered Column Chart (₹ Cr)
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Fiscal Year 2024-2025 Allotted vs Disbursed Outlays</p>
              </div>
            </div>

            {/* SVG Clustered Column Chart */}
            <div className="py-2">
              <ClusteredSchemeChart
                schemes={schemeData}
                onTooltip={(data, pos) => setTooltip(data && pos ? { data, pos } : null)}
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic text-center mt-3 pt-2.5 border-t border-slate-100">
            *Direct benefit transfer funds released via Treasury Single Account (TSA)
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. APPLICATION STATUS DONUT & QUALIFICATION STEPPED FUNNEL */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Application Pipeline Status (Interactive Donut) */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 lg:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                    Application Pipeline Status
                  </h3>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                    6 Pipeline Stages
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Scrutiny, verification, and disbursement progress</p>
              </div>
            </div>

            <InteractiveDoughnut
              title="Application Pipeline Status Breakdown"
              onExpand={(title, slices) => setExpandedPieData({ title, slices })}
              onTooltip={(data, pos) => setTooltip(data && pos ? { data, pos } : null)}
              columns={2}
              slices={(() => {
                const total = applicationStatusData.reduce((sum, s) => sum + s.count, 0);
                return applicationStatusData.map((s) => ({
                  label: s.status,
                  value: Number(((s.count / total) * 100).toFixed(1)),
                  raw: s.count.toLocaleString("en-IN"),
                  color: s.color || "#1e3a8a",
                }));
              })()}
              totalLabel="Total Applications"
              totalValue={summary.applicants.toLocaleString("en-IN")}
            />
          </div>
        </div>

        {/* Right: Qualification Level Stepped Funnel Chart */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 lg:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                  Qualification Level Distribution
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Stepped Education Funnel & Beneficiary Conversion</p>
              </div>
              <span className="text-[10px] font-black text-indigo-900 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-xl">
                4-Tier Funnel
              </span>
            </div>

            {/* Stepped Funnel Chart */}
            <div className="py-2">
              <SteppedFunnelChart
                tiers={qualificationData}
                onTooltip={(data, pos) => setTooltip(data && pos ? { data, pos } : null)}
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic text-center mt-3 pt-2.5 border-t border-slate-100">
            *Higher conversion observed in Undergraduate professional programs
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. YEAR-ON-YEAR TREND & DISTRICT DISTRIBUTION TABLE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1 Col: Year on Year Scholarship Disbursed (₹ Cr) */}
        <div className="bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-brand-900">
                  Year on Year Disbursed
                </h3>
                <p className="text-xs text-slate-400 font-semibold">Total Funds Disbursed (₹ Cr)</p>
              </div>
              <TrendingUp size={20} className="text-blue-600" />
            </div>

            {/* Visual SVG Area & Line Chart */}
            <div className="h-52 relative flex flex-col justify-end pt-4 pb-6">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-2 top-4 bottom-8 w-[calc(100%-16px)] h-36 overflow-visible pointer-events-none">
                <defs>
                  <linearGradient id="disbursedBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon
                  fill="url(#disbursedBlueGrad)"
                  points={`0,100 ${yoyDisbursedData.map((d, i) => `${(i / (yoyDisbursedData.length - 1)) * 100},${100 - ((d.amount - 3000) / 2500) * 100}`).join(" ")} 100,100`}
                />
                <polyline
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={yoyDisbursedData.map((d, i) => `${(i / (yoyDisbursedData.length - 1)) * 100},${100 - ((d.amount - 3000) / 2500) * 100}`).join(" ")}
                />
              </svg>

              <div className="relative z-10 grid grid-cols-4 h-full items-end">
                {yoyDisbursedData.map((d) => {
                  const y = 100 - ((d.amount - 3000) / 2500) * 100;
                  return (
                    <div
                      key={d.year}
                      onMouseMove={(e) =>
                        setTooltip({
                          data: {
                            title: `F.Y. ${d.year} — Disbursal Total`,
                            subtitle: "Direct Benefit Transfer Disbursement Outlay",
                            items: [
                              { label: "Fiscal Year", value: d.year },
                              { label: "Total Disbursed", value: `₹ ${d.amount} Cr`, highlight: true },
                            ],
                          },
                          pos: { x: e.clientX, y: e.clientY },
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                      className="flex flex-col items-center h-full justify-end relative cursor-pointer"
                    >
                      <div
                        style={{ top: `${y}%`, transform: "translateY(-50%)" }}
                        className="absolute w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-md shadow-blue-500/30 hover:scale-150 transition-transform"
                      />
                      <span
                        style={{ top: `calc(${y}% - 22px)` }}
                        className="absolute text-[10px] font-black text-blue-950 bg-white/95 border border-slate-100 px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap"
                      >
                        ₹ {d.amount.toFixed(0)}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 mt-2">{d.year}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="text-[11px] font-extrabold text-blue-900 bg-blue-50/90 border border-blue-100 p-2.5 rounded-xl text-center">
            +39.2% 4-Year Growth in Scholarship Outlay
          </p>
        </div>

        {/* Right 2 Cols: District-wise Breakdown Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-borderLight shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base md:text-lg font-extrabold text-brand-900">
                  District-wise Applicants vs Beneficiaries
                </h3>
                <p className="text-xs text-slate-400 font-semibold">West Bengal Administrative Districts</p>
              </div>

              {/* District Search */}
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  placeholder="Search West Bengal district..."
                  value={districtSearch}
                  onChange={(e) => setDistrictSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              </div>
            </div>

            {/* Table with Info Tooltips */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar border border-slate-100 rounded-2xl shadow-inner">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-100 text-slate-600 font-extrabold sticky top-0">
                  <tr>
                    <th className="p-3 pl-4">District</th>
                    <th className="p-3 text-right">Applicants</th>
                    <th className="p-3 text-right">Beneficiaries</th>
                    <th className="p-3 text-right">Disbursed (₹ Cr)</th>
                    <th className="p-3 text-right pr-4">Success %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                  {districtData.map((d) => (
                    <tr
                      key={d.district}
                      onMouseMove={(e) =>
                        setTooltip({
                          data: {
                            title: `District: ${d.district}`,
                            subtitle: "West Bengal Administrative Division",
                            items: [
                              { label: "District Name", value: d.district },
                              { label: "Applicants", value: d.applicants.toLocaleString("en-IN") },
                              { label: "Beneficiaries", value: d.beneficiaries.toLocaleString("en-IN"), highlight: true },
                              { label: "Funds Disbursed", value: `₹ ${d.disbursedCr} Cr` },
                              { label: "Success Rate", value: `${d.rate}%` },
                            ],
                          },
                          pos: { x: e.clientX, y: e.clientY },
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                      className="hover:bg-blue-50/60 transition-colors cursor-pointer"
                    >
                      <td className="p-2.5 pl-4 font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 size={13} className="text-blue-500" />
                        {d.district}
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-900">{d.applicants.toLocaleString("en-IN")}</td>
                      <td className="p-2.5 text-right text-blue-700 font-extrabold">{d.beneficiaries.toLocaleString("en-IN")}</td>
                      <td className="p-2.5 text-right font-bold">₹ {d.disbursedCr.toFixed(1)}</td>
                      <td className="p-2.5 text-right pr-4">
                        <span className="bg-blue-50 text-blue-800 border border-blue-100 font-extrabold px-2 py-0.5 rounded-lg text-[11px]">
                          {d.rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic text-center mt-3">
            *Showing top districts ordered by total scholarship applications
          </p>
        </div>

      </div>

      {expandedPieData && (
        <PieChart3DModal
          title={expandedPieData.title}
          slices={expandedPieData.slices}
          onClose={() => setExpandedPieData(null)}
        />
      )}
    </div>
  );
}
