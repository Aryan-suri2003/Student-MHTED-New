import React, { useState } from 'react';
import {
  Laptop,
  Users,
  Building,
  Bus,
  Dumbbell,
  User,
  Briefcase,
  Factory,
  Globe,
  GraduationCap
} from 'lucide-react';
import {
  ResponsiveContainer,
  Sector
} from 'recharts';
import { NAAC_COLLEGE_DISTRIBUTION, DASHBOARD_METRICS } from '../../data/mockData';
import { GroupedMetricData, MetricData } from '../../types';
import { ComparisonBar } from '../charts/ComparisonBar';
import { MousPieChartCard } from '../charts/MousPieChartCard';
import { RadialGauge } from '../charts/RadialGauge';
import { TrendCard } from '../charts/TrendCard';
import { DeltaIndicator } from '../charts/DeltaIndicator';
import { DistrictChoroplethMap } from '../charts/DistrictChoroplethMap';
import { FilterState } from '../../types';

const PIE_COLORS = [
  { top: '#4f46e5', side: '#312e81' }, // Indigo A++
  { top: '#8b5cf6', side: '#4c1d95' }, // Violet A+
  { top: '#06b6d4', side: '#164e63' }, // Cyan A
  { top: '#10b981', side: '#064e3b' }, // Emerald B++
  { top: '#f59e0b', side: '#78350f' }, // Amber B+
  { top: '#f43f5e', side: '#881337' }, // Rose B
  { top: '#64748b', side: '#0f172a' }, // Slate C
];

