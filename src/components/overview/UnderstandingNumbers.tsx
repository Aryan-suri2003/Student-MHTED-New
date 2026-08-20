"use client";

import React, { useMemo, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useYear } from "@/contexts/YearContext";
import { User, UserRound, Building, Maximize2, X } from "lucide-react";
import CountUp from "react-countup";

const getUnderstandingData = (year: string, scale: number) => {
  return {
    institutionalType: {
      total: Math.max(1, Math.round(2450 * scale)).toLocaleString(),
      totalRaw: Math.max(1, Math.round(2450 * scale)),
      colleges: { count: Math.max(1, Math.round(2408 * scale)).toLocaleString(), raw: Math.max(1, Math.round(2408 * scale)), pct: 98.3 },
      universities: { count: Math.max(1, Math.round(42 * scale)).toLocaleString(), raw: Math.max(1, Math.round(42 * scale)), pct: 1.7 },
      breakdown: { public: 24, private: 18, govtAided: Math.max(1, Math.round(1420 * scale)), selfFinanced: Math.max(1, Math.round(743 * scale)) }
    },
    studentComposition: {
      total: (12.4 * scale).toFixed(1) + "L",
      ug: { value: (10.2 * scale).toFixed(1) + "L", pct: 82.2 },
      pg: { value: (1.8 * scale).toFixed(1) + "L", pct: 14.5 },
      dip: { value: Math.max(1, Math.round(32 * scale)) + "K", pct: 2.6 },
      doc: { value: Math.max(1, Math.round(8 * scale)) + "K", pct: 0.7 },
      ugNum: 82.2, pgNum: 14.5, dipNum: 2.6, docNum: 0.7
    },
    ger: {
      value: (63.5 * scale).toFixed(1),
      benchmark: 62.0,
      growth: scale < 1.0 ? "+0.4%" : "+1.5%"
    },
    gpi: {
      value: scale < 1.0 ? "0.99" : "1.01",
      male: { pct: 52.1, count: (5.25 * scale).toFixed(2) + "L" },
      female: { pct: 47.3, count: (4.77 * scale).toFixed(2) + "L" },
      trans: { pct: 0.1, count: Math.max(1, Math.round(1 * scale)) + "K" },
      na: { pct: 0.5, count: Math.max(1, Math.round(5 * scale)) + "K" }
    }
  };
};

