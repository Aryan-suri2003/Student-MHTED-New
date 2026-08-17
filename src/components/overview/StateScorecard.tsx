import React from "react";
import clsx from "clsx";

const scores = [
  { name: "Access", score: 82, color: "bg-[#2563EB]", max: 100 },
  { name: "Participation", score: 76, color: "bg-[#8B5CF6]", max: 100 },
  { name: "Infrastructure", score: 68, color: "bg-[#38BDF8]", max: 100 },
  { name: "Growth", score: 88, color: "bg-[#10B981]", max: 100 },
  { name: "Research", score: 62, color: "bg-[#F59E0B]", max: 100 },
];

export default function StateScorecard() {
  return (
    <section className="bg-white border-b border-slate-100 py-20">
      <div className="max-w-3xl mx-auto w-full px-8">
        
        <h2 className="text-3xl font-black text-slate-900 mb-12 tracking-tight text-center">State Education Scorecard</h2>

        <div className="space-y-8">
          {scores.map(metric => (
            <div key={metric.name}>
              <div className="flex justify-between items-end mb-2">
                <span className="text-slate-600 font-bold tracking-wide uppercase text-sm">{metric.name}</span>
                <span className="text-2xl font-black text-slate-900">{metric.score} <span className="text-sm font-medium text-slate-400">/ 100</span></span>
              </div>
              
              <div className="h-3 w-full bg-[#F7F9FC] rounded-full overflow-hidden">
                <div 
                  className={clsx("h-full rounded-full transition-all duration-1000 ease-out", metric.color)} 
                  style={{ width: `${(metric.score / metric.max) * 100}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
