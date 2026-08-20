"use client";
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
  BarChart,
  Bar,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis
} from 'recharts';
import { NAAC_COLLEGE_DISTRIBUTION, DASHBOARD_METRICS } from '@/data/university/mockData';
import { GroupedMetricData, MetricData } from '@/types/university';
import { ComparisonBar } from '../charts/ComparisonBar';
import { MousPieChartCard } from '../charts/MousPieChartCard';
import { RadialGauge } from '../charts/RadialGauge';
import { TrendCard } from '../charts/TrendCard';
import { DeltaIndicator } from '../charts/DeltaIndicator';
import { DistrictChoroplethMap } from '../charts/DistrictChoroplethMap';
import { FilterState } from '@/types/university';

// Distinct, easily-differentiable colors for NAAC grades
const NAAC_COLORS = [
  '#6366f1', // A++ – indigo
  '#8b5cf6', // A+  – violet
  '#06b6d4', // A   – cyan
  '#10b981', // B++ – emerald
  '#f59e0b', // B+  – amber
  '#f43f5e', // B   – rose
  '#64748b', // C++ – slate
  '#a16207', // C+  – yellow-brown
];

const Premium3DPieChart = null; // removed — using flat donut chart

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
  const [selectedNaacGrade, setSelectedNaacGrade] = useState<string | null>(null);

  // Map MoUs data for ConcentricProgressCard
  const mousData = DASHBOARD_METRICS.mousAffiliation as GroupedMetricData;
  const mousItems = mousData.parts.map((p) => {
    let icon = Globe;
    let color = '#3b82f6';
    const label = p.label || '';
    if (label.includes('Industries')) {
      icon = Building;
      color = '#3b82f6'; // Blue
    } else if (label.includes('International')) {
      icon = Globe;
      color = '#ef4444'; // Red
    } else {
      icon = Users;
      color = '#10b981'; // Green
    }
    return {
      label: label,
      value: p.value,
      deltaPercent: (p as any).deltaPercent || 0,
      color
    };
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-12 items-start">

      {/* LEFT SIDE: KPIs & Charts */}
      <div className="xl:col-span-7 2xl:col-span-8 flex flex-col space-y-6">

        {/* Top Banner: Colleges & Polytechnics Equation */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 md:gap-16 text-center">
            {/* Total */}
            <div>
              <p className="text-4xl font-bold text-slate-900 tracking-tight">
                8,064
              </p>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-2">
                Colleges & Polytechnic
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

            {/* Polytechnic */}
            <div>
              <p className="text-4xl font-bold text-indigo-600 tracking-tight">
                687
              </p>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-2">
                Polytechnic
              </p>
            </div>
          </div>
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
            <div className="w-full sm:flex-1 sm:min-w-[120px] p-4 flex flex-col items-center justify-center text-center shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight mb-1">
                Meeting<br />Rooms
              </span>
              <p className="text-base font-bold text-slate-900">19,272</p>
            </div>

            {/* Card 5: Staff Rooms */}
            <div className="w-full sm:flex-1 sm:min-w-[120px] p-4 flex flex-col items-center justify-center text-center shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight mb-1">
                Staff<br />Rooms
              </span>
              <p className="text-base font-bold text-slate-900">32,526</p>
            </div>

            {/* Card 6: Transport Facilities */}
            <div className="w-full sm:flex-1 sm:min-w-[120px] p-4 flex flex-col items-center justify-center text-center shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-2">
                <Bus className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight mb-1">
                Transport<br />Facilities
              </span>
              <p className="text-base font-bold text-slate-900">2,222</p>
            </div>

            {/* Card 7: Placement Cell */}
            <div className="w-full sm:flex-1 sm:min-w-[120px] p-4 flex flex-col items-center justify-center text-center shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center mb-2">
                <Briefcase className="w-6 h-6 text-violet-600" />
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
              totalDelta={(mousData as any).deltaPercent || 0}
              items={mousItems}
            />
          </div>

          {/* RIGHT COLUMN: NAAC Accreditation Distribution */}
          <div className="flex flex-col">
            <div className="p-5 flex-1 flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">NAAC Accreditation</h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Breakdown by grade</p>
                </div>
              </div>

              <div className="h-[260px] w-full mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={NAAC_COLLEGE_DISTRIBUTION}
                    layout="vertical"
                    margin={{ top: 4, right: 42, left: 2, bottom: 4 }}
                    barCategoryGap="18%"
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="grade"
                      axisLine={false}
                      tickLine={false}
                      width={42}
                      tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                      tickFormatter={(grade) => `Grade ${grade}`}
                    />
                    <RechartsTooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', fontSize: '12px', fontWeight: 600, padding: '8px 12px' }}
                      formatter={(value: any) => [`${Number(value).toLocaleString()} colleges`, 'Accredited']}
                    />
                    <Bar
                      dataKey="count"
                      radius={[0, 5, 5, 0]}
                      barSize={17}
                      cursor="pointer"
                      onClick={(entry: any) => {
                        const grade = entry?.payload?.grade ?? entry?.grade;
                        if (grade) {
                          setSelectedNaacGrade((current) => current === grade ? null : grade);
                        }
                      }}
                    >
                      {NAAC_COLLEGE_DISTRIBUTION.map((item, index) => (
                        <Cell
                          key={`naac-bar-${item.grade}`}
                          fill={NAAC_COLORS[index % NAAC_COLORS.length]}
                          opacity={selectedNaacGrade && selectedNaacGrade !== item.grade ? 0.2 : 1}
                        />
                      ))}
                      <LabelList dataKey="count" position="right" formatter={(value: any) => Number(value).toLocaleString()} fill="#334155" fontSize={10} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
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

          <div className="w-full flex flex-col gap-3 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
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


