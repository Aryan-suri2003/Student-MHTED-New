import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Filter,
  Sparkles,
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Check,
} from 'lucide-react';
import { westBengalDistricts } from '../data/mockData';
import { DistrictData, Language } from '../types';

interface GrowthAnalysisSectionProps {
  language: Language;
  onSelectDistrict: (districtId: string) => void;
  selectedDistrict: string;
  filteredDistricts: DistrictData[];
  allDistricts?: DistrictData[];
}

export const GrowthAnalysisSection: React.FC<GrowthAnalysisSectionProps> = ({
  language,
  onSelectDistrict,
  selectedDistrict,
  filteredDistricts,
  allDistricts = filteredDistricts,
}) => {
  const [previousYear, setPreviousYear] = useState('2023-2024');
  const [filterMode, setFilterMode] = useState<'all' | 'gainers' | 'losers'>('all');
  const [sortBy, setSortBy] = useState<'growth-desc' | 'growth-asc' | 'name'>('growth-desc');
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);

  // Modern Dropdown Popover States
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isBaseOpen, setIsBaseOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
      if (baseRef.current && !baseRef.current.contains(e.target as Node)) {
        setIsBaseOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions = [
    { value: 'growth-desc', label: language === 'bn' ? 'সর্বোচ্চ বৃদ্ধি' : 'Highest Growth' },
    { value: 'growth-asc', label: language === 'bn' ? 'সর্বনিম্ন বৃদ্ধি' : 'Lowest Growth' },
    { value: 'name', label: language === 'bn' ? 'জেলার নাম (A-Z)' : 'District Name (A-Z)' },
  ];

  const baseYearOptions = [
    { value: '2023-2024', label: '2023-2024' },
    { value: '2022-2023', label: '2022-2023' },
    { value: '2021-2022', label: '2021-2022' },
  ];

  // Base list of districts to always display in the graph to avoid disappearing elements
  const baseDistricts = useMemo(() => {
    return allDistricts && allDistricts.length > 0 ? allDistricts : filteredDistricts;
  }, [allDistricts, filteredDistricts]);

  // Sorted list of districts (always keeping all districts rendered)
  const displayedDistricts = useMemo(() => {
    const result = [...baseDistricts];

    if (sortBy === 'growth-desc') {
      result.sort((a, b) => b.growthPct - a.growthPct);
    } else if (sortBy === 'growth-asc') {
      result.sort((a, b) => a.growthPct - b.growthPct);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [baseDistricts, sortBy]);

  const gainersCount = baseDistricts.filter((d) => d.growthPct >= 0).length;
  const declinersCount = baseDistricts.filter((d) => d.growthPct < 0).length;

  const avgGrowth = useMemo(() => {
    if (baseDistricts.length === 0) return 0;
    const sum = baseDistricts.reduce((acc, d) => acc + d.growthPct, 0);
    return Number((sum / baseDistricts.length).toFixed(2));
  }, [baseDistricts]);

  // SVG Dimension parameters for vector rendering
  const svgWidth = 1120;
  const svgHeight = 310;
  const margin = { top: 40, right: 36, bottom: 96, left: 40 };
  const plotWidth = svgWidth - margin.left - margin.right;

  const maxPositive = Math.max(1, ...displayedDistricts.map((d) => d.growthPct));
  const maxNegative = Math.abs(Math.min(-0.1, ...displayedDistricts.map((d) => d.growthPct)));

  // Proportional zero baseline placement
  const topSpace = 105; // max positive bar height
  const bottomSpace = 65; // max negative bar height
  const zeroY = margin.top + topSpace; // ~145px

  const numBars = displayedDistricts.length;
  const step = numBars > 0 ? plotWidth / numBars : plotWidth;
  const barWidth = Math.min(26, Math.max(10, step * 0.65));

  const hoveredDistrict = hoveredDistrictId ? displayedDistricts.find((d) => d.id === hoveredDistrictId) : null;
  const activeSelectedDistrict = selectedDistrict !== 'all' ? displayedDistricts.find((d) => d.id === selectedDistrict) : null;

  return (
    <div
      id="growth-analysis-card"
      className="w-full flex flex-col pt-2"
    >
      {/* Clean Executive Header (Open Layout) */}
      <div className="pb-3 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
        {/* Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                  {language === 'bn'
                    ? 'সদস্য বৃদ্ধির হার বৃদ্ধি/হ্রাস ট্র্যাজেক্টরি'
                    : 'Membership Growth & Trajectory Analysis (YoY % Change)'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <Sparkles className="w-2.5 h-2.5" />
                  Synced
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Comparative member registration dynamics across all 23 administrative districts
              </p>
            </div>
            {selectedDistrict !== 'all' && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-950 font-bold hidden xl:inline-flex items-center gap-1 shrink-0 border border-blue-200">
                <span>Selected:</span>
                <strong>{westBengalDistricts.find((d) => d.id === selectedDistrict)?.name}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Quick Category Filter Pills */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs shadow-2xs">
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({baseDistricts.length})
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => setFilterMode(filterMode === 'gainers' ? 'all' : 'gainers')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === 'gainers'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <ArrowUpRight className="w-3 h-3" />
              +{gainersCount}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => setFilterMode(filterMode === 'losers' ? 'all' : 'losers')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === 'losers'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-rose-800 hover:bg-rose-50'
              }`}
            >
              <ArrowDownRight className="w-3 h-3" />
              -{declinersCount}
            </motion.button>
          </div>

          {/* Modern Sort Selector */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsBaseOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none shadow-2xs ${
                isSortOpen
                  ? 'bg-white border-blue-500 ring-2 ring-blue-100 text-blue-900'
                  : 'bg-white/90 hover:bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Sort:</span>
              <span className="text-slate-800 font-semibold max-w-[110px] truncate">
                {sortOptions.find((o) => o.value === sortBy)?.label}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isSortOpen ? 'rotate-180 text-blue-600' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200/90 p-1.5 z-40"
                >
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold px-2 py-1">
                    Sort Districts By
                  </div>
                  {sortOptions.map((opt) => {
                    const isSelected = sortBy === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.value as any);
                          setIsSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-blue-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Modern Base Year Selector */}
          <div className="relative" ref={baseRef}>
            <button
              type="button"
              onClick={() => {
                setIsBaseOpen(!isBaseOpen);
                setIsSortOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none shadow-2xs ${
                isBaseOpen
                  ? 'bg-white border-blue-500 ring-2 ring-blue-100 text-blue-900'
                  : 'bg-white/90 hover:bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Base:</span>
              <span className="text-slate-800 font-mono font-bold">{previousYear}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isBaseOpen ? 'rotate-180 text-emerald-600' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {isBaseOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-slate-200/90 p-1.5 z-40"
                >
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold px-2 py-1">
                    Benchmark Year
                  </div>
                  {baseYearOptions.map((opt) => {
                    const isSelected = previousYear === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setPreviousYear(opt.value);
                          setIsBaseOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-950 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="font-mono">{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {selectedDistrict !== 'all' && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectDistrict('all')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Clear selection"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Graph SVG Container */}
      <div className="w-full bg-gradient-to-b from-white via-slate-50/30 to-slate-50/70 px-3 py-3 select-none overflow-hidden relative">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-h-[360px] block"
          style={{ overflow: 'visible' }}
        >
          {/* SVG GRADIENTS DEFINITION */}
          <defs>
            {/* Emerald Gradient for Positive Growth */}
            <linearGradient id="emeraldBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
              <stop offset="30%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="70%" stopColor="#059669" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="emeraldBarHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="1" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="100%" stopColor="#047857" stopOpacity="1" />
            </linearGradient>

            {/* Ruby / Crimson Gradient for Negative Growth */}
            <linearGradient id="rubyBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#f43f5e" stopOpacity="1" />
              <stop offset="70%" stopColor="#e11d48" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#9f1239" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="rubyBarHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fda4af" stopOpacity="1" />
              <stop offset="50%" stopColor="#f43f5e" stopOpacity="1" />
              <stop offset="100%" stopColor="#881337" stopOpacity="1" />
            </linearGradient>

            {/* Selected Bar Gradient (Vibrant Cyan-Azure to Deep Royal Midnight) */}
            <linearGradient id="selectedBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="35%" stopColor="#0284c7" stopOpacity="1" />
              <stop offset="75%" stopColor="#1d4ed8" stopOpacity="1" />
              <stop offset="100%" stopColor="#002244" stopOpacity="1" />
            </linearGradient>

            {/* Bar Glass Sheen Highlight */}
            <linearGradient id="barGlassSheen" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Soft Grid glow effect */}
            <linearGradient id="zeroLineGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.2" />
              <stop offset="15%" stopColor="#64748b" stopOpacity="1" />
              <stop offset="85%" stopColor="#64748b" stopOpacity="1" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.2" />
            </linearGradient>

            {/* Enhanced Filter for glowing drop shadow */}
            <filter id="barGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.15" />
            </filter>
            <filter id="hoverGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#0284c7" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Reference Grid lines */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={svgWidth - margin.right}
            y2={margin.top}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />
          <text
            x={margin.left - 8}
            y={margin.top + 3}
            textAnchor="end"
            fontSize="9"
            fontWeight="700"
            fill="#94a3b8"
            fontFamily="monospace"
          >
            +{maxPositive.toFixed(0)}%
          </text>

          <line
            x1={margin.left}
            y1={zeroY - topSpace / 2}
            x2={svgWidth - margin.right}
            y2={zeroY - topSpace / 2}
            stroke="#f1f5f9"
            strokeDasharray="3 3"
          />

          <line
            x1={margin.left}
            y1={zeroY + bottomSpace}
            x2={svgWidth - margin.right}
            y2={zeroY + bottomSpace}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />
          <text
            x={margin.left - 8}
            y={zeroY + bottomSpace + 3}
            textAnchor="end"
            fontSize="9"
            fontWeight="700"
            fill="#94a3b8"
            fontFamily="monospace"
          >
            -{maxNegative.toFixed(0)}%
          </text>

          {/* Solid Zero Axis Baseline with Gradient Stroke */}
          <line
            x1={margin.left - 12}
            y1={zeroY}
            x2={svgWidth - margin.right + 12}
            y2={zeroY}
            stroke="url(#zeroLineGlow)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx={margin.left - 12} cy={zeroY} r="3" fill="#64748b" />
          <circle cx={svgWidth - margin.right + 12} cy={zeroY} r="3" fill="#64748b" />

          {/* Zero baseline tag */}
          <text
            x={margin.left - 8}
            y={zeroY + 3}
            textAnchor="end"
            fontSize="9"
            fontWeight="800"
            fill="#475569"
            fontFamily="monospace"
          >
            0%
          </text>

          {/* District Bars & Tilted Labels - SMOOTH FADE OUT ON SELECTION */}
          {displayedDistricts.map((district, i) => {
            const isPositive = district.growthPct >= 0;
            const isSelected = selectedDistrict === district.id;
            const isHovered = hoveredDistrictId === district.id;

            // Determine if this element should be faded out (dimmed)
            let isDimmed = false;
            if (selectedDistrict !== 'all') {
              isDimmed = !isSelected;
            } else if (filterMode === 'gainers') {
              isDimmed = !isPositive;
            } else if (filterMode === 'losers') {
              isDimmed = isPositive;
            } else if (hoveredDistrictId && !isHovered) {
              isDimmed = true;
            }

            const x = margin.left + i * step + (step - barWidth) / 2;
            const xCenter = x + barWidth / 2;

            // Height calculations
            let barH = 0;
            let barY = zeroY;
            let labelY = zeroY;

            if (isPositive) {
              barH = Math.max(4, (district.growthPct / maxPositive) * topSpace);
              barY = zeroY - barH;
              labelY = barY - 7;
            } else {
              barH = Math.max(4, (Math.abs(district.growthPct) / maxNegative) * bottomSpace);
              barY = zeroY;
              labelY = zeroY + barH + 13;
            }

            // Gradient Fill Selection
            let fillGradient = isPositive ? 'url(#emeraldBarGradient)' : 'url(#rubyBarGradient)';
            if (isSelected) {
              fillGradient = 'url(#selectedBarGradient)';
            } else if (isHovered) {
              fillGradient = isPositive ? 'url(#emeraldBarHover)' : 'url(#rubyBarHover)';
            }

            // Text label for percentage value
            const formattedPct = `${district.growthPct.toFixed(1)}%`;

            // Tilted text position below the negative baseline
            const textYStart = zeroY + bottomSpace + 18;

            return (
              <g
                key={district.id}
                className="cursor-pointer transition-all duration-300 group"
                onClick={() => onSelectDistrict(isSelected ? 'all' : district.id)}
                onMouseEnter={() => setHoveredDistrictId(district.id)}
                onMouseLeave={() => setHoveredDistrictId(null)}
                style={{
                  opacity: isDimmed ? (hoveredDistrictId ? 0.45 : 0.22) : 1,
                  transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* Invisible hover hotspot */}
                <rect
                  x={x - 3}
                  y={margin.top - 12}
                  width={barWidth + 6}
                  height={svgHeight - margin.top + 12}
                  fill="transparent"
                />

                {/* Vertical subtle column hover guide */}
                {(isHovered || isSelected) && (
                  <rect
                    x={x - 2}
                    y={margin.top}
                    width={barWidth + 4}
                    height={zeroY + bottomSpace - margin.top + 4}
                    fill={isSelected ? '#0284c7' : '#38bdf8'}
                    fillOpacity={isSelected ? 0.12 : 0.08}
                    rx="4"
                  />
                )}

                {/* The Gradient-Filled Bar with Rounded Cap */}
                <rect
                  x={x}
                  y={barY}
                  width={barWidth}
                  height={barH}
                  fill={fillGradient}
                  rx={3.5}
                  filter={isSelected || isHovered ? 'url(#hoverGlow)' : 'url(#barGlow)'}
                  stroke={isSelected ? '#ffffff' : isHovered ? '#ffffff' : 'rgba(255,255,255,0.45)'}
                  strokeWidth={isSelected ? 2.5 : isHovered ? 1.5 : 0.8}
                  style={{
                    transformOrigin: `${xCenter}px ${zeroY}px`,
                    transform: isHovered || isSelected ? 'scaleY(1.06) scaleX(1.04)' : 'scaleY(1) scaleX(1)',
                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />

                {/* Glass specular sheen on the left half of the bar */}
                <rect
                  x={x}
                  y={barY}
                  width={Math.max(2, barWidth * 0.45)}
                  height={barH}
                  fill="url(#barGlassSheen)"
                  rx={3}
                  pointerEvents="none"
                  style={{
                    transformOrigin: `${xCenter}px ${zeroY}px`,
                    transform: isHovered || isSelected ? 'scaleY(1.06) scaleX(1.04)' : 'scaleY(1) scaleX(1)',
                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />

                {/* Percentage Text Label */}
                <text
                  x={xCenter}
                  y={labelY}
                  textAnchor="middle"
                  fontSize={numBars > 20 ? '9.5' : '11'}
                  fontWeight={isSelected || isHovered ? '900' : '700'}
                  fill={isSelected ? '#003366' : isPositive ? '#047857' : '#be123c'}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  style={{ userSelect: 'none' }}
                >
                  {formattedPct}
                </text>

                {/* Tilted District Name (-45 degrees angle) */}
                <text
                  x={xCenter}
                  y={textYStart}
                  transform={`rotate(-45, ${xCenter}, ${textYStart})`}
                  textAnchor="end"
                  fontSize={numBars > 20 ? '10' : '11.5'}
                  fontWeight={isSelected ? '900' : isHovered ? '800' : '600'}
                  fill={isSelected ? '#003366' : isHovered ? '#0f172a' : '#475569'}
                  style={{
                    userSelect: 'none',
                    transition: 'fill 0.15s ease',
                  }}
                >
                  {district.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Quick Detail Pill on Hover */}
        <AnimatePresence>
          {hoveredDistrict && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-3 right-4 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs shadow-xl border border-slate-700/80 flex items-center gap-2.5 pointer-events-none z-20"
            >
              <span className="font-bold">{hoveredDistrict.name}</span>
              <span className="text-slate-400">|</span>
              <span className="font-mono">Members: {hoveredDistrict.totalMembers.toLocaleString('en-IN')}</span>
              <span className="text-slate-400">|</span>
              <span className={`font-black ${hoveredDistrict.growthPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {hoveredDistrict.growthPct >= 0 ? `+${hoveredDistrict.growthPct}%` : `${hoveredDistrict.growthPct}%`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Executive Footer Metrics Bar */}
      <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Positive Growth: <strong className="text-slate-900 font-bold">{gainersCount} districts</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Decline: <strong className="text-slate-900 font-bold">{declinersCount} districts</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">
            Statewide Avg YoY Change:
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
            avgGrowth >= 0
              ? 'bg-emerald-100/80 text-emerald-900 border-emerald-300'
              : 'bg-rose-100/80 text-rose-900 border-rose-300'
          }`}>
            {avgGrowth >= 0 ? `+${avgGrowth}%` : `${avgGrowth}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
