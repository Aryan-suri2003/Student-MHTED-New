"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, GraduationCap, FileText, Award, BarChart, Layers } from "lucide-react";

type TabId = "admission" | "examination" | "scholarship" | "fra" | "cap";

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: "admission", label: "Admission", icon: GraduationCap },
    { id: "examination", label: "Examination & Result", icon: FileText },
    { id: "scholarship", label: "Scholarship", icon: Award },
    { id: "fra", label: "FRA", icon: BarChart },
    { id: "cap", label: "CAP", icon: Layers },
  ] as const;

  return (
    <>
      <style>{`
        .sidebar-active-tab {
          position: relative;
          background-color: var(--color-background);
          color: var(--color-brand-900) !important;
          border-top-left-radius: 9999px;
          border-bottom-left-radius: 9999px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          margin-right: -16px; /* pull to the right edge to overlap padding */
          padding-right: 16px; /* compensate for the pull */
          width: calc(100% + 16px);
        }
        
        .sidebar-active-tab::before {
          content: "";
          position: absolute;
          top: -20px;
          right: 0;
          width: 20px;
          height: 20px;
          border-bottom-right-radius: 20px;
          box-shadow: 10px 10px 0 10px var(--color-background);
          background-color: transparent;
          pointer-events: none;
        }

        .sidebar-active-tab::after {
          content: "";
          position: absolute;
          bottom: -20px;
          right: 0;
          width: 20px;
          height: 20px;
          border-top-right-radius: 20px;
          box-shadow: 10px -10px 0 10px var(--color-background);
          background-color: transparent;
          pointer-events: none;
        }
      `}</style>

      <aside className={`bg-brand-900 text-white flex flex-col h-[calc(100vh-32px)] my-4 ml-4 rounded-[40px] shadow-lg transition-all duration-300 relative overflow-hidden flex-shrink-0
        ${isCollapsed ? "w-[90px] px-2 py-6" : "w-[260px] pl-6 pr-4 py-8"}
      `}>

        {/* Branding Section */}
        <div className={`flex items-center mb-8 ${isCollapsed ? "justify-center" : "gap-3 px-2"}`}>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-extrabold text-sm tracking-wider flex-shrink-0">
            WB
          </div>
          {!isCollapsed && (
            <div className="whitespace-nowrap overflow-hidden">
              <h3 className="text-sm font-bold text-white tracking-wide">Brand Name</h3>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col flex-1 w-full gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center transition-all duration-300 cursor-pointer select-none
                  ${isCollapsed ? "justify-center w-[50px] mx-auto py-3 rounded-full" : "justify-start py-3 pl-4 rounded-l-full w-full"}
                  ${isActive
                    ? (isCollapsed ? "bg-[var(--color-background)] text-brand-900 shadow-sm" : "sidebar-active-tab")
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                  }
                `}
                title={isCollapsed ? tab.label : undefined}
              >
                <Icon size={isCollapsed ? 24 : 20} className="flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                {!isCollapsed && (
                  <span className="whitespace-nowrap overflow-hidden ml-4 font-semibold text-sm">
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Toggle Button at Bottom */}
        <div className={`mt-auto flex ${isCollapsed ? "justify-center" : "justify-start pl-4"}`}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-10 h-10 rounded-full bg-white text-brand-900 flex items-center justify-center hover:bg-blue-50 transition-colors shadow-md"
          >
            {isCollapsed ? <ChevronRight size={20} strokeWidth={3} /> : <ChevronLeft size={20} strokeWidth={3} />}
          </button>
        </div>

      </aside>
    </>
  );
}
