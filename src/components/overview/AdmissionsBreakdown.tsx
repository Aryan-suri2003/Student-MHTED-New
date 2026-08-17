"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useYear } from "@/contexts/YearContext";

// Hook to trigger animations only when scrolled into view
function useInView(options = { threshold: 0.2 }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect(); // Only trigger once
      }
    }, options);
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);
  
  return { ref, inView };
}

export default function AdmissionsBreakdown() {
  const { academicYear } = useYear();
  
  const { ref: chartRef, inView: chartsInView } = useInView();

  // Create gradient arrays for diverse colors
  const blueGrad = new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#60A5FA' }, { offset: 1, color: '#2563EB' }]);
  const pinkGrad = new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#F472B6' }, { offset: 1, color: '#DB2777' }]);
  const slateGrad = new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#94A3B8' }, { offset: 1, color: '#475569' }]);
  const purpleGrad = new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#C084FC' }, { offset: 1, color: '#7C3AED' }]);
  const greenGrad = new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#34D399' }, { offset: 1, color: '#059669' }]);
  const orangeGrad = new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#FBBF24' }, { offset: 1, color: '#D97706' }]);
  const redGrad = new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#F87171' }, { offset: 1, color: '#DC2626' }]);
  const tealGrad = new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#2DD4BF' }, { offset: 1, color: '#0D9488' }]);

  const genderData = [
    { name: 'Male', value: 1616936, itemStyle: { color: blueGrad } },
    { name: 'Female', value: 1461274, itemStyle: { color: pinkGrad } },
    { name: 'NA', value: 465, itemStyle: { color: slateGrad } },
    { name: 'Transgender', value: 117, itemStyle: { color: purpleGrad } }
  ];

  const universityTypeData = [
    { name: '(Blank)', value: 1868, itemStyle: { color: slateGrad } },
    { name: 'Deemed', value: 4608, itemStyle: { color: orangeGrad } },
    { name: 'State Private', value: 26871, itemStyle: { color: tealGrad } },
    { name: 'State Board', value: 147170, itemStyle: { color: pinkGrad } },
    { name: 'State Public', value: 2898275, itemStyle: { color: blueGrad } }
  ];

  const programsData = [
    { name: 'UG', value: 2487442, itemStyle: { color: blueGrad } },
    { name: 'PG', value: 342797, itemStyle: { color: purpleGrad } },
    { name: 'Diploma', value: 172769, itemStyle: { color: greenGrad } },
    { name: 'Other', value: 70872, itemStyle: { color: slateGrad } },
    { name: 'PhD', value: 2364, itemStyle: { color: redGrad } },
    { name: 'PG Diploma', value: 1608, itemStyle: { color: tealGrad } },
    { name: 'Cert', value: 2101, itemStyle: { color: orangeGrad } }
  ];

  // Sleek, cohesive corporate colors for integration cards
  const integrationStats = [
    { label: "Admission", value: 36, bg: "from-[#1E3A8A] to-[#1D4ED8]" },
    { label: "Examination", value: 20, bg: "from-[#312E81] to-[#4338CA]" },
    { label: "Result", value: 13, bg: "from-[#111827] to-[#374151]" },
    { label: "Affiliation", value: 16, bg: "from-[#4C1D95] to-[#6D28D9]" }
  ];

  const genderOption = {
    tooltip: { 
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: { bottom: '0%', left: 'center', icon: 'circle', itemWidth: 10, itemHeight: 10, textStyle: { fontWeight: 'bold', color: '#475569' } },
    series: [
      {
        name: 'Gender',
        type: 'pie',
        radius: ['45%', '65%'], // Shrunk to fit descriptive labels
        center: ['50%', '42%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { 
          show: true,
          formatter: '{b}\n{d}%',
          fontWeight: '900',
          fontSize: 12,
          color: '#1E293B',
          lineHeight: 16
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 15,
          smooth: true,
          lineStyle: { width: 2 }
        },
        data: genderData
      }
    ],
    graphic: {
      type: 'text',
      left: 'center',
      top: '38%',
      style: {
        text: '3.08M\nTotal',
        textAlign: 'center',
        fill: '#0F172A',
        fontSize: 18,
        fontWeight: '900'
      }
    }
  };

  const programsOption = {
    tooltip: { 
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: { top: 30, right: 20, bottom: 30, left: 60 },
    xAxis: {
      type: 'category',
      data: programsData.map(d => d.name),
      axisLine: { lineStyle: { color: '#E2E8F0' } },
      axisLabel: { color: '#475569', fontWeight: 'bold', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } },
      axisLabel: {
        color: '#94A3B8',
        fontWeight: 'bold',
        formatter: (val: number) => val >= 100000 ? `${(val/100000).toFixed(1)}L` : val >= 1000 ? `${(val/1000).toFixed(0)}K` : val
      }
    },
    series: [
      {
        name: 'Admissions',
        type: 'bar',
        barWidth: 35,
        itemStyle: { borderRadius: [6, 6, 0, 0] },
        label: { show: true, position: 'top', color: '#0F172A', fontWeight: 'bold', formatter: (p: any) => p.value > 100000 ? `${(p.value/100000).toFixed(1)}L` : p.value },
        data: programsData
      }
    ]
  };

  const universityOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 10, right: 40, bottom: 20, left: 90 },
    xAxis: {
      type: 'value',
      show: false,
      splitLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: universityTypeData.map(d => d.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#475569', fontWeight: 'bold', fontSize: 11 }
    },
    series: [
      {
        type: 'bar',
        data: universityTypeData,
        itemStyle: { borderRadius: [0, 6, 6, 0] },
        barWidth: 20,
        label: {
          show: true,
          position: 'right',
          color: '#0F172A',
          fontWeight: 'bold',
          formatter: (params: any) => params.value > 100000 ? `${(params.value/100000).toFixed(1)}L` : params.value.toLocaleString()
        }
      }
    ]
  };

  return (
    <section className="bg-gradient-to-br from-[#F8FAFC] to-[#FFFFFF] py-16 border-b border-[#E2E8F0]">
      <div className="max-w-[1400px] mx-auto w-full px-8">
        
        <div className="mb-12 text-center">
          <h2 className="text-[26px] font-bold text-[#0F172A] mb-1">Admissions & Integration Breakdown</h2>
          <p className="text-[14px] text-[#475569]">Detailed demographic and systemic views for {academicYear}.</p>
        </div>

        {/* Tree Structure for Integration Stats */}
        <div className="flex flex-col items-center w-full mb-16">
          
          {/* Root Node */}
          <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white px-10 py-4 rounded-2xl font-black text-[18px] shadow-lg z-10 border border-[#334155] flex flex-col items-center">
            <span className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Total Universities</span>
            <span className="text-[32px] leading-none">42</span>
          </div>
          
          {/* Trunk */}
          <div className="w-1 h-10 bg-[#CBD5E1]"></div>
          
          {/* Horizontal Branch */}
          <div className="w-full max-w-[900px] h-1 bg-[#CBD5E1] rounded-full"></div>
          
          {/* Child Nodes */}
          <div className="flex justify-between w-full max-w-[900px] mt-0 px-4">
            {integrationStats.map((stat, idx) => (
              <div key={stat.label} className="flex flex-col items-center w-1/4">
                {/* Branch down */}
                <div className="w-1 h-8 bg-[#CBD5E1]"></div>
                
                {/* Node */}
                <div className={`w-[90%] flex flex-col items-center justify-center py-5 rounded-2xl bg-gradient-to-br ${stat.bg} text-white shadow-lg transform hover:-translate-y-2 transition-transform duration-300 border border-white/10 relative overflow-hidden group`}>
                  <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <span className="text-[36px] font-black leading-none mb-2 drop-shadow-md">{stat.value}</span>
                  <span className="text-[13px] font-bold opacity-90 tracking-wider uppercase">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
          
        </div>

        {/* The 3 Charts below the tree */}
        <div ref={chartRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
          {/* Admissions by Gender (Donut) */}
          <div className="bg-gradient-to-b from-white to-[#F8FAFC] rounded-3xl shadow-sm border border-[#E2E8F0] p-6 flex flex-col h-[400px] relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:border-transparent">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#2563EB] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="text-center mb-4 mt-2">
              <h3 className="text-[18px] font-black text-[#0F172A]">Admissions by Gender</h3>
            </div>
            <div className="flex-1 w-full relative">
              {chartsInView && <ReactECharts option={genderOption} style={{ height: '100%', width: '100%' }} />}
            </div>
          </div>

          {/* Admissions by University Type (Horizontal Bar) */}
          <div className="bg-gradient-to-b from-white to-[#F8FAFC] rounded-3xl shadow-sm border border-[#E2E8F0] p-6 flex flex-col h-[400px] relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:border-transparent">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#10B981] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="text-center mb-4 mt-2">
              <h3 className="text-[18px] font-black text-[#0F172A]">Admissions by Type</h3>
            </div>
            <div className="flex-1 w-full relative">
              {chartsInView && <ReactECharts option={universityOption} style={{ height: '100%', width: '100%' }} />}
            </div>
          </div>

          {/* Admissions by Programs (Vertical Bar) */}
          <div className="bg-gradient-to-b from-white to-[#F8FAFC] rounded-3xl shadow-sm border border-[#E2E8F0] p-6 flex flex-col h-[400px] relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:border-transparent">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#8B5CF6] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="text-center mb-4 mt-2">
              <h3 className="text-[18px] font-black text-[#0F172A]">Admissions by Programs</h3>
            </div>
            <div className="flex-1 w-full relative">
              {chartsInView && <ReactECharts option={programsOption} style={{ height: '100%', width: '100%' }} />}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
