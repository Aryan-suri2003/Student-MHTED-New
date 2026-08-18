"use client";

import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import CountUp from "react-countup";
import { useYear } from "@/contexts/YearContext";
import { 
  Building2, Users, FileText, CheckCircle,
  TrendingUp, Info, ChevronRight, GraduationCap,
  Activity, ArrowRight, Maximize2, X
} from "lucide-react";

// Mock Data Generator responsive to year filter
const getAdmissionsData = (year: string, scale: number) => {
  return {
    coverage: {
      percentage: 86,
      integrated: Math.max(1, Math.round(36 * scale)),
      total: Math.max(1, Math.round(42 * scale)),
      pending: Math.round(6 * scale),
      modules: [
        { id: "admission", name: "ADMISSION", current: Math.round(36 * scale), total: Math.round(42 * scale), percentage: 86, trend: 8.2, color: "emerald", icon: Users },
        { id: "examination", name: "EXAMINATION", current: Math.round(20 * scale), total: Math.round(42 * scale), percentage: 48, trend: 6.1, color: "blue", icon: FileText },
        { id: "results", name: "RESULTS", current: Math.round(13 * scale), total: Math.round(42 * scale), percentage: 31, trend: 4.3, color: "purple", icon: CheckCircle },
        { id: "affiliation", name: "AFFILIATION", current: Math.round(16 * scale), total: Math.round(42 * scale), percentage: 38, trend: 5.6, color: "orange", icon: Building2 },
      ]
    },
    snapshot: {
      totalAdmissions: (3.08 * scale).toFixed(2) + "M",
      totalAdmissionsRaw: 3.08 * scale,
      institutionType: [
        { name: "State Public", value: (2.24 * scale).toFixed(2) + "M", raw: 2.24 * scale, percentage: 72.8, color: "bg-blue-600", hex: "#2563EB" },
        { name: "State Private", value: Math.round(656 * scale) + "K", raw: 0.656 * scale, percentage: 21.3, color: "bg-purple-600", hex: "#9333EA" },
        { name: "State Board", value: Math.round(151 * scale) + "K", raw: 0.151 * scale, percentage: 4.9, color: "bg-emerald-500", hex: "#10B981" },
        { name: "Deemed Universities", value: Math.round(30 * scale) + "K", raw: 0.03 * scale, percentage: 1.0, color: "bg-orange-500", hex: "#F97316" }
      ],
      academicLevel: [
        { name: "Undergraduate (UG)", value: (24.9 * scale).toFixed(1) + "L", raw: 24.9 * scale, percentage: 80.7, color: "bg-blue-600", hex: "#2563EB" },
        { name: "Postgraduate (PG)", value: (3.4 * scale).toFixed(1) + "L", raw: 3.4 * scale, percentage: 11.0, color: "bg-emerald-500", hex: "#10B981" },
        { name: "Diploma", value: (1.8 * scale).toFixed(1) + "L", raw: 1.8 * scale, percentage: 5.8, color: "bg-purple-600", hex: "#9333EA" },
        { name: "Doctoral (PhD)", value: (0.4 * scale).toFixed(1) + "L", raw: 0.4 * scale, percentage: 1.2, color: "bg-orange-500", hex: "#F97316" },
        { name: "Others", value: (0.2 * scale).toFixed(1) + "L", raw: 0.2 * scale, percentage: 0.6, color: "bg-slate-400", hex: "#94A3B8" }
      ],
      funnel: {
        applications: { count: (38.4 * scale).toFixed(1) + "L", pct: 100, label: "Applications" },
        verified: { count: (31.2 * scale).toFixed(1) + "L", pct: 81, label: "Applications Verified" },
        offers: { count: (27.4 * scale).toFixed(1) + "L", pct: 71, label: "Offers / Seats Allocated" },
        confirmed: { count: (24.9 * scale).toFixed(1) + "L", pct: 65, label: "Admissions Confirmed" }
      }
    },
    districts: [
      { name: "Kolkata", admissions: (5.22 * scale).toFixed(2) + "L", share: 16.8, trend: 8.4 },
      { name: "North 24 Parganas", admissions: (3.81 * scale).toFixed(2) + "L", share: 12.3, trend: 11.8 },
      { name: "South 24 Parganas", admissions: (2.89 * scale).toFixed(2) + "L", share: 9.4, trend: 9.2 },
      { name: "Hooghly", admissions: (2.10 * scale).toFixed(2) + "L", share: 6.8, trend: 6.2 },
      { name: "Howrah", admissions: (1.76 * scale).toFixed(2) + "L", share: 5.7, trend: 5.5 }
    ],
    trends: {
      years: ["2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26"],
      values: [18.1, 19.6, 21.4, 22.8, 24.1, 24.9].map(v => Number((v * scale).toFixed(1))),
      overallGrowth: 26.5
    },
    naac: {
      grades: [
        { name: "A++", value: 4, color: "#10B981" },
        { name: "A+", value: 12, color: "#34D399" },
        { name: "A", value: 38, color: "#3B82F6" },
        { name: "B++", value: 18, color: "#8B5CF6" },
        { name: "B+", value: 14, color: "#F59E0B" },
        { name: "B/C", value: 14, color: "#94A3B8" }
      ],
      districts: [
        { name: "Kolkata", count: 18 },
        { name: "North 24 Pgs", count: 9 },
        { name: "South 24 Pgs", count: 5 },
        { name: "Hooghly", count: 4 },
        { name: "Howrah", count: 3 }
      ]
    }
  };
};

