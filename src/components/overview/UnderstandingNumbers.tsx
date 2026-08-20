"use client";

import React, { useMemo, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useYear } from "@/contexts/YearContext";
import { User, UserRound, Building, Maximize2, X, BookOpen, GraduationCap, PieChart, TrendingUp } from "lucide-react";
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
  const [isGerModalOpen, setIsGerModalOpen] = useState(false);
  const [isGpiModalOpen, setIsGpiModalOpen] = useState(false);
  const [isInstModalOpen, setIsInstModalOpen] = useState(false);

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

  const gpiPieOption = {
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    tooltip: { trigger: 'item', confine: true, formatter: '{b}: {c}%' },
    series: [
      {
        type: 'pie',
        radius: ['0%', '55%'],
        center: ['50%', '50%'],
        itemStyle: { borderColor: '#fff', borderWidth: 2 },
        emphasis: {
          scale: true,
          scaleSize: 5,
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' }
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: '#475569',
          fontWeight: 'bold',
          fontSize: 11
        },
        data: [
          { value: data.gpi.male.pct, name: 'Male', itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#60A5FA' }, { offset: 1, color: '#2563EB' }]) } },
          { value: data.gpi.female.pct, name: 'Female', itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#F472B6' }, { offset: 1, color: '#DB2777' }]) } },
          { value: data.gpi.trans.pct, name: 'Transgender', itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#A78BFA' }, { offset: 1, color: '#7C3AED' }]) } },
          { value: data.gpi.na.pct, name: 'Not Available', itemStyle: { color: '#94A3B8' } }
        ]
      }
    ]
  };

  const instModalDonutOption = {
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    title: {
      text: '2,450',
      subtext: 'Institutions',
      left: 'center',
      top: 'center',
      textStyle: { fontSize: 32, fontWeight: '900', color: '#172554', fontFamily: 'Inter, sans-serif' },
      subtextStyle: { fontSize: 13, fontWeight: 'bold', color: '#64748B', fontFamily: 'Inter, sans-serif' }
    },
    tooltip: { trigger: 'item', confine: true, formatter: '{b}: {c} ({d}%)' },
    series: [{
      type: 'pie',
      radius: ['65%', '85%'],
      center: ['50%', '50%'],
      itemStyle: { borderColor: '#fff', borderWidth: 4 },
      label: { show: false },
      emphasis: {
        scale: true,
        scaleSize: 5,
        itemStyle: { shadowBlur: 15, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.1)' }
      },
      data: [
        { value: data.institutionalType.colleges.raw, name: 'Colleges', itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#3B82F6' }, { offset: 1, color: '#6366F1' }]) } },
        { value: data.institutionalType.universities.raw, name: 'Universities', itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#A855F7' }, { offset: 1, color: '#D946EF' }]) } }
      ]
    }]
  };

  const uniPublic = data.institutionalType.breakdown.public;
  const uniPrivate = data.institutionalType.breakdown.private;
  const uniTotal = Math.max(1, uniPublic + uniPrivate);
  
  const colPublic = data.institutionalType.breakdown.govtAided;
  const colPrivate = data.institutionalType.breakdown.selfFinanced;
  const colTotal = Math.max(1, colPublic + colPrivate);

  const instStackedBarOption = {
    tooltip: { 
      trigger: 'axis', 
      axisPointer: { type: 'shadow' },
      formatter: function (params: any) {
        let res = params[0].name + '<br/>';
        params.forEach((item: any) => {
          res += item.marker + item.seriesName + ': <b>' + item.data.rawValue + '</b> (' + item.value.toFixed(1) + '%)<br/>';
        });
        return res;
      }
    },
    grid: { left: '3%', right: '5%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value', show: false, max: 100 },
    yAxis: { 
      type: 'category', 
      data: ['UNIVERSITIES', 'COLLEGES'], 
      axisLine: { show: false }, 
      axisTick: { show: false }, 
      axisLabel: { fontWeight: 'bold', color: '#172554', fontSize: 12, margin: 16, fontFamily: 'Inter, sans-serif' } 
    },
    series: [
      { 
        name: 'Government / Public', 
        type: 'bar', 
        stack: 'total', 
        barWidth: 44, 
        label: { show: true, formatter: (params: any) => params.data.rawValue, color: '#fff', fontWeight: 'bold' }, 
        itemStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#2563EB' }, { offset: 1, color: '#06B6D4' }]),
          borderRadius: [6, 0, 0, 6] 
        }, 
        data: [
          { value: (uniPublic / uniTotal) * 100, rawValue: uniPublic }, 
          { value: (colPublic / colTotal) * 100, rawValue: colPublic }
        ] 
      },
      { 
        name: 'Private / Self-Financed', 
        type: 'bar', 
        stack: 'total', 
        barWidth: 44, 
        label: { show: true, formatter: (params: any) => params.data.rawValue, color: '#fff', fontWeight: 'bold' }, 
        itemStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#F97316' }, { offset: 1, color: '#F59E0B' }]),
          borderRadius: [0, 6, 6, 0] 
        }, 
        data: [
          { value: (uniPrivate / uniTotal) * 100, rawValue: uniPrivate }, 
          { value: (colPrivate / colTotal) * 100, rawValue: colPrivate }
        ] 
      }
    ]
  };

  const instLineOption = {
    tooltip: { trigger: 'axis' },
    legend: { show: true, bottom: 0, icon: 'circle', textStyle: { color: '#64748B', fontWeight: 'bold', fontFamily: 'Inter, sans-serif' } },
    grid: { left: '3%', right: '5%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: ['2020', '2021', '2022', '2023', '2024'], 
      axisLine: { lineStyle: { color: '#E2E8F0' } }, 
      axisLabel: { fontWeight: 'bold', color: '#64748B', fontFamily: 'Inter, sans-serif' } 
    },
    yAxis: { 
      type: 'value', 
      splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } }, 
      axisLabel: { color: '#94A3B8', fontWeight: 'bold', fontFamily: 'Inter, sans-serif' } 
    },
    series: [
      { 
        name: 'Govt / Public', 
        type: 'line', 
        smooth: true, 
        symbolSize: 8, 
        itemStyle: { color: '#2563EB', borderWidth: 2 }, 
        lineStyle: { width: 4, color: '#2563EB' }, 
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(37, 99, 235, 0.25)' }, { offset: 1, color: 'rgba(37, 99, 235, 0)' }]) },
        data: [1350, 1380, 1400, 1420, 1444] 
      },
      { 
        name: 'Private / Self-Financed', 
        type: 'line', 
        smooth: true, 
        symbolSize: 8, 
        itemStyle: { color: '#F97316', borderWidth: 2 }, 
        lineStyle: { width: 4, color: '#F97316' }, 
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(249, 115, 22, 0.25)' }, { offset: 1, color: 'rgba(249, 115, 22, 0)' }]) },
        data: [550, 610, 680, 720, 761] 
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
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-slate-500">[ {isMounted ? <CountUp end={data.institutionalType.totalRaw} separator="," duration={2} /> : 0} Total ]</span>
                <button 
                  onClick={() => setIsInstModalOpen(true)} 
                  className="text-slate-400 hover:text-blue-500 transition-colors bg-white/50 rounded p-1"
                  aria-label="Expand Institutional Network Breakdown"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
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

          {/* Card 3: GER Horizontal Modern UI */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">Gross Enrolment (GER)</h4>
              <button 
                onClick={() => setIsGerModalOpen(true)} 
                className="text-slate-400 hover:text-emerald-500 transition-colors bg-white/50 rounded p-1"
                aria-label="Expand GER Breakdown"
              >
                <Maximize2 size={14} />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Higher Education Participation</p>
            <p className="text-[11px] text-slate-400 mb-4">% of eligible population (18-23 yrs)</p>

            <div className="flex-1 flex flex-col justify-center">
              
              <div className="flex flex-col items-center mb-6 mt-2">
                 <div className="flex items-start gap-2">
                   <span className="text-[54px] font-black text-slate-800 leading-none tracking-tighter">{data.ger.value}%</span>
                 </div>
              </div>

              <div className="text-[12px] font-medium text-slate-500 mb-6 text-center px-4">
                Currently tracking <span className="text-emerald-600 font-bold">+{Math.abs(parseFloat(data.ger.value) - data.ger.benchmark).toFixed(1)}%</span> ahead of national benchmark.
              </div>

              {/* Horizontal Progress */}
              <div className="mt-auto w-full px-2">
                 <div className="relative pt-6 pb-2">
                   {/* Benchmark Label */}
                   <div className="absolute top-0 flex flex-col items-center -translate-x-1/2 transition-all duration-1000 z-10" style={{ left: `${data.ger.benchmark}%` }}>
                      <span className="text-[9px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 whitespace-nowrap">Baseline {data.ger.benchmark.toFixed(1)}%</span>
                      <div className="w-px h-2 bg-slate-300 mt-0.5"></div>
                   </div>

                   {/* Progress Track */}
                   <div className="w-full h-3 bg-slate-200 rounded-full relative overflow-hidden shadow-inner">
                      <div className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full transition-all duration-[1500ms] ease-out" style={{ width: isMounted ? `${data.ger.value}%` : '0%' }}></div>
                   </div>
                   
                   {/* Benchmark Marker Line overlay */}
                   <div className="absolute top-[22px] h-[16px] w-[2px] bg-slate-800 z-10 transition-all duration-1000 -translate-x-1/2" style={{ left: `${data.ger.benchmark}%` }}></div>

                   <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
                      <span>0%</span>
                      <span>100%</span>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Card 4: Gender Balance Matrix */}
          <div className={cardClass}>
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">Gender Balance Matrix</h4>
              <button 
                onClick={() => setIsGpiModalOpen(true)} 
                className="text-slate-400 hover:text-blue-500 transition-colors bg-white/50 rounded p-1"
                aria-label="Expand Gender Breakdown"
              >
                <Maximize2 size={14} />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mb-6 uppercase tracking-wider">Gender Parity Index (GPI)</p>
            
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
      {/* GER Analysis Modal */}
      {isGerModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsGerModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-20">
              <div>
                <h3 className="text-[18px] font-bold text-slate-800">Gross Enrolment Ratio (GER) Trend</h3>
                <p className="text-[12px] font-medium text-slate-500">Historical performance analysis</p>
              </div>
              <button onClick={() => setIsGerModalOpen(false)} className="text-slate-400 hover:text-slate-800 bg-white shadow-sm border border-slate-200 p-2 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 h-[300px]">
                  <ReactECharts 
                    option={{
                      animation: true,
                      animationDuration: 2000,
                      animationEasing: 'cubicOut',
                      tooltip: { trigger: 'axis', formatter: '{b}: <br/><span style="font-weight:bold;">{c}%</span>' },
                      grid: { left: '2%', right: '4%', bottom: '5%', top: '10%', containLabel: true },
                      xAxis: { 
                        type: 'category', 
                        data: ['2020', '2021', '2022', '2023', '2024 (Est)'], 
                        axisLine: { lineStyle: { color: '#E2E8F0' } },
                        axisLabel: { color: '#64748B', fontWeight: 'bold' }
                      },
                      yAxis: { 
                        type: 'value', 
                        min: 50, 
                        max: 70, 
                        splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } },
                        axisLabel: { color: '#94A3B8', formatter: '{value}%' }
                      },
                      series: [
                        {
                          data: [55.2, 57.8, 60.1, 62.0, parseFloat(data.ger.value)],
                          type: 'line',
                          smooth: true,
                          lineStyle: { width: 4, color: '#10B981' },
                          itemStyle: { color: '#059669', borderWidth: 2, borderColor: '#fff' },
                          areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                              { offset: 0, color: 'rgba(16, 185, 129, 0.4)' },
                              { offset: 1, color: 'rgba(16, 185, 129, 0)' }
                            ])
                          },
                          symbolSize: 8,
                          label: { show: true, position: 'top', formatter: '{c}%', color: '#0f172a', fontWeight: 'bold', fontSize: 10 }
                        }
                      ]
                    }} 
                    style={{ height: '100%', width: '100%' }} 
                  />
                </div>
                <div className="md:w-[280px] bg-slate-50/50 rounded-xl border border-slate-100 p-5 flex flex-col justify-center">
                   <h4 className="text-[14px] font-bold text-slate-800 mb-2">What does this analysis depict?</h4>
                   <p className="text-[12px] text-slate-600 leading-relaxed mb-4">
                     The <strong className="text-slate-800">Gross Enrolment Ratio (GER)</strong> measures total enrolment in higher education as a percentage of the eligible demographic (typically 18-23 years old).
                   </p>
                   <p className="text-[12px] text-slate-600 leading-relaxed">
                     This historical trend highlights a steady upward trajectory. The <span className="text-emerald-600 font-bold">YoY Growth of {data.ger.growth}</span> reflects targeted policies to expand accessibility, build new institutions, and introduce scholarships that have significantly improved participation rates across the state.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GPI Analysis Modal */}
      {isGpiModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsGpiModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-20">
              <div>
                <h3 className="text-[18px] font-bold text-slate-800">Gender Parity Distribution</h3>
                <p className="text-[12px] font-medium text-slate-500">Detailed breakdown of student enrolment by gender</p>
              </div>
              <button onClick={() => setIsGpiModalOpen(false)} className="text-slate-400 hover:text-slate-800 bg-white shadow-sm border border-slate-200 p-2 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 w-full h-[320px]">
                  <ReactECharts option={gpiPieOption} style={{ height: '100%', width: '100%' }} />
                </div>
                
                <div className="md:w-[280px]">
                   <h4 className="text-[14px] font-bold text-slate-800 mb-4">Distribution Breakdown</h4>
                   
                   <div className="flex flex-col gap-3 mb-6">
                     <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                       <div className="flex-1 text-[13px] text-slate-600 font-medium">Male Students</div>
                       <div className="text-[13px] font-bold text-slate-900">{data.gpi.male.pct}%</div>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-pink-500 shadow-sm"></div>
                       <div className="flex-1 text-[13px] text-slate-600 font-medium">Female Students</div>
                       <div className="text-[13px] font-bold text-slate-900">{data.gpi.female.pct}%</div>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm"></div>
                       <div className="flex-1 text-[13px] text-slate-600 font-medium">Transgender</div>
                       <div className="text-[13px] font-bold text-slate-900">{data.gpi.trans.pct}%</div>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-slate-400 shadow-sm"></div>
                       <div className="flex-1 text-[13px] text-slate-600 font-medium">Not Available</div>
                       <div className="text-[13px] font-bold text-slate-900">{data.gpi.na.pct}%</div>
                     </div>
                   </div>

                   <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4">
                     <h5 className="text-[12px] font-bold text-slate-800 mb-1">Gender Parity Index (GPI): {data.gpi.value}</h5>
                     <p className="text-[11px] text-slate-500 leading-relaxed">
                       A GPI of 1.0 indicates perfect equality. The current index highlights the highly equitable participation across all genders in the state's higher education system.
                     </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Network Modal - Premium Redesign */}
      {isInstModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={() => setIsInstModalOpen(false)}></div>
          
          <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-[24px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] w-full max-w-[1300px] max-h-[90vh] overflow-y-auto relative z-10 animate-in fade-in zoom-in-95 duration-300">
            
            {/* 1. Header */}
            <div className="px-8 py-5 border-b border-slate-200/60 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-20 relative">
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20"></div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100">
                  <Building size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-[22px] font-bold text-[#172554] leading-tight">Institutional Network Intelligence</h3>
                  <p className="text-[13px] font-medium text-slate-500">Comprehensive overview of colleges, universities and ownership models</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 text-[12px] font-bold text-slate-600 shadow-sm">
                  {academicYear} Data
                </div>
                <button onClick={() => setIsInstModalOpen(false)} className="text-slate-400 hover:text-slate-800 bg-white hover:bg-slate-50 shadow-sm border border-slate-200 p-2.5 rounded-full transition-all hover:scale-105 active:scale-95">
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              
              {/* 2. Hero Analytics (60/40) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Composition */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col hover:border-indigo-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <h4 className="text-[16px] font-semibold text-[#172554] uppercase tracking-wider mb-2">Institutional Composition</h4>
                  <div className="flex-1 flex flex-col justify-center items-center min-h-[300px]">
                    <div className="w-full h-[260px]">
                      <ReactECharts option={instModalDonutOption} style={{ height: '100%', width: '100%' }} />
                    </div>
                    {/* Compact Legend Pills */}
                    <div className="flex justify-center gap-4 mt-2">
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full shadow-sm">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        <span className="text-[13px] font-bold text-[#172554]">2,408 Colleges</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full shadow-sm">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500"></div>
                        <span className="text-[13px] font-bold text-[#172554]">42 Universities</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right: KPI Hierarchy */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {/* Primary KPI */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-md relative overflow-hidden flex-1 flex flex-col justify-center border border-transparent hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Building size={120} />
                    </div>
                    <span className="text-[13px] font-bold text-blue-100 uppercase tracking-widest mb-1 relative z-10">Total Institutions</span>
                    <span className="text-[48px] font-black text-white leading-none relative z-10 tracking-tight">2,450</span>
                  </div>
                  
                  {/* Secondary KPIs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                        <BookOpen size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[28px] font-bold text-[#172554] leading-none mb-1">2,408</span>
                      <span className="text-[13px] font-medium text-slate-500">Colleges</span>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-purple-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-3">
                        <GraduationCap size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[28px] font-bold text-[#172554] leading-none mb-1">42</span>
                      <span className="text-[13px] font-medium text-slate-500">Universities</span>
                    </div>
                  </div>
                  
                  {/* Ratio Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-indigo-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex justify-between items-center">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Ownership Ratio</span>
                      <span className="text-[14px] font-medium text-slate-600">Govt / Public vs Private</span>
                    </div>
                    <div className="text-[20px] font-black text-[#172554]">
                      64% <span className="text-slate-300 font-normal mx-1">:</span> 36%
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Ownership & Funding (65/35) */}
              <div>
                <h4 className="text-[18px] font-semibold text-[#172554] mb-4">Ownership & Funding Intelligence</h4>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left: Stacked Bars */}
                  <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-blue-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <p className="text-[13px] text-slate-500 mb-4">Distribution across colleges and universities</p>
                    <div className="h-[220px]">
                      <ReactECharts option={instStackedBarOption} style={{ height: '100%', width: '100%' }} />
                    </div>
                  </div>
                  
                  {/* Right: Insight Panel */}
                  <div className="lg:col-span-4 bg-gradient-to-b from-white to-slate-50 rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col relative overflow-hidden hover:border-amber-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-amber-500"></div>
                    <h5 className="text-[14px] font-bold text-[#172554] uppercase tracking-wider mb-4 flex items-center gap-2">
                      <PieChart size={16} className="text-indigo-500" /> Ownership Split
                    </h5>
                    
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <div className="text-[13px] font-bold text-blue-600">Government / Public</div>
                      </div>
                      <div className="text-[24px] font-black text-[#172554] leading-none">64%</div>
                    </div>
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <div className="text-[13px] font-bold text-amber-600">Private / Self-Financed</div>
                      </div>
                      <div className="text-[24px] font-black text-[#172554] leading-none">36%</div>
                    </div>
                    
                    <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden mb-6 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: '64%' }}></div>
                      <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: '36%' }}></div>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Key Takeaway</div>
                      <p className="text-[13px] text-[#172554] font-medium leading-relaxed">
                        Government and aided colleges continue to form the backbone of the state's institutional network, while private institutions contribute significantly to university-level expansion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Small Analytical Metrics Row */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm hover:border-indigo-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <span className="text-[12px] font-medium text-slate-500">Institutions are Colleges</span>
                  <span className="text-[16px] font-bold text-[#172554]">98.3%</span>
                </div>
                <div className="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm hover:border-indigo-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <span className="text-[12px] font-medium text-slate-500">Institutions are Universities</span>
                  <span className="text-[16px] font-bold text-[#172554]">1.7%</span>
                </div>
                <div className="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm hover:border-indigo-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <span className="text-[12px] font-medium text-slate-500">Public / Government</span>
                  <span className="text-[16px] font-bold text-[#172554]">64%</span>
                </div>
                <div className="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm hover:border-indigo-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <span className="text-[12px] font-medium text-slate-500">Private / Self-Financed</span>
                  <span className="text-[16px] font-bold text-[#172554]">36%</span>
                </div>
              </div>

              {/* 5. Growth Section (65/35) */}
              <div>
                <h4 className="text-[18px] font-semibold text-[#172554] mb-4">5-Year Institutional Growth</h4>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left: Line Chart */}
                  <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-blue-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <p className="text-[13px] text-slate-500 mb-4">Expansion of government and private institutional capacity, 2020–2024</p>
                    <div className="h-[260px]">
                      <ReactECharts option={instLineOption} style={{ height: '100%', width: '100%' }} />
                    </div>
                  </div>
                  
                  {/* Right: Growth Insight */}
                  <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col hover:border-emerald-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100 shadow-sm">
                      <TrendingUp size={20} strokeWidth={2.5} />
                    </div>
                    <h5 className="text-[16px] font-bold text-[#172554] mb-2">Steady institutional expansion</h5>
                    <p className="text-[13px] text-slate-600 leading-relaxed mb-6">
                      The state maintains a massive, accessible base of Government colleges to reach all demographics, while showing strategic growth in Private Universities to offer specialized courses and match industry demands.
                    </p>
                    
                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100/50 rounded-lg p-3">
                        <span className="text-[12px] font-medium text-slate-600">Government Growth</span>
                        <span className="text-[13px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-center">+7.0%</span>
                      </div>
                      <div className="flex items-center justify-between bg-orange-50/50 border border-orange-100/50 rounded-lg p-3">
                        <span className="text-[12px] font-medium text-slate-600">Private Growth</span>
                        <span className="text-[13px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded text-center">+38.4%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
