"use client";

import React, { useState } from "react";
import { districtsData } from "@/data/districts";
import { TrendingUp, TrendingDown, MapPin, Search, AlertCircle, Sparkles } from "lucide-react";
import clsx from "clsx";

const INSIGHTS = [
  {
    id: 1,
    type: "positive",
    title: "Female Enrolment Surge in Paschim Medinipur",
    desc: "A 12% year-over-year increase in female student enrolment, largely driven by new rural scholarship programs and localized college expansion.",
    impact: "High",
    icon: TrendingUp,
    color: "text-[#10B981]",
    bg: "bg-[#D1FAE5]"
  },
  {
    id: 2,
    type: "negative",
    title: "Research Output Stagnation in North Bengal",
    desc: "Despite an increase in faculty, research publications and PhD enrolments have plateaued over the last 3 semesters in Darjeeling and Jalpaiguri.",
    impact: "Medium",
    icon: TrendingDown,
    color: "text-[#EF4444]",
    bg: "bg-[#FEE2E2]"
  },
  {
    id: 3,
    type: "alert",
    title: "Infrastructure Deficit in Purulia",
    desc: "Student-to-classroom ratio has exceeded the state threshold of 60:1, indicating immediate need for capital expenditure in new college blocks.",
    impact: "High",
    icon: AlertCircle,
    color: "text-[#F59E0B]",
    bg: "bg-[#FEF3C7]"
  },
  {
    id: 4,
    type: "positive",
    title: "Vocational Integration Success",
    desc: "Kolkata and Howrah show a 22% increase in students taking integrated vocational degrees aligned with local industry demands.",
    impact: "Medium",
    icon: Sparkles,
    color: "text-[#2563EB]",
    bg: "bg-[#DBEAFE]"
  }
];

export default function StateSignals() {
  const [search, setSearch] = useState("");
  const allDistricts = districtsData["2025–26"];
  
  // Rank districts by growth momentum
  const rankedDistricts = [...allDistricts]
    .sort((a, b) => parseFloat(b.growth) - parseFloat(a.growth))
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 10);

  return (
    <section className="bg-gradient-to-t from-[#F8FAFC] to-[#FFFFFF] py-20 border-b border-[#E2E8F0]">
      <div className="max-w-[1400px] mx-auto w-full px-8">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6">
          <div>
            <h2 className="text-[26px] font-bold text-[#0F172A] mb-1">State Signals & Momentum</h2>
            <p className="text-[14px] text-[#475569]">AI-generated insights and district performance rankings.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Automated Insights */}
          <div className="lg:w-1/2 flex flex-col gap-5">
            <h3 className="text-[14px] font-bold text-[#0F172A] uppercase tracking-wider mb-2">Automated Insights</h3>
            {INSIGHTS.map(insight => (
              <div key={insight.id} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow flex gap-5 group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${insight.bg} ${insight.color}`}>
                  <insight.icon size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h4 className="text-[16px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">{insight.title}</h4>
                    <span className={clsx(
                      "text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide",
                      insight.impact === "High" ? "bg-[#FEE2E2] text-[#EF4444]" : "bg-[#F1F5F9] text-[#64748B]"
                    )}>
                      {insight.impact} Impact
                    </span>
                  </div>
                  <p className="text-[14px] text-[#475569] leading-relaxed">{insight.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: District Momentum Rankings */}
          <div className="lg:w-1/2 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col h-[650px] overflow-hidden">
            <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#F8FAFC]">
              <h3 className="text-[15px] font-bold text-[#0F172A]">District Growth Momentum</h3>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input 
                  type="text"
                  placeholder="Search district..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] w-full sm:w-[200px]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Rank</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">District</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] text-right">YoY Growth</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] text-right">Momentum Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedDistricts.map((dist, idx) => (
                    <tr key={dist.id} className="hover:bg-[#F8FAFC] transition-colors group border-b border-[#E2E8F0] last:border-0">
                      <td className="py-4 px-4">
                        <div className="w-6 h-6 rounded-md bg-[#F1F5F9] text-[#475569] flex items-center justify-center text-[12px] font-bold">
                          {idx + 1}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-[#0F172A] flex items-center gap-2">
                        <MapPin size={14} className="text-[#94A3B8] group-hover:text-[#2563EB]" />
                        {dist.name}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-[#10B981]">
                        +{dist.growth}%
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <div className="h-1.5 w-16 bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: `${parseFloat(dist.growth) * 5}%` }}></div>
                          </div>
                          <span className="text-[13px] font-bold text-[#475569] w-8">{(parseFloat(dist.growth) * 8.5).toFixed(0)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] text-center">
              <button className="text-[13px] font-bold text-[#2563EB] hover:text-[#1E3A8A]">View Complete Ranking →</button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