const Premium3DPieChart = ({ data, activeIndex, setActiveIndex }: any) => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null as any });

  const total = data.reduce((sum: number, item: any) => sum + item.count, 0);

  let currentAngle = 90;

  const slices = data.map((item: any, index: number) => {
    const angle = (item.count / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle - angle;
    currentAngle = endAngle;

    const midAngle = (startAngle + endAngle) / 2;

    return {
      ...item,
      startAngle,
      endAngle,
      midAngle,
      index,
      color: PIE_COLORS[index % PIE_COLORS.length]
    };
  });

  const sortedSlices = [...slices].sort((a, b) => {
    const RADIAN = Math.PI / 180;
    const yA = Math.sin(-a.midAngle * RADIAN);
    const yB = Math.sin(-b.midAngle * RADIAN);
    return yA - yB;
  });

  const handleMouseMove = (e: any, slice: any) => {
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      data: slice
    });
    setActiveIndex(slice.index);
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, data: null });
    setActiveIndex(null);
  };

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="-250 -250 500 500" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="pie-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="25" stdDeviation="15" floodOpacity="0.15" floodColor="#000" />
          </filter>
          <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity={0.25} />
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </linearGradient>
        </defs>

        <g filter="url(#pie-shadow)">
          <g transform="scale(1, 0.65)">
            {sortedSlices.map((slice) => {
              const isHovered = activeIndex === slice.index;

              const explodeBase = 12;
              const explodeHover = isHovered ? 28 : explodeBase;

              const RADIAN = Math.PI / 180;
              const ex = Math.cos(-slice.midAngle * RADIAN) * explodeBase;
              const ey = Math.sin(-slice.midAngle * RADIAN) * explodeBase;

              const hoverTx = isHovered ? Math.cos(-slice.midAngle * RADIAN) * (explodeHover - explodeBase) : 0;
              const hoverTy = isHovered ? Math.sin(-slice.midAngle * RADIAN) * (explodeHover - explodeBase) : 0;

              const depth = 40;
              const yCompensation = 1 / 0.65;

              const layers = [];
              for (let i = depth; i > 0; i -= 1) {
                layers.push(
                  <Sector
                    key={`side-${slice.index}-${i}`}
                    cx={ex}
                    cy={ey + (i * yCompensation)}
                    innerRadius={0}
                    outerRadius={155}
                    startAngle={slice.startAngle}
                    endAngle={slice.endAngle}
                    fill={slice.color.side}
                    stroke={slice.color.side}
                    strokeWidth={1}
                  />
                );
              }

              layers.push(
                <Sector
                  key={`top-${slice.index}`}
                  cx={ex}
                  cy={ey}
                  innerRadius={0}
                  outerRadius={155}
                  startAngle={slice.startAngle}
                  endAngle={slice.endAngle}
                  fill={slice.color.top}
                />
              );

              layers.push(
                <Sector
                  key={`gloss-${slice.index}`}
                  cx={ex}
                  cy={ey}
                  innerRadius={0}
                  outerRadius={155}
                  startAngle={slice.startAngle}
                  endAngle={slice.endAngle}
                  fill="url(#gloss)"
                  pointerEvents="none"
                />
              );

              return (
                <g
                  key={`slice-group-${slice.index}`}
                  onMouseMove={(e) => handleMouseMove(e, slice)}
                  onMouseLeave={handleMouseLeave}
                  className="cursor-pointer transition-transform duration-300 ease-out"
                  style={{ transform: `translate(${hoverTx}px, ${hoverTy}px)` }}
                >
                  {layers}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {tooltip.visible && tooltip.data && (
        <div
          className="fixed pointer-events-none z-50 bg-white border border-slate-200 shadow-xl rounded-xl px-5 py-4 transform -translate-x-1/2 -translate-y-[130%]"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tooltip.data.color.top }} />
            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              Grade {tooltip.data.grade}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {tooltip.data.count.toLocaleString()} <span className="text-sm font-semibold text-slate-500">Colleges</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface AffiliationViewProps {
  filters: FilterState;
  onOpenDrilldown: (title: string, data: any, type: string) => void;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

export const AffiliationView: React.FC<AffiliationViewProps> = ({
  filters,
  onOpenDrilldown,
  onFilterChange
}) => {
  const [activeNaacIndex, setActiveNaacIndex] = useState<number | null>(null);

  // Map MoUs data for ConcentricProgressCard
  const mousData = DASHBOARD_METRICS.mousAffiliation as GroupedMetricData;
  const mousItems = mousData.parts.map((p, idx) => {
    let icon = Globe;
    let color = '#3b82f6';
    if (p.label.includes('Industries')) {
      icon = Building;
      color = '#3b82f6'; // Blue
    } else if (p.label.includes('International')) {
      icon = Globe;
      color = '#ef4444'; // Red
    } else {
      icon = Users;
      color = '#10b981'; // Green
    }
    return {
      label: p.label,
      value: p.value,
      deltaPercent: p.deltaPercent || 0,
      icon,
      color
    };
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-12 items-start">

      {/* LEFT SIDE: KPIs & Charts */}
      <div className="xl:col-span-7 2xl:col-span-8 flex flex-col space-y-6">

        {/* Top Banner: Colleges & Polytechnics Equation */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 md:gap-16 text-center">
            {/* Total */}
            <div>
              <p className="text-4xl font-bold text-slate-900 tracking-tight">
                8,064
              </p>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-2">
                Colleges & Polytechnics
              </p>
            </div>

            {/* Equal Symbol */}
            <div className="text-2xl font-light text-slate-300 hidden sm:block">
              =
            </div>

            {/* Colleges */}
            <div>
              <p className="text-4xl font-bold text-indigo-600 tracking-tight">
                7,377
              </p>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-2">
                Colleges
              </p>
            </div>

            {/* Plus Symbol */}
            <div className="text-2xl font-light text-slate-300 hidden sm:block">
              +
            </div>

            {/* Polytechnics */}
            <div>
              <p className="text-4xl font-bold text-indigo-600 tracking-tight">
                687
              </p>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-2">
                Polytechnics
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-right text-[10px] text-slate-400 font-medium tracking-wide">
          DATA REFRESHED: 14-AUG-2026
        </div>

        {/* INFRASTRUCTURE SECTION */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600" />
            Infrastructure Overview
          </h3>

          {/* Infrastructure Cards layout */}
          <div className="flex flex-col 2xl:flex-row gap-3 items-stretch mb-4">

            {/* Card 1: New Universities Trend */}
            <div className="w-full 2xl:w-[260px] shrink-0">
              <TrendCard
                title="New Colleges Added"
                value={22}
                deltaPercent={45}
                icon={Building}
              />
            </div>

            {/* Card 2: Hostels (Comparison Bar) - Flexible Width */}
            <div className="w-full flex-1 min-w-[200px]">
              <ComparisonBar
                title="Hostels Breakdown"
                left={(DASHBOARD_METRICS.hostelsAffiliation as GroupedMetricData).parts[0] as any}
                right={(DASHBOARD_METRICS.hostelsAffiliation as GroupedMetricData).parts[1] as any}
              />
            </div>
          </div>

          {/* Small Square Cards Group */}
          <div className="flex flex-wrap gap-3 shrink-0 items-stretch">
            {/* Card 4: Meeting Rooms */}
            <div className="w-full sm:flex-1 sm:min-w-[120px] p-4 flex flex-col items-center justify-center text-center shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight mb-1">
                Meeting<br />Rooms
              </span>
              <p className="text-base font-bold text-slate-900">19,272</p>
            </div>

            {/* Card 5: Staff Rooms */}
            <div className="w-full sm:flex-1 sm:min-w-[120px] p-4 flex flex-col items-center justify-center text-center shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight mb-1">
                Staff<br />Rooms
              </span>
              <p className="text-base font-bold text-slate-900">32,526</p>
            </div>

            {/* Card 6: Transport Facilities */}
            <div className="w-full sm:flex-1 sm:min-w-[120px] p-4 flex flex-col items-center justify-center text-center shrink-0">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center mb-2">
                <Bus className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight mb-1">
                Transport<br />Facilities
              </span>
              <p className="text-base font-bold text-slate-900">2,222</p>
            </div>

            {/* Card 7: Placement Cell */}
            <div className="w-full sm:flex-1 sm:min-w-[120px] p-4 flex flex-col items-center justify-center text-center shrink-0">
              <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center mb-2">
                <Briefcase className="w-4 h-4 text-violet-600" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight mb-1">
                Placement<br />Cells
              </span>
              <p className="text-base font-bold text-slate-900">{(DASHBOARD_METRICS.placementCellsAffiliation as MetricData).value.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: MoUs & NAAC */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 items-stretch">

          {/* MOUs SECTION */}
          <div className="flex flex-col h-full">
            <MousPieChartCard
              title="MoUs & Partnerships"
              subtitle="Track your partnership growth"
              total={mousData.total}
              totalLabel="Total MoUs"
              totalDelta={mousData.deltaPercent || 0}
              items={mousItems}
            />
          </div>

          {/* RIGHT COLUMN: NAAC Accreditation Distribution */}
          <div className="flex flex-col">
            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-4 text-center lg:text-left border-b border-slate-100 pb-3">
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  NAAC Accreditation
                </h2>
                <p className="text-[13px] text-slate-500 font-medium">Breakdown by NAAC grade.</p>
              </div>

              <div className="flex flex-col items-center justify-between gap-6 w-full flex-1">
                <div className="w-full h-[250px] shrink-0">
                  <Premium3DPieChart
                    data={NAAC_COLLEGE_DISTRIBUTION}
                    activeIndex={activeNaacIndex}
                    setActiveIndex={setActiveNaacIndex}
                  />
                </div>

                <div className="w-full flex flex-wrap gap-2 justify-center z-10 relative">
                  {NAAC_COLLEGE_DISTRIBUTION.map((item, i) => {
                    const isHovered = activeNaacIndex === i;
                    return (
                      <div
                        key={item.grade}
                        className={`flex items-center justify-between gap-2 transition-all duration-300 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 ${isHovered ? 'scale-105 transform' : ''}`}
                        onMouseEnter={() => setActiveNaacIndex(i)}
                        onMouseLeave={() => setActiveNaacIndex(null)}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-sm shadow-sm" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length].top }} />
                          <span className={`text-[11px] font-semibold uppercase transition-colors ${isHovered ? 'text-slate-900' : 'text-slate-600'}`}>
                            {item.grade}
                          </span>
                        </div>
                        <span className="text-xs font-bold" style={{ color: PIE_COLORS[i % PIE_COLORS.length].top }}>
                          {item.count.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: District Map & Top NIRF Ranked */}
      <div className="xl:col-span-5 2xl:col-span-4 h-auto min-h-[600px] xl:h-[calc(100vh-140px)]">
        <div className="xl:sticky top-6 flex flex-col gap-6 h-full">
          <div className="flex-1 min-h-[400px]">
            <DistrictChoroplethMap filters={filters} onFilterChange={onFilterChange} />
          </div>

          <div className="w-full flex flex-col gap-3 p-2">
            <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1 border-b border-slate-100 pb-2">
              Top NIRF Ranked (State)
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Jadavpur University', rank: 4, type: 'State Public' },
                { name: 'Calcutta University', rank: 12, type: 'State Public' },
                { name: 'Burdwan University', rank: 86, type: 'State Public' },
                { name: 'Visva-Bharati', rank: 97, type: 'Central' },
                { name: 'Kalyani University', rank: 101, type: 'State Public' },
              ].map((uni, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-lg transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 font-bold text-[12px] flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-indigo-100">
                      #{uni.rank}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-800 tracking-tight leading-tight">{uni.name}</p>
                      <p className="text-[11px] font-medium text-slate-500 leading-tight mt-1">{uni.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