const SectionTitle = ({ num, title, subtitle }: { num: string, title: string, subtitle?: string }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-1">
      <span className="bg-slate-100 text-slate-500 font-bold text-[11px] px-1.5 py-0.5 rounded uppercase tracking-wider">{num}</span>
      <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">{title}</h3>
    </div>
    {subtitle && <p className="text-[12px] font-medium text-slate-500 ml-8">{subtitle}</p>}
  </div>
);

export default function AdmissionsBreakdown() {
  const { academicYear, getOverviewScale } = useYear();
  const scale = getOverviewScale();
  const data = getAdmissionsData(academicYear, scale);
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [isInstModalOpen, setIsInstModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isNaacModalOpen, setIsNaacModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Options for Modals
  const instPieOption = {
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
    series: [
      {
        type: 'pie',
        radius: ['55%', '85%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        label: { show: true, formatter: '{b}\n{d}%', fontSize: 10, fontWeight: 'bold' },
        data: data.snapshot.institutionType.map(inst => ({ name: inst.name, value: inst.raw, itemStyle: { color: inst.hex } })),
        itemStyle: { borderWidth: 2, borderColor: '#fff' }
      }
    ],
    graphic: {
      type: 'text',
      left: 'center',
      top: 'center',
      style: { text: data.snapshot.totalAdmissions + '\nTotal', textAlign: 'center', fill: '#0F172A', fontSize: 16, fontWeight: 'bold' }
    }
  };

  const instBarOption = {
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    tooltip: { trigger: 'axis', formatter: '{b}: {c}M' },
    grid: { left: '5%', right: '5%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { formatter: '{value}M', fontSize: 10 }, splitLine: { lineStyle: { color: '#F1F5F9' } } },
    yAxis: { type: 'category', data: data.snapshot.institutionType.map(d => d.name).reverse(), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontWeight: 'bold', color: '#64748B', width: 90, overflow: 'break' } },
    series: [
      {
        type: 'bar',
        data: data.snapshot.institutionType.map(d => ({ value: d.raw, itemStyle: { color: d.hex } })).reverse(),
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        barWidth: 24,
        label: { show: true, position: 'right', formatter: '{c}M', fontWeight: 'bold' }
      }
    ]
  };

  const levelPieOption = {
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
    series: [
      {
        type: 'pie',
        radius: ['55%', '85%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        label: { show: true, formatter: '{b}\n{d}%', fontSize: 10, fontWeight: 'bold' },
        data: data.snapshot.academicLevel.map(level => ({ name: level.name, value: level.raw, itemStyle: { color: level.hex } })),
        itemStyle: { borderWidth: 2, borderColor: '#fff' }
      }
    ],
    graphic: {
      type: 'text',
      left: 'center',
      top: 'center',
      style: { text: '30.8L\nTotal', textAlign: 'center', fill: '#0F172A', fontSize: 16, fontWeight: 'bold' }
    }
  };

  const levelBarOption = {
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    tooltip: { trigger: 'axis', formatter: '{b}: {c}L' },
    grid: { left: '5%', right: '5%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { formatter: '{value}L', fontSize: 10 }, splitLine: { lineStyle: { color: '#F1F5F9' } } },
    yAxis: { type: 'category', data: data.snapshot.academicLevel.map(d => d.name).reverse(), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontWeight: 'bold', color: '#64748B', width: 90, overflow: 'break' } },
    series: [
      {
        type: 'bar',
        data: data.snapshot.academicLevel.map(d => ({ value: d.raw, itemStyle: { color: d.hex } })).reverse(),
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        barWidth: 20,
        label: { show: true, position: 'right', formatter: '{c}L', fontWeight: 'bold' }
      }
    ]
  };

  // ECharts options
  const trendsOption = {
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    tooltip: { trigger: 'axis', formatter: '{b}: {c}L Admissions' },
    grid: { left: '2%', right: '2%', bottom: '5%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: data.trends.years, axisLine: { lineStyle: { color: '#E2E8F0' } }, axisTick: { show: false }, axisLabel: { color: '#64748B', fontWeight: 'bold', fontSize: 10 } },
    yAxis: { type: 'value', show: false, min: 15 },
    series: [
      {
        type: 'line',
        data: data.trends.values,
        smooth: 0.4,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#10B981', borderWidth: 2, borderColor: '#fff' },
        lineStyle: { width: 3, color: '#10B981' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(16, 185, 129, 0.2)' }, { offset: 1, color: 'rgba(16, 185, 129, 0)' }]
          }
        },
        label: { show: true, position: 'top', formatter: '{c}L', fontWeight: 'bold', fontSize: 10, color: '#0F172A' }
      }
    ]
  };

  const naacPieOption = {
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    series: [
      {
        type: 'pie',
        radius: ['65%', '85%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderWidth: 3, borderColor: '#fff' },
        label: { show: true, position: 'outside', formatter: '{b}', fontSize: 12, fontWeight: 'bold', color: '#334155' },
        labelLine: { length: 10, length2: 8, lineStyle: { width: 2 } },
        data: data.naac.grades.map(g => ({ name: g.name, value: g.value, itemStyle: { color: g.color } }))
      }
    ],
    graphic: {
      type: 'text',
      left: 'center',
      top: 'center',
      style: { text: 'NAAC\nGrades', textAlign: 'center', fill: '#0F172A', fontSize: 13, fontWeight: '900' }
    }
  };

  const naacBarOption = {
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    tooltip: { trigger: 'axis', formatter: '{b}: {c} Inst.' },
    grid: { left: '5%', right: '15%', bottom: '5%', top: '10%', containLabel: true },
    xAxis: { type: 'value', show: false },
    yAxis: { type: 'category', data: data.naac.districts.map(d => d.name).reverse(), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontWeight: 'bold', color: '#475569', fontSize: 11, interval: 0 } },
    series: [
      {
        type: 'bar',
        data: data.naac.districts.map(d => ({ value: d.count, itemStyle: { color: '#3B82F6' } })).reverse(),
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        barWidth: '60%',
        label: { show: true, position: 'right', formatter: '{c}', fontWeight: '900', fontSize: 12, color: '#0F172A', distance: 5 }
      }
    ]
  };

  // Options for District Expand Modal
  const districtPieOption = {
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: { bottom: '5%', left: 'center', itemWidth: 10, itemHeight: 10, textStyle: { fontSize: 10 } },
    series: [
      {
        type: 'pie',
        radius: '55%',
        center: ['50%', '45%'],
        data: data.districts.map(d => ({ name: d.name, value: d.share })),
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}\n{d}%', fontSize: 10, fontWeight: 'bold' }
      }
    ]
  };

  const districtBarOption = {
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    tooltip: { trigger: 'axis', formatter: '{b}: +{c}% YoY' },
    grid: { left: '3%', right: '12%', bottom: '3%', top: '5%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { formatter: '+{value}%', fontSize: 10 }, splitLine: { lineStyle: { color: '#F1F5F9' } } },
    yAxis: { type: 'category', data: data.districts.map(d => d.name).reverse(), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontWeight: 'bold', color: '#64748B' } },
    series: [
      {
        type: 'bar',
        data: data.districts.map(d => d.trend).reverse(),
        itemStyle: { color: '#10B981', borderRadius: [0, 4, 4, 0] },
        barWidth: 24,
        label: { show: true, position: 'right', formatter: '+{c}%', fontWeight: 'bold', color: '#059669' }
      }
    ]
  };

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'emerald': return { text: 'text-emerald-600', bg: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'blue': return { text: 'text-blue-600', bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-100' };
      case 'purple': return { text: 'text-purple-600', bg: 'bg-purple-500', light: 'bg-purple-50', border: 'border-purple-100' };
      case 'orange': return { text: 'text-orange-600', bg: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-100' };
      default: return { text: 'text-slate-600', bg: 'bg-slate-500', light: 'bg-slate-50', border: 'border-slate-100' };
    }
  };

  return (
    <div className="bg-white py-12 border-t border-slate-200">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Admissions & Academic Data Overview</h2>
              
              <div className="relative group flex items-center">
                <Info size={14} className="text-slate-400 cursor-help hover:text-blue-500 transition-colors" />
                
                {/* CSS Tooltip */}
                <div className="absolute left-full ml-2 w-64 p-3 bg-slate-800 text-white text-[11px] font-medium leading-relaxed rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 top-1/2 -translate-y-1/2">
                  This section provides a statewide macroscopic view of student admissions, demographics, and data integration compliance for the selected academic year. Data changes based on active filters.
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-[6px] border-transparent border-r-slate-800"></div>
                </div>
              </div>

            </div>
            <p className="text-[13px] font-medium text-slate-500">Statewide view of admissions and university data integration for {academicYear}</p>
          </div>
        </div>

        {/* Section 01: UNIVERSITY DATA COVERAGE */}
        <div className="mb-10">
          <SectionTitle num="01" title="UNIVERSITY DATA COVERAGE" subtitle="42 Universities in the statewide network" />
          
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Hero Summary Card */}
            <div className="w-full lg:w-[22%] rounded-xl border border-slate-200 p-5 flex flex-col justify-center relative overflow-hidden bg-slate-50/50 hover:shadow-md hover:border-slate-300 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Building2 size={24} />
                </div>
                <div>
                  <div className="text-[28px] font-black text-emerald-600 leading-none">{data.coverage.percentage}%</div>
                  <div className="text-[12px] font-bold text-slate-600">Admission Data Coverage</div>
                </div>
              </div>
              <div className="text-[12px] font-bold text-slate-700 mb-4">
                {data.coverage.integrated} of {data.coverage.total} universities integrated for admission data
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-[11px] font-bold w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                {data.coverage.pending} universities pending integration <ChevronRight size={12} />
              </div>
            </div>

            {/* 4 Detail Cards */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.coverage.modules.map((mod, idx) => {
                const c = getColorClasses(mod.color);
                const Icon = mod.icon;
                return (
                  <div key={idx} className="rounded-xl border border-slate-200 p-5 flex flex-col items-center justify-center text-center bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-10 h-10 rounded-full ${c.light} ${c.text} flex items-center justify-center mb-3`}>
                      <Icon size={18} />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-2">{mod.name}</div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className={`text-[28px] font-black leading-none ${c.text}`}>{mod.current}</span>
                      <span className="text-[16px] font-bold text-slate-400">/ {mod.total}</span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 mb-4">{mod.percentage}% Integrated</div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                      <div className={`h-full rounded-full ${c.bg}`} style={{ width: `${mod.percentage}%` }}></div>
                    </div>

                    <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      ↑ {mod.trend}% vs 2024-25
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 02: STUDENT ADMISSIONS SNAPSHOT */}
        <div className="mb-10 rounded-xl border border-slate-200 p-6 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
          <SectionTitle num="02" title="STUDENT ADMISSIONS SNAPSHOT" subtitle="Who is being admitted and where" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Panel 1: Institution Type */}
            <div className="flex flex-col h-full border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8 group relative">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-[12px] font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">Admissions by Institution Type</h4>
                  <p className="text-[11px] text-slate-500 mb-4">Share of total admissions</p>
                </div>
                <button 
                  onClick={() => setIsInstModalOpen(true)}
                  className="w-6 h-6 rounded bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm shrink-0"
                  title="Expand"
                >
                  <Maximize2 size={12} />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-between pt-2">
                {data.snapshot.institutionType.map((inst, i) => (
                  <div key={i} className="flex items-center gap-2 mb-3 last:mb-0 p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-default">
                    <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                      <Building2 size={12} className="text-slate-500 group-hover:text-blue-500" />
                    </div>
                    <div className="w-24 text-[10px] font-bold text-slate-700 truncate">{inst.name}</div>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex items-center">
                      <div className={`h-full rounded-full ${inst.color} transition-all duration-[1200ms] ease-out`} style={{ width: isMounted ? `${Math.max(inst.percentage, 2)}%` : '0%' }}></div>
                    </div>
                    <div className="w-10 text-right text-[11px] font-black text-slate-800">{isMounted ? <CountUp end={inst.percentage} decimals={1} duration={1.5} /> : 0}%</div>
                    <div className="w-8 text-right text-[10px] font-bold text-slate-400">{inst.value}</div>
                  </div>
                ))}
                
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center px-1.5">
                  <span className="text-[11px] font-bold text-slate-600">Total Admissions</span>
                  <span className="text-[14px] font-black text-slate-900">{isMounted ? <CountUp end={data.snapshot.totalAdmissionsRaw} decimals={2} duration={2} suffix="M" /> : "0M"}</span>
                </div>
              </div>
            </div>

            {/* Panel 2: Academic Level */}
            <div className="flex flex-col h-full border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8 group relative">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-[12px] font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">Students by Academic Level</h4>
                  <p className="text-[11px] text-slate-500 mb-4">Total students by level of study</p>
                </div>
                <button 
                  onClick={() => setIsLevelModalOpen(true)}
                  className="w-6 h-6 rounded bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm shrink-0"
                  title="Expand"
                >
                  <Maximize2 size={12} />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-between pt-2">
                {data.snapshot.academicLevel.map((level, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2 last:mb-0 p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-default">
                    <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                      <GraduationCap size={12} className="text-slate-500 group-hover:text-blue-500" />
                    </div>
                    <div className="w-28 text-[10px] font-bold text-slate-700 truncate">{level.name}</div>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex items-center">
                      <div className={`h-full rounded-full ${level.color} transition-all duration-[1200ms] ease-out`} style={{ width: isMounted ? `${Math.max(level.percentage, 2)}%` : '0%' }}></div>
                    </div>
                    <div className="flex items-center gap-1 justify-end w-14 text-right">
                      <span className="text-[11px] font-black text-slate-800">{level.value}</span>
                      <span className="text-[9px] font-bold text-slate-400">({isMounted ? <CountUp end={level.percentage} decimals={1} duration={1.5} /> : 0}%)</span>
                    </div>
                  </div>
                ))}
                
                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center px-1.5">
                  <span className="text-[11px] font-bold text-slate-600">Total</span>
                  <span className="text-[14px] font-black text-slate-900">{isMounted ? <CountUp end={30.8} decimals={1} duration={2} suffix="L" /> : "0L"}</span>
                </div>
              </div>
            </div>

            {/* Panel 3: Funnel */}
            <div className="flex flex-col h-full group">
              <h4 className="text-[12px] font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">Admission Funnel</h4>
              <p className="text-[11px] text-slate-500 mb-4">2025-26 Admission Flow</p>
              
              <div className="flex-1 flex">
                <div className="flex flex-col justify-between h-full py-2 w-28 pr-2">
                   {Object.values(data.snapshot.funnel).map((stage, i) => (
                     <div key={i} className="flex flex-col">
                       <span className="text-[10px] font-bold text-slate-700 leading-tight">{stage.label}</span>
                       <div className="flex items-baseline gap-1">
                         <span className="text-[12px] font-black text-slate-900">{stage.count}</span>
                         <span className="text-[9px] font-bold text-slate-400">{stage.pct}%</span>
                       </div>
                     </div>
                   ))}
                </div>
                
                <div className="flex-1 relative py-2 h-full flex flex-col justify-between">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-[90%] mt-2 drop-shadow-sm group-hover:drop-shadow-md transition-all">
                    {/* SVG Coordinates: width 100, height 100. 4 segments, tapering down */}
                    <polygon points="0,0 100,0 90,23 10,23" fill="#3B82F6" className="hover:opacity-80 transition-opacity" />
                    <polygon points="10,25 90,25 80,48 20,48" fill="#14B8A6" className="hover:opacity-80 transition-opacity" />
                    <polygon points="20,50 80,50 70,73 30,73" fill="#A855F7" className="hover:opacity-80 transition-opacity" />
                    <polygon points="30,75 70,75 60,100 40,100" fill="#F97316" className="hover:opacity-80 transition-opacity" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Sections 03, 04, 05 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Section 03: ADMISSIONS BY DISTRICT (Table Only, No Map) */}
          <div className="col-span-1 lg:col-span-4 flex flex-col border border-slate-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 relative group">
            
            {/* Expand Button */}
            <button 
              onClick={() => setIsDistrictModalOpen(true)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
              title="Expand District Analysis"
            >
              <Maximize2 size={14} />
            </button>

            <div className="flex justify-between items-start mb-4">
              <SectionTitle num="03" title="ADMISSIONS BY DISTRICT" subtitle="Confirmed admissions distribution" />
            </div>
            
            <div className="flex-1 w-full flex flex-col">
              <div className="grid grid-cols-12 pb-2 border-b border-slate-200 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="col-span-5">District</div>
                <div className="col-span-3 text-right">Admissions</div>
                <div className="col-span-2 text-right">Share</div>
                <div className="col-span-2 text-right">YoY</div>
              </div>
              
              <div className="flex flex-col mt-2">
                {data.districts.map((d, i) => (
                  <div key={i} className="grid grid-cols-12 py-2.5 items-center border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <div className="col-span-5 text-[11px] font-bold text-slate-700 truncate pr-2">{d.name}</div>
                    <div className="col-span-3 text-right text-[12px] font-black text-slate-900">{d.admissions}</div>
                    <div className="col-span-2 text-right text-[11px] font-bold text-slate-600">{d.share}%</div>
                    <div className="col-span-2 text-right text-[10px] font-bold text-emerald-600 flex justify-end items-center gap-0.5">
                      + {d.trend}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full mt-4 text-[11px] font-bold text-blue-600 flex items-center justify-center gap-1 hover:underline">
              View All Districts <ArrowRight size={12} />
            </button>
          </div>

          {/* Section 04: ADMISSION TRENDS */}
          <div className="col-span-1 lg:col-span-4 flex flex-col border border-slate-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
            <SectionTitle num="04" title="ADMISSION TRENDS (PAST 6 YEARS)" subtitle="Confirmed admissions over time" />
            
            <div className="flex-1 h-[220px] w-full mt-2 relative">
              <ReactECharts option={trendsOption} style={{ height: '100%', width: '100%' }} />
            </div>
            
            <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-center text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1.5">
              <TrendingUp size={14} />
              + {data.trends.overallGrowth}% growth in confirmed admissions over 6 years
            </div>
          </div>

          {/* Section 05: QUALITY & ACCREDITATION */}
          <div className="col-span-1 lg:col-span-4 flex flex-col border border-slate-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 relative group">
            
            <button 
              onClick={() => setIsNaacModalOpen(true)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
              title="Expand NAAC Analysis"
            >
              <Maximize2 size={14} />
            </button>

            <SectionTitle num="05" title="QUALITY & ACCREDITATION" subtitle="NAAC grades & top districts" />
            
            <div className="flex-1 flex flex-col gap-4 mt-2 h-[220px]">
              
              {/* Pie Chart: NAAC Grades */}
              <div className="flex-1 min-h-[120px] relative border-b border-slate-100 pb-2">
                <ReactECharts option={naacPieOption} style={{ height: '100%', width: '100%' }} />
              </div>
              
              {/* Bar Chart: Top Districts */}
              <div className="flex-1 min-h-[100px] relative pt-2">
                <h4 className="text-[10px] font-bold text-slate-500 absolute top-0 left-0 z-10 uppercase tracking-widest">A & A+ Institutions by District</h4>
                <div className="w-full h-full pt-4">
                  <ReactECharts option={naacBarOption} style={{ height: '100%', width: '100%' }} />
                </div>
              </div>
              
            </div>
          </div>

        </div>

        <div className="mt-8 text-center text-[10px] font-medium text-slate-400">
          All data as on 18 Aug 2026 • Source: West Bengal Higher Education Department
        </div>

      </div>

      {/* Expanded District Modal */}
      {isDistrictModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-[18px] font-black text-slate-800">Detailed District Analysis</h3>
                <p className="text-[12px] text-slate-500 font-medium">Comprehensive breakdown of admissions and growth rates across top districts.</p>
              </div>
              <button 
                onClick={() => setIsDistrictModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden bg-slate-50/50">
              
              {/* Pie Chart Panel */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm h-full relative">
                <h4 className="text-[14px] font-bold text-slate-800 mb-1">Admissions Share by District</h4>
                <p className="text-[11px] text-slate-500 mb-6">Percentage of total state admissions</p>
                <div className="flex-1 relative min-h-[300px]">
                  <ReactECharts option={districtPieOption} style={{ height: '100%', width: '100%' }} />
                </div>
              </div>

              {/* Bar Chart Panel */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm h-full relative">
                <h4 className="text-[14px] font-bold text-slate-800 mb-1">Year-over-Year Growth</h4>
                <p className="text-[11px] text-slate-500 mb-6">Growth rate compared to previous academic year</p>
                <div className="flex-1 relative min-h-[300px]">
                  <ReactECharts option={districtBarOption} style={{ height: '100%', width: '100%' }} />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Institution Modal */}
      {isInstModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-[18px] font-black text-slate-800">Institution Type Breakdown</h3>
                <p className="text-[12px] text-slate-500 font-medium">Headcount volume and percentage mix of total admissions.</p>
              </div>
              <button onClick={() => setIsInstModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden bg-slate-50/50">
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm h-full relative">
                <h4 className="text-[14px] font-bold text-slate-800 mb-1">Admissions Share</h4>
                <div className="flex-1 relative min-h-[300px]">
                  <ReactECharts option={instPieOption} style={{ height: '100%', width: '100%' }} />
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm h-full relative">
                <h4 className="text-[14px] font-bold text-slate-800 mb-1">Total Headcount</h4>
                <div className="flex-1 relative min-h-[300px]">
                  <ReactECharts option={instBarOption} style={{ height: '100%', width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Academic Level Modal */}
      {isLevelModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-[18px] font-black text-slate-800">Academic Level Breakdown</h3>
                <p className="text-[12px] text-slate-500 font-medium">Headcount volume and percentage mix of total admissions.</p>
              </div>
              <button onClick={() => setIsLevelModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden bg-slate-50/50">
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm h-full relative">
                <h4 className="text-[14px] font-bold text-slate-800 mb-1">Students Share</h4>
                <div className="flex-1 relative min-h-[300px]">
                  <ReactECharts option={levelPieOption} style={{ height: '100%', width: '100%' }} />
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm h-full relative">
                <h4 className="text-[14px] font-bold text-slate-800 mb-1">Total Headcount</h4>
                <div className="flex-1 relative min-h-[300px]">
                  <ReactECharts option={levelBarOption} style={{ height: '100%', width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAAC Modal */}
      {isNaacModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-[18px] font-black text-slate-800">Quality & Accreditation Details</h3>
                <p className="text-[12px] text-slate-500 font-medium">Statewide breakdown of NAAC grades and district-level distribution of top institutions.</p>
              </div>
              <button onClick={() => setIsNaacModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50 flex flex-col gap-6">
              
              {/* Explanatory Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm border-l-4 border-l-blue-500">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Top Tier Excellence</h4>
                  <div className="text-[24px] font-black text-slate-900 leading-none mb-1">54 <span className="text-[14px] font-bold text-slate-400">Institutions</span></div>
                  <p className="text-[12px] font-medium text-slate-600 mt-2">Have achieved an 'A' grade or higher, representing the highest standards of education.</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm border-l-4 border-l-emerald-500">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">A++ Peak</h4>
                  <div className="text-[24px] font-black text-slate-900 leading-none mb-1">4 <span className="text-[14px] font-bold text-slate-400">Institutions</span></div>
                  <p className="text-[12px] font-medium text-slate-600 mt-2">Secured the absolute highest NAAC accreditation (A++) across the entire state.</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm border-l-4 border-l-purple-500">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Leading District</h4>
                  <div className="text-[24px] font-black text-slate-900 leading-none mb-1">Kolkata</div>
                  <p className="text-[12px] font-medium text-slate-600 mt-2">Leads the state with 18 top-tier (A & A+) institutions concentrated in the capital.</p>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-[350px]">
                <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm h-full relative">
                  <h4 className="text-[15px] font-black text-slate-800 mb-1">Statewide NAAC Grade Distribution</h4>
                  <p className="text-[12px] font-medium text-slate-500 mb-4">Percentage breakdown of accredited universities</p>
                  <div className="flex-1 relative">
                    <ReactECharts option={naacPieOption} style={{ height: '100%', width: '100%' }} />
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm h-full relative">
                  <h4 className="text-[15px] font-black text-slate-800 mb-1">A & A+ Institutions by District</h4>
                  <p className="text-[12px] font-medium text-slate-500 mb-4">Volume of top-tier institutions</p>
                  <div className="flex-1 relative">
                    <ReactECharts option={naacBarOption} style={{ height: '100%', width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
