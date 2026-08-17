"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { institutionComposition, studentsByType, compactStats } from "@/data/ecosystemStats";

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

export default function EcosystemNumbers() {
  const { ref: chartRef, inView: chartsInView } = useInView();
  
  const donutOption = {
    tooltip: { 
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: { bottom: '0%', left: 'center', icon: 'circle', textStyle: { color: '#64748b', fontWeight: 'bold' } },
    series: [
      {
        type: 'pie',
        radius: ['40%', '60%'],
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
          color: '#1E293B'
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 15,
          smooth: true,
          lineStyle: { width: 2 }
        },
        color: ['#173B7A', '#2563EB', '#38BDF8', '#8B5CF6', '#10B981'],
        data: institutionComposition
      }
    ]
  };

  const barOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '15%', bottom: '3%', top: '5%', containLabel: true },
    xAxis: { type: 'value', show: false },
    yAxis: { 
      type: 'category', 
      data: studentsByType.categories,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontWeight: 600 }
    },
    series: [
      {
        type: 'bar',
        data: studentsByType.values,
        itemStyle: { color: '#8B5CF6', borderRadius: [0, 4, 4, 0] },
        barWidth: 24,
        label: {
          show: true,
          position: 'right',
          formatter: (params: any) => `${(params.value / 100000).toFixed(1)}L`,
          color: '#1e293b',
          fontWeight: 'bold'
        }
      }
    ]
  };

  const radialOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: { show: false },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: { color: '#10B981' }
        },
        axisLine: {
          lineStyle: { width: 15, color: [[1, '#F0FDF9']] }
        },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        data: [{ value: 78.4, name: 'Enrolment\nRate' }],
        title: { fontSize: 12, color: '#64748b', offsetCenter: ['0%', '25%'] },
        detail: {
          width: 50,
          height: 14,
          fontSize: 32,
          color: '#10B981',
          fontWeight: 'bolder',
          formatter: '{value}%',
          offsetCenter: ['0%', '-10%']
        }
      }
    ]
  };

  return (
    <section className="bg-white border-b border-slate-100 py-16">
      <div className="max-w-7xl mx-auto w-full px-8">
        
        <h2 className="text-2xl font-bold text-slate-900 mb-10">The Ecosystem by Numbers</h2>

        <div ref={chartRef} className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left: Donut */}
          <div className="flex flex-col items-center relative h-[300px]">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Institution Composition</h3>
            {chartsInView && <ReactECharts option={donutOption} style={{ height: "100%", width: "100%", position: 'absolute', top: 20 }} />}
          </div>
          
          {/* Center: Horizontal Bar */}
          <div className="flex flex-col justify-center relative h-[300px]">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 text-center md:text-left z-10">Students by Type</h3>
            {chartsInView && <ReactECharts option={barOption} style={{ height: "100%", width: "100%", position: 'absolute', top: 20 }} />}
          </div>

          {/* Right: Radial Gauge */}
          <div className="flex flex-col items-center justify-center relative h-[300px]">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Overall Enrolment</h3>
            {chartsInView && <ReactECharts option={radialOption} style={{ height: "100%", width: "100%", position: 'absolute', top: 20 }} />}
          </div>
        </div>

        {/* Compact Colorful Statistics Strip */}
        <div className="flex flex-wrap gap-4 items-center justify-between px-8 py-6 rounded-2xl bg-[#F7F9FC]">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-[#2563EB]" />
            <div>
              <div className="text-sm text-slate-500 font-medium">Institutions</div>
              <div className="text-xl font-bold text-[#173B7A]">{compactStats.institutions}</div>
            </div>
          </div>
          
          <div className="w-px h-8 bg-slate-200 hidden md:block" />

          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
            <div>
              <div className="text-sm text-slate-500 font-medium">Students</div>
              <div className="text-xl font-bold text-[#8B5CF6]">{compactStats.students}</div>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-200 hidden md:block" />

          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-[#38BDF8]" />
            <div>
              <div className="text-sm text-slate-500 font-medium">Faculty</div>
              <div className="text-xl font-bold text-[#38BDF8]">{compactStats.faculty}</div>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-200 hidden lg:block" />

          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <div>
              <div className="text-sm text-slate-500 font-medium">Libraries</div>
              <div className="text-xl font-bold text-[#F59E0B]">{compactStats.libraries}</div>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-200 hidden lg:block" />

          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
            <div>
              <div className="text-sm text-slate-500 font-medium">Research Scholars</div>
              <div className="text-xl font-bold text-[#10B981]">{compactStats.researchScholars}</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
