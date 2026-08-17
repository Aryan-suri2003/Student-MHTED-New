"use client";

import React from "react";
import { Search, Bell, User } from "lucide-react";
import { useYear } from "@/contexts/YearContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const { academicYear, setAcademicYear } = useYear();
  const pathname = usePathname();

  // Very basic route-to-title mapping
  const routeTitles: Record<string, string> = {
    "/": "Overview",
    "/students": "Students",
    "/universities": "Universities",
    "/colleges": "Colleges",
    "/libraries": "Public Libraries",
    "/districts": "Districts",
    "/research": "Research",
    "/scholarships": "Scholarships",
    "/reports": "Reports",
  };
  
  const pageTitle = routeTitles[pathname] || "Dashboard";

  return (
    <header className="h-20 bg-[#F7F9FC] flex items-center justify-between px-8 sticky top-0 z-10">
      
      {/* Left */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-[#172033] tracking-tight">{pageTitle}</h2>
        <p className="text-[13px] font-medium text-[#667085]">West Bengal Higher Education Intelligence</p>
      </div>

      {/* Right - Floating Controls */}
      <div className="flex items-center gap-3">
        
        {/* Global Filters */}
        <div className="flex items-center bg-white border border-[#E2E8F0] shadow-sm rounded-full p-1 mr-2">
          
          <div className="flex items-center gap-2 px-3 py-1.5 border-r border-[#E2E8F0]">
            <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Year</span>
            <select 
              className="bg-transparent text-[13px] font-bold text-[#0F172A] outline-none cursor-pointer"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            >
              <option value="2025–26">2025–26</option>
              <option value="2024–25">2024–25</option>
              <option value="2023–24">2023–24</option>
              <option value="2022–23">2022–23</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 border-r border-[#E2E8F0]">
            <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Type</span>
            <select className="bg-transparent text-[13px] font-bold text-[#0F172A] outline-none cursor-pointer w-[110px]">
              <option value="All">All Types</option>
              <option value="State Public">State Public</option>
              <option value="State Private">State Private</option>
              <option value="Deemed">Deemed</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 border-r border-[#E2E8F0]">
            <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Univ</span>
            <select className="bg-transparent text-[13px] font-bold text-[#0F172A] outline-none cursor-pointer w-[120px] truncate">
              <option value="All">All Universities</option>
              <option value="Calcutta University">Calcutta University</option>
              <option value="Jadavpur University">Jadavpur University</option>
              <option value="Presidency University">Presidency University</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5">
            <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">College</span>
            <select className="bg-transparent text-[13px] font-bold text-[#0F172A] outline-none cursor-pointer w-[110px] truncate">
              <option value="All">All Colleges</option>
              <option value="Presidency College">Presidency College</option>
              <option value="St. Xavier's">St. Xavier's</option>
              <option value="Bethune College">Bethune College</option>
            </select>
          </div>

        </div>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors">
            <Search size={18} strokeWidth={2.5} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors relative">
            <Bell size={18} strokeWidth={2.5} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-white"></span>
          </button>
          <button className="w-10 h-10 rounded-full bg-[#EAF2FF] border border-[#4F7FEF]/20 text-[#4F7FEF] flex items-center justify-center hover:bg-[#4F7FEF] hover:text-white transition-colors">
            <User size={18} />
          </button>
        </div>

      </div>
    </header>
  );
}
