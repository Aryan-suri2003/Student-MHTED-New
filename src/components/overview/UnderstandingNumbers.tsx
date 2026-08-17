"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useYear } from "@/contexts/YearContext";
import { trendsData } from "@/data/trends";

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

export default function UnderstandingNumbers() {
  const { academicYear } = useYear();
  const currentData = useMemo(() => trendsData.find(t => t.year === academicYear) || trendsData[trendsData.length - 1], [academicYear]);

  const { ref: chartRef, inView: chartsInView } = useInView();

  // Gradient colors for Institutions
  const instColors = [
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#3B82F6' }, { offset: 1, color: '#1D4ED8' }]),
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#8B5CF6' }, { offset: 1, color: '#6D28D9' }]),
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#10B981' }, { offset: 1, color: '#059669' }])
  ];

  // Gradient colors for Students
  const studentColors = [
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#60A5FA' }, { offset: 1, color: '#2563EB' }]),
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#818CF8' }, { offset: 1, color: '#4F46E5' }]),
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#2DD4BF' }, { offset: 1, color: '#0D9488' }]),
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#FBBF24' }, { offset: 1, color: '#D97706' }]),
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#F87171' }, { offset: 1, color: '#DC2626' }])
  ];

  const institutionOption = {
    tooltip: { trigger: 'item' },
    legend: { show: false },
    series: [
      {
        name: 'Institutions',
        type: 'pie',
        radius: ['30%', '80%'],
        center: ['50%', '50%'],
        roseType: 'radius',
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        color: instColors,
        data: [
          { value: 2408, name: 'Colleges' },
          { value: 42, name: 'Universities' },
          { value: 10, name: 'Other' }
        ]
      }
    ],
    graphic: {
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: '2,450',
        textAlign: 'center',
        fill: '#0F172A',
        fontSize: 18,
        fontWeight: '900'
      }
    }
  };

  const studentOption = {
    tooltip: { trigger: 'item' },
    legend: { show: false },
    series: [
      {
        name: 'Students',
        type: 'pie',
        radius: ['65%', '85%'], // Thinner donut
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 3 },
        label: { show: false },
        color: studentColors,
        data: [
          { value: 920000, name: 'Undergraduate' },
          { value: 180000, name: 'Postgraduate' },
          { value: 40000, name: 'Doctoral' },
          { value: 80000, name: 'Diploma' },
          { value: 20000, name: 'Other' }
        ]
      }
    ],
    graphic: {
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: '12.4L',
        textAlign: 'center',
        fill: '#0F172A',
        fontSize: 20,
        fontWeight: '900'
      }
    }
  };

  const enrolmentOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '75%'],
        radius: '110%',
        pointer: { 
          show: true,
          length: '65%',
          width: 5,
          itemStyle: { color: '#334155' } // Sleek slate needle
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: { 
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#3B82F6' },
              { offset: 1, color: '#10B981' }
            ])
          }
        },
        axisLine: {
          lineStyle: { width: 24, color: [[1, '#E2E8F0']] }
        },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        data: [{ value: 78.4 }],
        detail: {
          show: true,
          width: 50,
          height: 14,
          fontSize: 32,
          color: '#0F172A',
          fontWeight: 'black',
          formatter: '{value}%',
          offsetCenter: ['0%', '-25%'] // Pulled up into the semi-circle so it's visible
        }
      }
    ]
  };

  return (
    <section className="bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] py-16">
      <div className="max-w-[1400px] mx-auto w-full px-8">
        
        <h2 className="text-[26px] font-bold text-[#0F172A] mb-8">Understanding the Numbers</h2>

        <div ref={chartRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Institution Mix */}
          <div className="bg-gradient-to-b from-white to-[#F8FAFC] rounded-2xl shadow-sm border border-[#E2E8F0] p-6 flex flex-col min-h-[360px] group relative overflow-hidden hover:shadow-lg hover:border-transparent transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <h3 className="text-[17px] font-bold text-[#0F172A] mb-1">Where are institutions concentrated?</h3>
            <p className="text-[14px] text-[#64748B] mb-6">Colleges make up the vast majority of the infrastructure.</p>
            <div className="flex-1 min-h-[220px] w-full overflow-hidden relative">
              {chartsInView && <ReactECharts option={institutionOption} style={{ height: "100%", width: "100%" }} />}
            </div>
            {/* Custom Legend */}
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[13px]">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>Colleges</div>
                <div className="font-bold text-[#0F172A]">2,408 (98%)</div>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>Universities</div>
                <div className="font-bold text-[#0F172A]">42</div>
              </div>
            </div>
          </div>

          {/* Student Mix */}
          <div className="bg-gradient-to-b from-white to-[#F8FAFC] rounded-2xl shadow-sm border border-[#E2E8F0] p-6 flex flex-col min-h-[360px] group relative overflow-hidden hover:shadow-lg hover:border-transparent transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <h3 className="text-[17px] font-bold text-[#0F172A] mb-1">Student Composition</h3>
            <p className="text-[14px] text-[#64748B] mb-6">Distribution across different academic levels.</p>
            <div className="flex-1 min-h-[220px] w-full overflow-hidden relative">
              {chartsInView && <ReactECharts option={studentOption} style={{ height: "100%", width: "100%" }} />}
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-[13px]">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#2563EB]"></div>UG</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#4F46E5]"></div>PG</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#0D9488]"></div>Doc</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#D97706]"></div>Dip</div>
            </div>
          </div>

          {/* Enrolment */}
          <div className="bg-gradient-to-b from-white to-[#F8FAFC] rounded-2xl shadow-sm border border-[#E2E8F0] p-6 flex flex-col justify-center min-h-[360px] group relative overflow-hidden hover:shadow-lg hover:border-transparent transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <h3 className="text-[17px] font-bold text-[#0F172A] mb-1 w-full text-center">State Enrolment Rate</h3>
            <p className="text-[14px] text-[#64748B] mb-2 w-full text-center">Overall gross enrolment ratio for the state.</p>
            <div className="flex-1 min-h-[220px] w-full overflow-hidden relative mt-4">
              {chartsInView && <ReactECharts option={enrolmentOption} style={{ height: "100%", width: "100%" }} />}
            </div>
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#ECFDF5] text-[#10B981] text-[13px] font-bold rounded-full uppercase tracking-wider shadow-sm border border-[#A7F3D0]">
                ↑ 1.5% YoY Growth
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
