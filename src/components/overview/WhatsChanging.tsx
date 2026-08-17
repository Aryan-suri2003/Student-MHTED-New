"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { trendsData } from "@/data/trends";

export default function WhatsChanging() {
  
  const areaOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '0%', right: '5%', bottom: '5%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendsData.map(d => d.year),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b' }
    },
    yAxis: {
      type: 'value',
      min: 70, // Base it close to actual enrolment values
      splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } },
      axisLabel: { formatter: '{value}%', color: '#64748b' }
    },
    series: [
      {
        data: trendsData.map(d => d.Enrolment),
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 3, color: '#10B981' }, // Green for growth
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16, 185, 129, 0.4)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.0)' }
          ])
        }
      }
    ]
  };

  const lollipopData = [
    { name: 'Howrah', value: 5.4 },
    { name: 'Darjeeling', value: 6.8 },
    { name: 'Kolkata', value: 8.4 },
    { name: 'South 24 Parganas', value: 9.2 },
    { name: 'North 24 Parganas', value: 11.8 }
  ];

  const lollipopOption = {
    grid: { left: '5%', right: '15%', bottom: '0%', top: '0%', containLabel: true },
    xAxis: { type: 'value', show: false },
    yAxis: {
      type: 'category',
      data: lollipopData.map(d => d.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#1e293b', fontWeight: 600, fontSize: 13, margin: 16 }
    },
    series: [
      {
        type: 'scatter',
        symbol: 'circle',
        symbolSize: 14,
        itemStyle: { color: '#F59E0B' }, // Amber
        data: lollipopData.map(d => d.value),
        z: 10
      },
      {
        type: 'bar',
        barWidth: 2,
        itemStyle: { color: '#FDE68A' },
        data: lollipopData.map(d => d.value),
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%',
          color: '#F59E0B',
          fontWeight: 'bold',
          offset: [8, 0]
        },
        z: 5
      }
    ]
  };

  return (
    <section className="bg-white border-b border-slate-100 py-20">
      <div className="max-w-7xl mx-auto w-full px-8">
        <h2 className="text-3xl font-black text-slate-900 mb-12 tracking-tight">What's Changing</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Participation Growth */}
          <div className="bg-[#F0FDF9] rounded-3xl p-8 border border-emerald-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-emerald-100 font-serif text-9xl leading-none opacity-50 pointer-events-none">"</div>
            <div className="relative z-10">
              <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">Student Participation</div>
              <div className="text-7xl font-black text-[#10B981] tracking-tighter mb-6">+7.2%</div>
              
              <div className="h-48 w-full">
                <ReactECharts option={areaOption} style={{ height: "100%", width: "100%" }} />
              </div>
            </div>
          </div>

          {/* Right: Fastest Growing Districts */}
          <div className="flex flex-col h-full justify-center">
            <div className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-6">Fastest Growing Districts</div>
            
            <div className="h-64 w-full">
              <ReactECharts option={lollipopOption} style={{ height: "100%", width: "100%" }} />
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                Higher education participation continues to rise across the state. <strong className="text-slate-900">North 24 Parganas</strong> leads with a significant <strong className="text-[#F59E0B]">11.8%</strong> increase driven by new technical institutes.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
