import React from "react";
import InteractiveMap from "@/components/overview/InteractiveMap";
import DistrictPerformance from "@/components/overview/DistrictPerformance";
import StateSignals from "@/components/overview/StateSignals";

export default function DistrictsPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col font-sans">
      <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            District Higher Education Intelligence
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            District-wise Institutional Density, Student Enrolment & Annual Growth Trends
          </p>
        </div>

        <InteractiveMap />
        <DistrictPerformance />
        <StateSignals />
      </div>
    </div>
  );
}
