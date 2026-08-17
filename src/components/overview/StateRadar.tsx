"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { CheckCircle2, TrendingUp, Users, Building, Microscope, Award } from "lucide-react";

export default function StateRadar() {
  
  const radarOption = {
    tooltip: { trigger: 'item' },
    radar: {
      indicator: [
        { name: 'ACCESS', max: 100 },
        { name: 'PARTICIPATION', max: 100 },
        { name: 'INFRASTRUCTURE', max: 100 },
        { name: 'FACULTY', max: 100 },
        { name: 'RESEARCH', max: 100 },
        { name: 'OUTCOMES', max: 100 }
      ],
      shape: 'polygon',
      splitNumber: 5,
      axisName: {
        color: '#0F172A',
        fontWeight: '900',
        fontSize: 12,
        fontFamily: 'sans-serif',
        padding: [3, 5]
      },
      splitLine: {
        lineStyle: {
          color: ['#E2E8F0', '#E2E8F0', '#DBEAFE', '#60A5FA', '#3B82F6']
        }
      },
      splitArea: {
        areaStyle: {
          color: ['#FFFFFF', '#F8FAFC', '#FFFFFF', '#F8FAFC', '#FFFFFF']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#E2E8F0'
        }
      }
    },
    series: [
      {
        name: 'State Score',
        type: 'radar',
        data: [
          {
            value: [82, 76, 74, 71, 64, 68],
            name: 'State Education Score'
          }
        ],
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#2563EB', borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
            { offset: 0, color: 'rgba(37, 99, 235, 0.1)' },
            { offset: 1, color: 'rgba(37, 99, 235, 0.4)' }
          ])
        },
        lineStyle: {
          color: '#2563EB',
          width: 3
        }
      }
    ]
  };

  const insights = [
    { icon: Building, color: "text-[#1D4ED8]", bg: "bg-[#DBEAFE]", title: "Access (82/100)", desc: "High density of colleges ensuring geographic accessibility across all districts." },
    { icon: Users, color: "text-[#8B5CF6]", bg: "bg-[#EDE9FE]", title: "Participation (76/100)", desc: "Strong GER growth, particularly among female and marginalized students." },
    { icon: CheckCircle2, color: "text-[#10B981]", bg: "bg-[#D1FAE5]", title: "Infrastructure (74/100)", desc: "Steady modernization of campuses and libraries, though rural areas trail." },
    { icon: TrendingUp, color: "text-[#06B6D4]", bg: "bg-[#CFFAFE]", title: "Faculty (71/100)", desc: "Improving student-to-teacher ratios with recent recruitment drives." },
    { icon: Microscope, color: "text-[#F59E0B]", bg: "bg-[#FEF3C7]", title: "Research (64/100)", desc: "Growing Ph.D enrolment, but requires more industry-linked funding." },
    { icon: Award, color: "text-[#EF4444]", bg: "bg-[#FEE2E2]", title: "Outcomes (68/100)", desc: "Graduation rates are stable; focus shifting to employability and skills." },
  ];

  return (
    <section className="bg-gradient-to-b from-[#F8FAFC] to-[#FFFFFF] py-20 border-b border-[#E2E8F0]">
      <div className="max-w-[1400px] mx-auto w-full px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DBEAFE] text-[#1D4ED8] text-[12px] font-bold uppercase tracking-widest mb-4">
            State Assessment
          </div>
          <h2 className="text-[32px] font-black text-[#0F172A] mb-4 tracking-tight">State Education Pulse</h2>
          <p className="text-[16px] text-[#475569] max-w-2xl mx-auto leading-relaxed">
            A comprehensive, multi-dimensional assessment of the state's higher education ecosystem across six core domains, establishing a holistic <strong>82/100</strong> performance score.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 bg-white rounded-3xl p-8 lg:p-12 border border-[#E2E8F0] shadow-sm">
          
          <div className="w-full lg:w-1/2 h-[500px] relative flex justify-center items-center">
            <ReactECharts option={radarOption} style={{ height: "100%", width: "100%", minHeight: "450px" }} />
            
            {/* Center Score Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/95 backdrop-blur-md rounded-full w-28 h-28 flex flex-col items-center justify-center border-4 border-[#DBEAFE] shadow-lg">
                <span className="text-4xl font-black text-[#2563EB]">82</span>
                <span className="text-[11px] font-bold text-[#64748B] tracking-widest uppercase mt-1">Score</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <h3 className="text-[18px] font-bold text-[#0F172A] mb-8 border-b border-[#E2E8F0] pb-4">Domain Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              {insights.map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0F172A] mb-1">{item.title}</h4>
                    <p className="text-[13px] text-[#475569] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
          </div>

        </div>

      </div>
    </section>
  );
}