export default function UnderstandingNumbers() {
  const { academicYear, getOverviewScale } = useYear();
  const scale = getOverviewScale();
  const data = useMemo(() => getUnderstandingData(academicYear, scale), [academicYear, scale]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  useEffect(() => {
    // Small delay to trigger CSS transitions after initial paint
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ECharts Gradients
  const ugGradient = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#2563EB' }, { offset: 1, color: '#60A5FA' }]);
  const pgGradient = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#F59E0B' }, { offset: 1, color: '#FCD34D' }]);
  const dipGradient = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#10B981' }, { offset: 1, color: '#34D399' }]);
  const docGradient = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#EC4899' }, { offset: 1, color: '#F472B6' }]);

  const instPieOption = {
    animation: true,
    animationDuration: 1200,
    animationEasing: 'cubicOut',
    tooltip: { 
      trigger: 'item',
      confine: true,
      extraCssText: 'z-index: 50; border-radius: 8px;' 
    },
    series: [
      {
        type: 'pie',
        radius: ['60%', '85%'],
        center: ['50%', '50%'],
        label: { show: false },
        itemStyle: { borderColor: '#fff', borderWidth: 2 },
        emphasis: {
          scale: true,
          scaleSize: 5,
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' }
        },
        data: [
          { value: data.institutionalType.colleges.raw, name: 'Colleges', itemStyle: { color: '#3B82F6' } },
          { value: data.institutionalType.universities.raw, name: 'Universities', itemStyle: { color: '#8B5CF6' } }
        ]
      }
    ]
  };

  const studentDonutOption = {
    animation: true,
    animationDuration: 1200,
    animationEasing: 'cubicOut',
    tooltip: { 
      trigger: 'item',
      confine: true, // Prevents tooltip from overlapping center text badly
      extraCssText: 'z-index: 50;'
    },
    series: [
      {
        type: 'pie',
        radius: ['65%', '85%'],
        center: ['50%', '50%'],
        label: { show: false },
        itemStyle: { borderColor: '#fff', borderWidth: 2 },
        emphasis: {
          scale: true,
          scaleSize: 5, // scale(1.05) equivalent
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' }
        },
        data: [
          { value: data.studentComposition.ugNum, name: 'UG', itemStyle: { color: ugGradient } },
          { value: data.studentComposition.pgNum, name: 'PG', itemStyle: { color: pgGradient } },
          { value: data.studentComposition.dipNum, name: 'Diploma', itemStyle: { color: dipGradient } },
          { value: data.studentComposition.docNum, name: 'Doctoral', itemStyle: { color: docGradient } },
        ]
      }
    ]
  };

  const modalDonutOption = {
    ...studentDonutOption,
    series: [
      {
        ...studentDonutOption.series[0],
        radius: ['45%', '70%'],
        label: {
          show: true,
          formatter: '{b}\n{c}%',
          color: '#475569',
          fontWeight: 'bold',
          lineHeight: 14,
          fontSize: 10
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10,
          smooth: true,
          lineStyle: { color: '#94A3B8' }
        }
      }
    ]
  };

  // Glassmorphism Card Style
  const cardClass = "bg-gradient-to-br from-white to-blue-50/40 backdrop-blur-[12px] border-[1.5px] border-blue-200/60 border-t-white/90 rounded-[20px] p-[24px_20px] min-h-[340px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08),0_1px_3px_0_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_20px_35px_-10px_rgba(37,99,235,0.15),0_1px_3px_0_rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col relative";

  return (
    <section className="bg-slate-50/50 py-12 font-sans overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full px-6">
        
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-[24px] font-bold text-slate-800 tracking-tight">Understanding the Numbers</h2>
          <p className="text-[13px] text-slate-500 font-medium">Statewide key metrics and equity distribution for {academicYear}</p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Institutional Network */}
          <div className={cardClass}>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building size={14} className="text-blue-500" /> INSTITUTIONAL NETWORK
              </h4>
              <span className="text-[11px] font-bold text-slate-500">[ {isMounted ? <CountUp end={data.institutionalType.totalRaw} separator="," duration={2} /> : 0} Total ]</span>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              {/* Colleges Section */}
              <div className="mb-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[12px] font-bold text-slate-800">Colleges & Institutes</span>
                  <span className="text-[11px] font-bold text-slate-600">{isMounted ? <CountUp end={data.institutionalType.colleges.raw} separator="," duration={2} /> : 0} ({data.institutionalType.colleges.pct}%)</span>
                </div>
                {/* Thin bar */}
                <div className="w-full h-[6px] bg-slate-100 border border-slate-200 rounded-sm mb-4 relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-[1500ms] ease-out" style={{ width: isMounted ? `${data.institutionalType.colleges.pct}%` : '0%' }}></div>
                </div>
                
                {/* Sub-boxes */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-slate-200 border-dashed hover:border-solid rounded-lg p-2 text-left bg-slate-50/50 hover:bg-blue-50/60 hover:border-blue-300 hover:shadow-sm hover:-translate-y-[2px] transition-all cursor-default">
                    <div className="text-[10px] font-bold text-slate-500 mb-1">Govt / Aided</div>
                    <div className="text-[14px] font-black text-slate-800 leading-none mb-1">{isMounted ? <CountUp end={data.institutionalType.breakdown.govtAided} separator="," duration={2.2} /> : 0}</div>
                    <div className="text-[9px] text-slate-400">65.6% of colleges</div>
                  </div>
                  <div className="border border-slate-200 border-dashed hover:border-solid rounded-lg p-2 text-left bg-slate-50/50 hover:bg-blue-50/60 hover:border-blue-300 hover:shadow-sm hover:-translate-y-[2px] transition-all cursor-default">
                    <div className="text-[10px] font-bold text-slate-500 mb-1">Self-Financed</div>
                    <div className="text-[14px] font-black text-slate-800 leading-none mb-1">{isMounted ? <CountUp end={data.institutionalType.breakdown.selfFinanced} separator="," duration={2.4} /> : 0}</div>
                    <div className="text-[9px] text-slate-400">34.4% of colleges</div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-slate-300 my-4"></div>

              {/* Universities Section */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-[12px] font-bold text-slate-800">Universities (Apex Tier)</span>
                  <span className="text-[11px] font-bold text-slate-600">{isMounted ? <CountUp end={data.institutionalType.universities.raw} separator="," duration={2} /> : 0} ({data.institutionalType.universities.pct}%)</span>
                </div>
                
                {/* Sub-boxes */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-slate-200 border-dashed hover:border-solid rounded-lg p-2 text-left bg-slate-50/50 hover:bg-blue-50/60 hover:border-blue-300 hover:shadow-sm hover:-translate-y-[2px] transition-all cursor-default">
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">State Public</div>
                    <div className="flex justify-between items-end">
                      <div className="text-[14px] font-black text-slate-800 leading-none">{isMounted ? <CountUp end={data.institutionalType.breakdown.public} separator="," duration={2} /> : 0}</div>
                      <div className="text-[10px] font-bold text-slate-500">57.1%</div>
                    </div>
                  </div>
                  <div className="border border-slate-200 border-dashed hover:border-solid rounded-lg p-2 text-left bg-slate-50/50 hover:bg-blue-50/60 hover:border-blue-300 hover:shadow-sm hover:-translate-y-[2px] transition-all cursor-default">
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">State Private</div>
                    <div className="flex justify-between items-end">
                      <div className="text-[14px] font-black text-slate-800 leading-none">{isMounted ? <CountUp end={data.institutionalType.breakdown.private} separator="," duration={2} /> : 0}</div>
                      <div className="text-[10px] font-bold text-slate-500">42.9%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Student Composition */}
          <div className={cardClass}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">Student Intake Composition</h4>
              <button 
                onClick={() => setIsStudentModalOpen(true)} 
                className="text-slate-400 hover:text-blue-500 transition-colors bg-white/50 rounded p-1"
                aria-label="Expand Intake Breakdown"
              >
                <Maximize2 size={14} />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col pt-2">
              <div className="w-[140px] h-[140px] mx-auto relative group flex items-center justify-center">
                <ReactECharts option={studentDonutOption} style={{ height: '100%', width: '100%', position: 'absolute' }} />
                
                {/* Center text fixed and constrained */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none z-10 w-[80px]">
                   <span className="text-[20px] font-black text-[#0f172a] leading-none mb-1">{data.studentComposition.total}</span>
                   <span className="text-[10px] uppercase text-[#64748b] leading-[1.1] text-center font-bold">Total Intake/<br/>Enrolled</span>
                </div>
              </div>
              
              {/* 2-Column Key-Value List */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-6 px-1">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> UG ({data.studentComposition.ug.pct}%)</div>
                  <span className="text-slate-900">{data.studentComposition.ug.value}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> PG ({data.studentComposition.pg.pct}%)</div>
                  <span className="text-slate-900">{data.studentComposition.pg.value}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Dip. ({data.studentComposition.dip.pct}%)</div>
                  <span className="text-slate-900">{data.studentComposition.dip.value}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div> Doc. ({data.studentComposition.doc.pct}%)</div>
                  <span className="text-slate-900">{data.studentComposition.doc.value}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: GER Vertical Bar */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">GER (%) | GPI</h4>
            </div>
            <p className="text-[10px] text-slate-500 mb-6 uppercase tracking-wider">Health & Equity Metrics</p>
            
            <div className="flex-1 flex flex-col justify-end relative pl-8 pb-6 mt-6">
              {/* Y-Axis */}
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-bold text-slate-400">
                <span>100%</span>
                <span>80%</span>
                <span>60%</span>
                <span>40%</span>
                <span>20%</span>
                <span>0%</span>
              </div>
              
              {/* Y-Axis tick line */}
              <div className="absolute left-8 top-1 bottom-6 w-px bg-slate-200">
                <div className="absolute top-0 -left-1 w-2 h-px bg-slate-200"></div>
                <div className="absolute top-1/4 -left-1 w-2 h-px bg-slate-200"></div>
                <div className="absolute top-2/4 -left-1 w-2 h-px bg-slate-200"></div>
                <div className="absolute top-3/4 -left-1 w-2 h-px bg-slate-200"></div>
                <div className="absolute bottom-0 -left-1 w-2 h-px bg-slate-200"></div>
              </div>
              
              {/* Bar Container */}
              <div className="w-16 h-full bg-slate-100 rounded-t-lg relative ml-4 mt-2 group">
                
                {/* Floating YoY Pill */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap shadow-md z-20">
                  ↑ {data.ger.growth} YoY Growth
                </div>

                {/* Benchmark Line */}
                <div className="absolute left-[-20px] right-[-60px] border-t border-dashed border-slate-600 z-10 flex items-center justify-end" style={{ bottom: `${data.ger.benchmark}%` }}>
                  <div className="absolute left-0 -ml-2 -mt-1 w-0 h-0 border-t-[5px] border-b-[5px] border-r-[6px] border-t-transparent border-b-transparent border-r-slate-600 -rotate-180"></div>
                  <div className="text-[9px] leading-tight font-medium text-slate-600 translate-x-12 translate-y-3">
                    <span className="font-bold text-slate-900 text-[11px]">{data.ger.benchmark.toFixed(1)}%</span><br/>National<br/>Top-5<br/>Baseline
                  </div>
                </div>

                {/* Filled Bar */}
                <div className="absolute bottom-0 left-0 w-full rounded-t-lg bg-emerald-600 flex flex-col items-center pt-2 transition-all duration-[1200ms] ease-out group-hover:brightness-110 cursor-help" style={{ height: isMounted ? `${data.ger.value}%` : '0%' }}>
                  <span className="text-white text-[12px] font-bold">{data.ger.value}%</span>
                  
                  {/* Hover Gap Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    +{Math.abs(parseFloat(data.ger.value) - data.ger.benchmark).toFixed(1)}% above national benchmark
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/90"></div>
                  </div>
                </div>
              </div>
              
              {/* X-Axis Label */}
              <div className="absolute bottom-0 left-12 text-[10px] font-bold text-slate-500">
                State Bar
              </div>
            </div>
          </div>

          {/* Card 4: Gender Balance Matrix */}
          <div className={cardClass}>
            <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider mb-1">Gender Balance Matrix</h4>
            <p className="text-[10px] text-slate-500 mb-6 uppercase tracking-wider">Health & Equity Metrics</p>
            
            <div className="flex-1 flex justify-between items-end relative pb-6 px-1 mt-8">
              {/* Center GPI Watermark */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-[0.04] pointer-events-none flex flex-col items-center">
                <div className="text-[80px] font-black text-slate-900 tracking-tighter leading-none">{data.gpi.value}</div>
                <div className="text-[16px] font-bold text-slate-900 uppercase tracking-widest mt-[-10px]">GPI Score</div>
              </div>

              {/* Male Bar */}
              <div className="flex flex-col items-center h-full w-[22%] relative z-10 group">
                <div className="absolute -top-12 flex flex-col items-center whitespace-nowrap">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1 text-blue-500">
                    <User size={16} strokeWidth={2.5} />
                  </div>
                  <div className="text-[10px] font-medium text-slate-600 leading-tight text-center">Male<br/><span className="font-bold text-slate-800">({data.gpi.male.pct}%)</span></div>
                </div>
                <div className="w-full h-full bg-slate-100/80 backdrop-blur-sm rounded-t-lg relative mt-10">
                  <div className="absolute bottom-0 left-0 w-full rounded-t-lg bg-blue-600 flex items-end justify-center pb-2 transition-all duration-[1200ms] ease-out cursor-help hover:brightness-110 shadow-sm" style={{ height: isMounted ? `${(data.gpi.male.pct / 52.1) * 100}%` : '0%' }}>
                    <span className="text-white text-[10px] font-bold">{data.gpi.male.count}</span>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Male: {data.gpi.male.count}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Female Bar */}
              <div className="flex flex-col items-center h-full w-[22%] relative z-10 group">
                <div className="absolute -top-12 flex flex-col items-center whitespace-nowrap">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center mb-1 text-pink-500">
                    <UserRound size={16} strokeWidth={2.5} />
                  </div>
                  <div className="text-[10px] font-medium text-slate-600 leading-tight text-center">Female<br/><span className="font-bold text-slate-800">({data.gpi.female.pct}%)</span></div>
                </div>
                <div className="w-full h-full bg-slate-100/80 backdrop-blur-sm rounded-t-lg relative mt-10">
                  <div className="absolute bottom-0 left-0 w-full rounded-t-lg bg-pink-500 flex items-end justify-center pb-2 transition-all duration-[1200ms] ease-out cursor-help hover:brightness-110 shadow-sm" style={{ height: isMounted ? `${(data.gpi.female.pct / 52.1) * 100}%` : '0%' }}>
                    <span className="text-white text-[10px] font-bold">{data.gpi.female.count}</span>

                     {/* Hover Tooltip */}
                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Female: {data.gpi.female.count}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transgender Bar */}
              <div className="flex flex-col items-center h-full w-[16%] relative z-10 group">
                <div className="absolute -top-6 flex flex-col items-center whitespace-nowrap">
                  <div className="text-[9px] font-medium text-slate-600 leading-tight text-center">Trans<br/><span className="font-bold text-slate-800">({data.gpi.trans.pct}%)</span></div>
                </div>
                <div className="w-full h-full bg-slate-100/80 backdrop-blur-sm rounded-t-lg relative mt-10">
                  <div className="absolute bottom-0 left-0 w-full rounded-t-lg bg-purple-500 flex items-end justify-center pb-1 transition-all duration-[1200ms] ease-out cursor-help hover:brightness-110 shadow-sm" style={{ height: isMounted ? '8%' : '0%' }}>
                     {/* Hover Tooltip */}
                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Transgender: {data.gpi.trans.count}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NA Bar */}
              <div className="flex flex-col items-center h-full w-[16%] relative z-10 group">
                <div className="absolute -top-6 flex flex-col items-center whitespace-nowrap">
                  <div className="text-[9px] font-medium text-slate-600 leading-tight text-center">NA<br/><span className="font-bold text-slate-800">({data.gpi.na.pct}%)</span></div>
                </div>
                <div className="w-full h-full bg-slate-100/80 backdrop-blur-sm rounded-t-lg relative mt-10">
                  <div className="absolute bottom-0 left-0 w-full rounded-t-lg bg-slate-400 flex items-end justify-center pb-1 transition-all duration-[1200ms] ease-out cursor-help hover:brightness-110 shadow-sm" style={{ height: isMounted ? '12%' : '0%' }}>
                     {/* Hover Tooltip */}
                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Not Available: {data.gpi.na.count}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Global Footer */}
        <div className="mt-4 px-2">
          <p className="text-[11px] font-medium text-slate-400">Data source: West Bengal Higher Education Portal · {academicYear} Estimates</p>
        </div>

      </div>

      {/* Student Intake Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsStudentModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-20">
              <div>
                <h3 className="text-[18px] font-bold text-slate-800">Student Intake Deep Dive</h3>
                <p className="text-[12px] font-medium text-slate-500">Detailed breakdown by degree level for {academicYear}</p>
              </div>
              <button onClick={() => setIsStudentModalOpen(false)} className="text-slate-400 hover:text-slate-800 bg-white shadow-sm border border-slate-200 p-2 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            
            {/* Split Content */}
            <div className="flex flex-col md:flex-row min-h-[420px]">
              {/* Left Side: Bar Graph */}
              <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase mb-6 tracking-wider">Intake Volume (Headcount)</h4>
                <div className="h-[320px] w-full">
                  <ReactECharts 
                    option={{
                      tooltip: { 
                        trigger: 'axis', 
                        axisPointer: { type: 'shadow' },
                        formatter: (params: any) => {
                          const val = params[0].value;
                          const formatted = val >= 100000 ? (val / 100000).toFixed(2) + ' Lakhs' : (val / 1000).toFixed(1) + ' Thousand';
                          return `<div class="font-bold text-slate-800">${params[0].name}</div><div class="text-blue-600 font-medium">${formatted}</div>`;
                        }
                      },
                      grid: { left: '2%', right: '4%', bottom: '0%', top: '5%', containLabel: true },
                      xAxis: { 
                        type: 'category', 
                        data: ['UG', 'PG', 'Diploma', 'Doctoral'], 
                        axisTick: { show: false },
                        axisLine: { lineStyle: { color: '#E2E8F0' } },
                        axisLabel: { color: '#64748B', fontWeight: 'bold' }
                      },
                      yAxis: { 
                        type: 'value',
                        splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } },
                        axisLabel: { color: '#94A3B8', formatter: (val: number) => val >= 100000 ? (val/100000) + 'L' : (val/1000) + 'K' }
                      },
                      series: [
                        {
                          name: 'Intake',
                          type: 'bar',
                          barWidth: '50%',
                          itemStyle: { borderRadius: [4, 4, 0, 0] },
                          data: [
                            { value: parseFloat(data.studentComposition.ug.value) * 100000, itemStyle: { color: '#3B82F6' } },
                            { value: parseFloat(data.studentComposition.pg.value) * 100000, itemStyle: { color: '#F59E0B' } },
                            { value: parseInt(data.studentComposition.dip.value) * 1000, itemStyle: { color: '#10B981' } },
                            { value: parseInt(data.studentComposition.doc.value) * 1000, itemStyle: { color: '#EC4899' } }
                          ]
                        }
                      ]
                    }} 
                    style={{ height: '100%', width: '100%' }} 
                  />
                </div>
              </div>
              
              {/* Right Side: Pie Chart */}
              <div className="flex-1 p-6 bg-slate-50/30 flex flex-col justify-center">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Distribution Mix</h4>
                <div className="h-[260px] w-full relative">
                  <ReactECharts option={modalDonutOption} style={{ height: '100%', width: '100%' }} />
                </div>
                
                {/* Explainable Text Card */}
                <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 shadow-sm">
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    <strong className="text-slate-800 font-bold">Undergraduate Dominance:</strong> The state's higher education system is highly concentrated in foundational degrees. <span className="text-blue-600 font-bold">{data.studentComposition.ug.pct}%</span> of all intake is allocated to UG programs, representing exactly <span className="text-slate-800 font-bold">{data.studentComposition.ug.value}</span> seats. 
                  </p>
                  <div className="h-px w-full bg-blue-100 my-3"></div>
                  <p className="text-[12px] text-slate-500">
                    PG and Doctoral programs combined represent just { (data.studentComposition.pgNum + data.studentComposition.docNum).toFixed(1) }% of the total higher education ecosystem capacity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
