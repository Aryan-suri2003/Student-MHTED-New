"use client";

import React, { useState } from "react";
import { districtsData } from "@/data/districts";
import { useYear } from "@/contexts/YearContext";
import clsx from "clsx";

type MetricType = "Growth" | "Institutions" | "Students" | "Enrolment";

export default function DistrictPerformance() {
  const { academicYear } = useYear();
  const data = districtsData[academicYear] || districtsData["2025–26"];
  const [metric, setMetric] = useState<MetricType>("Growth");

  // Sort and slice top 5
  const sortedDistricts = [...data].sort((a, b) => {
    if (metric === "Growth") return parseFloat(b.growth) - parseFloat(a.growth);
    if (metric === "Institutions") return b.institutions - a.institutions;
    if (metric === "Students") return b.students - a.students;
    if (metric === "Enrolment") return b.enrolment - a.enrolment;
    return 0;
  }).slice(0, 5);

  const getMaxValue = () => {
    if (metric === "Growth") return 15; // Max 15%
    if (metric === "Institutions") return 250;
    if (metric === "Students") return 200000;
    if (metric === "Enrolment") return 100;
    return 100;
  };

  const maxVal = getMaxValue();

  const getBarColor = () => {
    if (metric === "Growth") return "bg-[#10B981]";
    if (metric === "Institutions") return "bg-[#2563EB]";
    if (metric === "Students") return "bg-[#8B5CF6]";
    if (metric === "Enrolment") return "bg-[#38BDF8]";
    return "bg-slate-400";
  };

  return (
    <section className="bg-white border-b border-slate-100 py-20">
      <div className="max-w-4xl mx-auto w-full px-8">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">District Performance</h2>
            <p className="text-slate-500 font-medium">Top performing districts across key operational metrics.</p>
          </div>

          <div className="flex bg-[#F7F9FC] p-1.5 rounded-2xl w-full md:w-auto">
            {(["Growth", "Institutions", "Students", "Enrolment"] as MetricType[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={clsx(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all flex-1 md:flex-none",
                  metric === m 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {sortedDistricts.map((dist, idx) => {
            let valStr = "";
            let numVal = 0;
            if (metric === "Growth") { valStr = dist.growth; numVal = parseFloat(dist.growth); }
            if (metric === "Institutions") { valStr = dist.institutions.toString(); numVal = dist.institutions; }
            if (metric === "Students") { valStr = `${(dist.students / 100000).toFixed(1)}L`; numVal = dist.students; }
            if (metric === "Enrolment") { valStr = `${dist.enrolment}%`; numVal = dist.enrolment; }

            const pct = Math.min(100, (numVal / maxVal) * 100);

            return (
              <div key={dist.id} className="relative group">
                <div className="flex justify-between items-end mb-2">
                  <div className="font-bold text-slate-800 text-lg flex items-center gap-3">
                    <span className="text-slate-300 font-black text-xl w-6">{idx + 1}.</span> {dist.name}
                  </div>
                  <div className="font-black text-xl text-slate-900">{valStr}</div>
                </div>
                
                <div className="h-3 w-full bg-[#F7F9FC] rounded-full overflow-hidden">
                  <div 
                    className={clsx("h-full rounded-full transition-all duration-1000 ease-out", getBarColor())} 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
