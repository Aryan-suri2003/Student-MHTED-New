"use client";

import React from "react";

const metrics = [
  { label: "Students", value: "12.4L", color: "text-[#8B6FE8]" },
  { label: "Institutions", value: "2,450", color: "text-[#4F7FEF]" },
  { label: "Faculty", value: "48.2K", color: "text-[#48B9D9]" },
  { label: "Libraries", value: "3,120", color: "text-[#F2A93B]" },
  { label: "Research Scholars", value: "15.2K", color: "text-[#25B98A]" },
  { label: "Scholarship Beneficiaries", value: "4.8L", color: "text-[#F2A93B]" },
];

export default function SnapshotTicker() {
  return (
    <section className="bg-white py-16 border-b border-[#E6EAF0] overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-8">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          
          <div className="shrink-0">
            <h2 className="text-[20px] font-bold text-[#172033] mb-1">State Snapshot</h2>
            <div className="w-12 h-1 bg-[#4F7FEF] rounded-full"></div>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-center gap-x-12 gap-y-8 w-full justify-between">
            {metrics.map((m, idx) => (
              <div key={idx} className="flex flex-col">
                <div className={`text-[32px] font-black tracking-tight leading-none mb-2 ${m.color}`}>
                  {m.value}
                </div>
                <div className="text-[12px] font-bold text-[#667085] uppercase tracking-wider">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
