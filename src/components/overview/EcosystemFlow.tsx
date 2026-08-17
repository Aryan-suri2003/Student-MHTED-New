"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import { Users, GraduationCap, Building2, Microscope, Award, Library } from "lucide-react";

export default function EcosystemFlow() {
  
  const sankeyOption = {
    tooltip: { 
      trigger: 'item', 
      triggerOn: 'mousemove',
      formatter: (params: any) => {
        if (params.dataType === 'node') {
          return `<div style="font-weight:bold">${params.name}</div><div style="color:#667085">Total Flow: ${params.value}L</div>`;
        } else if (params.dataType === 'edge') {
          return `<div style="font-weight:bold">${params.data.source} → ${params.data.target}</div><div style="color:#667085">Value: ${params.data.value}L</div>`;
        }
        return '';
      }
    },
    series: [
      {
        type: 'sankey',
        left: '5%',
        right: '25%', // Leave room for labels
        top: '5%',
        bottom: '5%',
        nodeAlign: 'left',
        layoutIterations: 0, // Keep static order
        data: [
          { name: 'Students', itemStyle: { color: '#8B6FE8' } },
          { name: 'Colleges', itemStyle: { color: '#4F7FEF' } },
          { name: 'Universities', itemStyle: { color: '#244B87' } },
          { name: 'Research', itemStyle: { color: '#25B98A' } },
          { name: 'Scholarships', itemStyle: { color: '#F2A93B' } },
          { name: 'Public Libraries', itemStyle: { color: '#48B9D9' } }
        ],
        links: [
          { source: 'Students', target: 'Colleges', value: 9.8, lineStyle: { color: '#8B6FE8' } },
          { source: 'Students', target: 'Universities', value: 2.6, lineStyle: { color: '#4F7FEF' } },
          
          { source: 'Colleges', target: 'Scholarships', value: 3.5, lineStyle: { color: '#F2A93B' } },
          { source: 'Universities', target: 'Scholarships', value: 1.3, lineStyle: { color: '#F2A93B' } },
          
          { source: 'Universities', target: 'Research', value: 2.1, lineStyle: { color: '#25B98A' } },
          
          { source: 'Colleges', target: 'Public Libraries', value: 1.5, lineStyle: { color: '#48B9D9' } },
          { source: 'Universities', target: 'Public Libraries', value: 1.0, lineStyle: { color: '#48B9D9' } },
        ],
        lineStyle: {
          curveness: 0.5,
          opacity: 0.4
        },
        itemStyle: {
          borderWidth: 0,
        },
        label: {
          color: '#172033',
          fontWeight: 'bold',
          fontSize: 14,
          formatter: '{b}'
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            opacity: 0.8
          }
        }
      }
    ]
  };

  const insights = [
    { icon: GraduationCap, title: "Mass Enrollment", desc: "The vast majority of students (9.8 Lakh) are enrolled in Colleges, forming the backbone of the state's higher education system." },
    { icon: Award, title: "Widespread Aid", desc: "Scholarships provide critical support, with large flows arriving from both the College and University levels, reflecting strong welfare integration." },
    { icon: Microscope, title: "Research Funnel", desc: "Research scholars exclusively trace back to Universities, indicating the specialization of these institutions for advanced studies." }
  ];

  return (
    <section className="bg-white py-24 border-b border-[#E6EAF0]">
      <div className="max-w-7xl mx-auto w-full px-8">
        
        <div className="mb-12">
          <h2 className="text-[26px] font-bold text-[#172033] mb-1">Education Ecosystem Flow</h2>
          <p className="text-[14px] text-[#667085]">Mapping the distribution and pathways of students across the state infrastructure.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="lg:w-2/3 bg-[#F7F9FC] rounded-3xl border border-[#E6EAF0] p-8 h-[550px] relative overflow-hidden">
            <ReactECharts option={sankeyOption} style={{ height: "100%", width: "100%" }} />
            
            {/* Soft watermark behind Sankey */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Users size={400} />
            </div>
          </div>

          <div className="lg:w-1/3 flex flex-col justify-center">
            <h3 className="text-[18px] font-bold text-[#172033] mb-2">What does this flow map tell us?</h3>
            <p className="text-[14px] text-[#667085] mb-8 leading-relaxed">
              This Sankey diagram visualizes how students move through and interact with the state's educational ecosystem. The thickness of the colorful lines represents the volume of students (in Lakhs).
            </p>

            <div className="space-y-8">
              {insights.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#EAF2FF] text-[#4F7FEF] flex items-center justify-center shrink-0">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#172033] mb-1">{item.title}</h4>
                    <p className="text-[13px] text-[#667085] leading-relaxed">{item.desc}</p>
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
