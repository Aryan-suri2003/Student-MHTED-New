"use client";

import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { trendsData } from "@/data/trends";
import clsx from "clsx";
import { Users, Building2, GraduationCap, Percent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type MetricKey = "Students" | "Institutions" | "Faculty" | "Enrolment";

const METRICS: { key: MetricKey; label: string; color: string; rgb: string; icon: any }[] = [
  { key: "Students", label: "Students Enrolled", color: "#3B82F6", rgb: "59, 130, 246", icon: Users },
  { key: "Institutions", label: "Active Institutions", color: "#8B5CF6", rgb: "139, 92, 246", icon: Building2 },
  { key: "Faculty", label: "Faculty Members", color: "#10B981", rgb: "16, 185, 129", icon: GraduationCap },
  { key: "Enrolment", label: "Enrolment Ratio (%)", color: "#0EA5E9", rgb: "14, 165, 233", icon: Percent }
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
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        textStyle: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
        borderWidth: 0,
        padding: [12, 18],
        borderRadius: 12,
        extraCssText: 'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); backdrop-filter: blur(4px);',
        axisPointer: { type: 'line', lineStyle: { color: metric.color, width: 2, type: 'dashed' } },
        formatter: (params: any) => {
          const val = params[0].value;
          return `
            <div style="font-size:11px;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">${params[0].axisValue}</div>
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:8px;height:8px;border-radius:50%;background-color:${metric.color}"></div>
              <span style="color:#F1F5F9">${metric.label}:</span>
              <span style="font-weight:900;font-size:16px;color:${metric.color}">${formatValue(val, activeMetric)}</span>
            </div>
          `;
        }
      },
      grid: { top: 50, right: 30, bottom: 40, left: 60, containLabel: false },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: trendsData.map(t => t.year),
        axisLine: { lineStyle: { color: '#E2E8F0', width: 2 } },
        axisLabel: { color: '#64748B', fontWeight: 800, margin: 16, fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed', width: 2 } },
        axisLabel: {
          color: '#94A3B8',
          fontWeight: 800,
          fontSize: 11,
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
          smooth: 0.4,
          symbol: 'circle',
          symbolSize: 10,
          showSymbol: true,
          itemStyle: { color: '#fff', borderColor: metric.color, borderWidth: 3 },
          lineStyle: { 
            width: 5, 
            color: metric.color,
            shadowColor: `rgba(${metric.rgb}, 0.5)`,
            shadowBlur: 12,
            shadowOffsetY: 6
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `rgba(${metric.rgb}, 0.4)` },
              { offset: 0.7, color: `rgba(${metric.rgb}, 0.05)` },
              { offset: 1, color: `rgba(${metric.rgb}, 0.0)` }
            ])
          },
          data: trendsData.map(t => t[activeMetric]),
          animationDuration: 1500,
          animationEasing: 'cubicOut'
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
    <section className="bg-[#F8FAFC] py-24 border-b border-[#E2E8F0] relative overflow-hidden">
      {/* Decorative Background Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto w-full px-8 relative z-10">
        
        <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between mb-10 gap-6">
          <div className="max-w-xl">
            <h2 className="text-[32px] font-black text-[#0F172A] mb-2 tracking-tight">State Growth Journey</h2>
            <p className="text-[15px] text-[#64748B] font-medium leading-relaxed">
              Explore the historical trajectory across core performance indicators. Select a metric to visualize its growth over the past six academic years.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full xl:w-auto">
            {METRICS.map(m => {
              const isActive = activeMetric === m.key;
              const Icon = m.icon;
              return (
                <button
                  key={m.key}
                  onClick={() => setActiveMetric(m.key)}
                  className={clsx(
                    "relative flex flex-col items-start px-4 py-3 md:px-5 md:py-4 rounded-2xl border-2 text-left transition-all duration-300 w-full overflow-hidden",
                    isActive 
                      ? "bg-white transform -translate-y-1" 
                      : "bg-white/50 border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1] hover:-translate-y-0.5 shadow-sm"
                  )}
                  style={{ 
                    borderColor: isActive ? m.color : undefined,
                    boxShadow: isActive ? `0 12px 24px -6px rgba(${m.rgb}, 0.25)` : undefined
                  }}
                >
                  {/* Subtle active background gradient */}
                  {isActive && (
                    <div 
                      className="absolute inset-0 opacity-[0.04]"
                      style={{ background: `linear-gradient(135deg, ${m.color} 0%, transparent 100%)` }}
                    />
                  )}

                  <div className="flex items-center gap-2 mb-2 relative z-10 whitespace-nowrap">
                    <Icon 
                      size={16} 
                      className={isActive ? "" : "text-slate-400"}
                      style={{ color: isActive ? m.color : undefined }} 
                    />
                    <div 
                      className="text-[10px] md:text-[11px] font-black uppercase tracking-wider truncate" 
                      style={{ color: isActive ? m.color : '#64748B' }}
                    >
                      {m.label}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1.5 relative z-10">
                    <span className={clsx("text-[20px] md:text-[24px] font-black tracking-tight", isActive ? "text-[#0F172A]" : "text-[#334155]")}>
                      {getMetricGrowth(m.key)}
                    </span>
                    <span className="text-[9px] md:text-[11px] text-[#94A3B8] font-bold uppercase tracking-wide">Overall</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-[24px] border-2 border-blue-400/50 p-8 h-[500px] shadow-2xl shadow-blue-900/5 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMetric}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 p-8"
            >
              <ReactECharts option={getOption()} style={{ height: "100%", width: "100%" }} />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
