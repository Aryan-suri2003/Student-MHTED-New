import React, { useState } from 'react';
import {
  FileText,
  MessageSquare,
  CircleDollarSign,
  Plus,
  Minus,
  TrendingUp,
  Award,
  ChevronRight,
  Download,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Cell
} from 'recharts';
import {
  RESEARCH_THEMES,
  UNIVERSITY_OUTPUT_DATA,
  RESEARCH_GRANTS_YOY,
  RESEARCH_PAPERS_YOY,
  GRANTEE_FUNDING_DATA,
  DASHBOARD_METRICS
} from '../../data/mockData';
import { FilterState, MetricData } from '../../types';
import { DeltaIndicator } from '../charts/DeltaIndicator';
import { StackedBarSummary, ProportionalBar } from '../charts/ProportionalStackedBar';
import { TrendSparkline } from '../charts/TrendSparkline';

interface ResearchViewProps {
  filters: FilterState;
  onOpenDrilldown: (title: string, data: any, type: string) => void;
}

export const ResearchView: React.FC<ResearchViewProps> = ({
  filters,
  onOpenDrilldown
}) => {
  const [expandedThemes, setExpandedThemes] = useState<Record<string, boolean>>({
    'theme-1': false,
    'theme-2': false
  });

  const toggleTheme = (id: string) => {
    setExpandedThemes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter research themes if theme filter selected
  const filteredThemes = RESEARCH_THEMES.filter((theme) => {
    if (filters.theme !== 'All' && theme.name !== filters.theme) return false;
    return true;
  });

  // Calculate totals
  const totalConf = filteredThemes.reduce((acc, t) => acc + t.conferencePapers, 0);
  const totalGrants = filteredThemes.reduce((acc, t) => acc + t.researchGrants, 0);
  const totalPublished = filteredThemes.reduce((acc, t) => acc + t.publishedPapers, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Section: KPIs (Left) & Key Research Areas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: KPI Cards */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Card 1: Journal Papers */}
          <div className="p-5 relative overflow-hidden transition flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                Journal Papers
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {(DASHBOARD_METRICS.journalPapers as MetricData).value}
              </div>
              <DeltaIndicator deltaPercent={(DASHBOARD_METRICS.journalPapers as MetricData).deltaPercent} />
            </div>
          </div>

          {/* Card 2: Conference Papers */}
          <div className="p-5 relative overflow-hidden transition flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                Conference Papers
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {(DASHBOARD_METRICS.conferencePapers as MetricData).value}
              </div>
              <DeltaIndicator deltaPercent={(DASHBOARD_METRICS.conferencePapers as MetricData).deltaPercent} />
            </div>
          </div>

          {/* Card 3: Research Grants */}
          <div className="p-5 relative overflow-hidden transition flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CircleDollarSign className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                Research Grants
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {(DASHBOARD_METRICS.researchGrants as MetricData).value}
              </div>
              <DeltaIndicator deltaPercent={(DASHBOARD_METRICS.researchGrants as MetricData).deltaPercent} />
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-left text-[10px] text-slate-400 font-medium tracking-wide mt-2">
            DATA REFRESHED: 14 AUG 2026
          </div>
        </div>

        {/* RIGHT COLUMN: Key Research Areas Table */}
        <div className="lg:col-span-9 p-6">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">
            Key Research Areas
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">
            Click theme to view granular sub-theme allocations
          </span>
        </div>

        <div className="px-5 py-4 border-b border-slate-100">
          <StackedBarSummary parts={filteredThemes.map(t => ({ label: t.name, value: t.publishedPapers }))} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-5 font-semibold">Themes</th>
                <th className="py-3 px-5 text-center font-semibold">Conference Papers</th>
                <th className="py-3 px-5 text-center font-semibold">Research Grants</th>
                <th className="py-3 px-5 text-center font-semibold">
                  Published Papers
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredThemes.map((theme) => {
                const isExpanded = !!expandedThemes[theme.id];
                return (
                  <React.Fragment key={theme.id}>
                    <tr className="hover:bg-slate-50/50 transition">
                      {/* Theme Name with [+] button */}
                      <td className="py-3 px-5 font-medium text-slate-800 flex items-center gap-3">
                        <button
                          onClick={() => toggleTheme(theme.id)}
                          className="w-4 h-4 rounded-sm border border-slate-300 bg-white flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-600 transition-colors"
                        >
                          {isExpanded ? (
                            <Minus className="w-3 h-3" />
                          ) : (
                            <Plus className="w-3 h-3" />
                          )}
                        </button>
                        <span className="font-semibold text-[13px] text-slate-700">
                          {theme.name}
                        </span>
                      </td>

                      {/* Conference Papers */}
                      <td className="py-3 px-5">
                        <ProportionalBar value={theme.conferencePapers} max={Math.max(...filteredThemes.map(t => t.conferencePapers))} colorIndex={1} />
                      </td>

                      {/* Research Grants */}
                      <td className="py-3 px-5">
                        <ProportionalBar value={theme.researchGrants} max={Math.max(...filteredThemes.map(t => t.researchGrants))} colorIndex={2} />
                      </td>

                      {/* Published Papers */}
                      <td className="py-3 px-5">
                        <ProportionalBar value={theme.publishedPapers} max={Math.max(...filteredThemes.map(t => t.publishedPapers))} colorIndex={0} />
                      </td>
                    </tr>

                    {/* Sub-themes expanded rows */}
                    {isExpanded &&
                      theme.subThemes?.map((sub, idx) => (
                        <tr
                          key={idx}
                          className="bg-slate-50 text-[12px] border-t border-slate-100/60"
                        >
                          <td className="py-2 px-5 pl-12 text-slate-600 font-medium flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-slate-300" />
                              <span>{sub.name}</span>
                            </div>
                            <span className="text-[10px] bg-white text-slate-500 px-2 py-0.5 rounded border border-slate-200 font-medium uppercase tracking-wider">
                              Lead: {sub.leadUniversity}
                            </span>
                          </td>
                          <td className="py-2 px-5 text-center text-slate-600 font-medium">
                            {sub.conferencePapers}
                          </td>
                          <td className="py-2 px-5 text-center text-slate-600 font-medium">
                            {sub.researchGrants}
                          </td>
                          <td className="py-2 px-5 text-center text-slate-600 font-medium">
                            {sub.publishedPapers}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}

              {/* Total Row */}
              <tr className="bg-slate-100/50 font-bold text-slate-900 border-t border-slate-200">
                <td className="py-3 px-5 font-bold text-[13px] text-slate-800">Total Output</td>
                <td className="py-3 px-5 text-center text-[13px] text-slate-800">
                  {totalConf}
                </td>
                <td className="py-3 px-5 text-center text-[13px] text-slate-800">
                  {totalGrants}
                </td>
                <td className="py-3 px-5 text-center text-[13px] text-slate-800">
                  {totalPublished}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {/* Middle Section: Research Output & Grants */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start border-t border-slate-100 mt-4 pt-4">
        
        {/* Left: Research Output by Universities Chart */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-slate-800 w-full">
              Research Output by Universities
            </h2>
          </div>

          <div className="h-[460px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={UNIVERSITY_OUTPUT_DATA}
                margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                barGap={2}
                barSize={24}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="fullName"
                  type="category"
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  width={150}
                  interval={0}
                />
                <Tooltip
                  cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const u = UNIVERSITY_OUTPUT_DATA.find((item) => item.code === label);
                      return (
                        <div className="bg-white rounded-3xl p-5 shadow-[var(--shadow-soft)] z-50">
                          <p className="font-semibold text-slate-900 mb-2 border-b border-slate-100 pb-2">
                            {u?.fullName || label}
                          </p>
                          <div className="space-y-1.5 text-[11px] font-medium">
                            <p className="flex justify-between gap-4 text-slate-600">
                              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4fd1c5' }}></div>Research Grants</span>
                              <span className="font-bold text-slate-900">{payload.find(p => p.dataKey === 'researchGrants')?.value}</span>
                            </p>
                            <p className="flex justify-between gap-4 text-slate-600">
                              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f87171' }}></div>Conference Papers</span>
                              <span className="font-bold text-slate-900">{payload.find(p => p.dataKey === 'conferencePapers')?.value}</span>
                            </p>
                            <p className="flex justify-between gap-4 text-slate-600">
                              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#fbbf24' }}></div>Published Papers</span>
                              <span className="font-bold text-slate-900">{payload.find(p => p.dataKey === 'publishedPapers')?.value}</span>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      conferencePapers: 'Conference Papers',
                      researchGrants: 'Research Grants',
                      publishedPapers: 'Research Papers Published'
                    };
                    return <span className="text-slate-600 font-medium px-2">{labels[value] || value}</span>;
                  }}
                />
                <Bar dataKey="publishedPapers" stackId="a" fill="#fbbf24" name="publishedPapers" />
                <Bar dataKey="conferencePapers" stackId="a" fill="#f87171" name="conferencePapers" />
                <Bar dataKey="researchGrants" stackId="a" fill="#4fd1c5" radius={[0, 4, 4, 0]} name="researchGrants" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Grants Received from Grantees */}
        <div className="p-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-6">
            Grants Received from Grantees (in ₹)
          </h2>

          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-12 space-y-3">
              {GRANTEE_FUNDING_DATA.map((grantee) => {
                const maxAmount = 32730714;
                const percentage = (grantee.amount / maxAmount) * 100;

                return (
                  <div
                    key={grantee.name}
                    className="flex items-center gap-4 text-[12px] group hover:bg-slate-50 p-1.5 rounded-md transition-colors"
                  >
                    {/* Grantee Name */}
                    <div className="w-40 lg:w-48 font-medium text-slate-700 truncate group-hover:text-indigo-700" title={grantee.name}>
                      {grantee.name}
                    </div>

                    {/* Horizontal Bar */}
                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden flex items-center">
                      <div
                        className="h-full bg-indigo-400 group-hover:bg-indigo-500 rounded-r-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 3)}%` }}
                      />
                    </div>

                    {/* Formatted Amount */}
                    <div className="w-24 lg:w-28 text-right font-semibold text-slate-700 font-mono text-[10px] lg:text-[11px]">
                      {grantee.amountFormatted}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Two YoY Trend Sparklines Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        <TrendSparkline
          title="Research Grants Received (YoY)"
          data={RESEARCH_GRANTS_YOY}
          colorIndex={7}
        />
        <TrendSparkline
          title="Research Papers Published (YoY)"
          data={RESEARCH_PAPERS_YOY}
          colorIndex={0}
        />
      </div>
    </div>
  );
};
