"use client";

import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { trendsData, TrendData } from "@/data/trends";
import clsx from "clsx";

type MetricKey = "Students" | "Institutions" | "Faculty" | "Enrolment";

const METRICS: { key: MetricKey; label: string; color: string; rgb: string }[] = [
  { key: "Students", label: "Students Enrolled", color: "#2563EB", rgb: "37, 99, 235" },
  { key: "Institutions", label: "Active Institutions", color: "#8B5CF6", rgb: "139, 92, 246" },
  { key: "Faculty", label: "Faculty Members", color: "#10B981", rgb: "16, 185, 129" },
  { key: "Enrolment", label: "Enrolment Ratio (%)", color: "#F59E0B", rgb: "245, 158, 11" }
];

export default function GrowthJourney() {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("Students");

  const formatValue = (val: number, metricKey: MetricKey) => {
    if (metricKey === "Students") return `${val.toFixed(1)}L`;
    if (metricKey === "Faculty") return `${val.toFixed(1)}K`;
    if (metricKey === "Enrolment") return `${val.toFixed(1)}%`;
    return val;
  };

  const getOption = () => {
    const metric = METRICS.find(m => m.key === activeMetric)!;
    
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#172033',
        textStyle: { color: '#fff' },
        borderWidth: 0,
        padding: [12, 16],
        axisPointer: { type: 'line', lineStyle: { color: metric.color, width: 2, type: 'dashed' } },
        formatter: (params: any) => {
          const val = params[0].value;
          return `<div style="font-weight:bold;margin-bottom:4px;">${params[0].axisValue}</div>
                  <div>${metric.label}: <span style="font-weight:bold;color:${metric.color}">${formatValue(val, activeMetric)}</span></div>`;
        }
      },
      grid: { top: 40, right: 30, bottom: 30, left: 60, containLabel: false },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: trendsData.map(t => t.year),
        axisLine: { lineStyle: { color: '#E2E8F0' } },
        axisLabel: { color: '#64748B', fontWeight: 'bold' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } },
        axisLabel: {
          color: '#64748B',
          fontWeight: 'bold',
          formatter: (value: number) => formatValue(value, activeMetric)
        },
        min: (value: any) => {
          if (activeMetric === "Enrolment") return 70;
          return Math.floor(value.min * 0.9);
        }
      },
      series: [
        {
          name: metric.label,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 10,
          showSymbol: true,
          itemStyle: { color: metric.color, borderColor: '#fff', borderWidth: 2 },
          lineStyle: { width: 4, color: metric.color },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `rgba(${metric.rgb}, 0.4)` },
              { offset: 1, color: `rgba(${metric.rgb}, 0.0)` }
            ])
          },
          data: trendsData.map(t => t[activeMetric])
        }
      ]
    };
  };

  const getMetricGrowth = (key: MetricKey) => {
    const first = trendsData[0][key];
    const last = trendsData[trendsData.length - 1][key];
    const pct = ((last - first) / first) * 100;
    return `+${pct.toFixed(1)}%`;
  };

  return (
    <section className="bg-gradient-to-t from-[#F8FAFC] to-white py-20 border-b border-[#E2E8F0]">
      <div className="max-w-[1400px] mx-auto w-full px-8">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6">
          <div>
            <h2 className="text-[26px] font-bold text-[#0F172A] mb-1">State Growth Journey</h2>
            <p className="text-[14px] text-[#475569]">Historical trajectory across core performance indicators.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {METRICS.map(m => {
              const isActive = activeMetric === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setActiveMetric(m.key)}
                  className={clsx(
                    "flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-all min-w-[160px]",
                    isActive 
                      ? "bg-white border-transparent shadow-md" 
                      : "bg-[#F1F5F9] border-[#E2E8F0] hover:bg-[#E2E8F0] hover:border-[#CBD5E1]"
                  )}
                >
                  <div className={clsx("text-[12px] font-bold uppercase tracking-wider mb-1", isActive ? "opacity-100" : "opacity-70")} style={{ color: isActive ? m.color : '#64748B' }}>
                    {m.label}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={clsx("text-[20px] font-black", isActive ? "text-[#0F172A]" : "text-[#475569]")}>
                      {getMetricGrowth(m.key)}
                    </span>
                    <span className="text-[11px] text-[#94A3B8] font-bold uppercase">Overall</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 h-[450px] shadow-sm">
          <ReactECharts option={getOption()} style={{ height: "100%", width: "100%" }} />
        </div>

      </div>
    </section>
  );
}
