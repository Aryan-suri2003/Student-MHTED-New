"use client";

import React from "react";

type TabId = "admission" | "examination" | "scholarship" | "fra" | "cap";

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: "admission", label: "Admission" },
    { id: "examination", label: "Examination & Result" },
    { id: "scholarship", label: "Scholarship" },
    { id: "fra", label: "FRA" },
    { id: "cap", label: "CAP" },
  ] as const;

  return (
    <aside className="w-full lg:w-[320px] bg-brand-900 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-brand-800 flex flex-row lg:flex-col overflow-x-auto no-scrollbar gap-2 lg:gap-3.5 h-fit lg:h-full scroll-smooth flex-shrink-0">
      
      {/* Decorative Branding Section (Desktop only) */}
      <div className="hidden lg:flex items-center gap-3 pb-6 mb-2 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white font-extrabold text-sm tracking-wider shadow-inner border border-white/5">
          WB
        </div>
        <div>
          <h3 className="text-xs font-black text-white tracking-widest uppercase">Student Portal</h3>
          <p className="text-[9px] text-white/60 font-semibold uppercase tracking-wider mt-0.5">Higher Education WB</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-row lg:flex-col gap-2 lg:gap-2.5 w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-w-[140px] lg:min-w-0 text-center lg:text-left py-3 px-4 lg:py-3.5 lg:px-5 rounded-xl lg:rounded-2xl font-bold text-xs md:text-sm transition-all duration-300 cursor-pointer flex-grow lg:flex-grow-0 select-none ${
                isActive
                  ? "bg-white text-brand-900 border border-white shadow-soft lg:pl-8 transform scale-[1.02]"
                  : "bg-white/5 text-white/80 hover:bg-white/15 hover:text-white border border-transparent lg:hover:pl-7"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
