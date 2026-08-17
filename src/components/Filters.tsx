"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

export interface GlobalFilterState {
  academicYear: string;
  university: string;
  universityType: string;
  college: string;
}

interface FiltersProps {
  filters?: GlobalFilterState;
  onFilterChange: (filters: GlobalFilterState) => void;
  activeTab?: string;
}

export default function Filters({ filters, onFilterChange, activeTab }: FiltersProps) {
  const currentFilters: GlobalFilterState = filters || {
    academicYear: "2025-26",
    university: "All",
    universityType: "All",
    college: "All",
  };

  const handleChange = (field: keyof GlobalFilterState, value: string) => {
    if (field === "university") {
      onFilterChange({
        ...currentFilters,
        university: value,
        college: "All", // Reset college when university changes or is not All
      });
    } else {
      onFilterChange({
        ...currentFilters,
        [field]: value,
      });
    }
  };

  const isCollegeDisabled = currentFilters.university !== "All";

  if (activeTab === "fra") {
    return (
      <div className="w-full bg-brand-900 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-brand-800 shadow-glow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* Year */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-brand-100 mb-1.5 tracking-wide uppercase">
              Academic Year
            </label>
            <div className="relative">
              <select className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 pl-4 pr-10 rounded-xl border border-white/10 hover:border-white/20 shadow-soft cursor-pointer appearance-none transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/20">
                <option className="text-slate-900" value="2025-26">2025-26 (Current)</option>
                <option className="text-slate-900" value="2024-25">2024-25</option>
                <option className="text-slate-900" value="2023-24">2023-24</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/80">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          
          {/* District */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-brand-100 mb-1.5 tracking-wide uppercase">
              District
            </label>
            <div className="relative">
              <select className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 pl-4 pr-10 rounded-xl border border-white/10 hover:border-white/20 shadow-soft cursor-pointer appearance-none transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/20">
                <option className="text-slate-900" value="All">All Districts</option>
                <option className="text-slate-900" value="Kolkata">Kolkata</option>
                <option className="text-slate-900" value="Howrah">Howrah</option>
                <option className="text-slate-900" value="Darjeeling">Darjeeling</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/80">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Stream */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-brand-100 mb-1.5 tracking-wide uppercase">
              Stream
            </label>
            <div className="relative">
              <select className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 pl-4 pr-10 rounded-xl border border-white/10 hover:border-white/20 shadow-soft cursor-pointer appearance-none transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/20">
                <option className="text-slate-900" value="All">All Streams</option>
                <option className="text-slate-900" value="Engineering">Engineering</option>
                <option className="text-slate-900" value="Pharmacy">Pharmacy</option>
                <option className="text-slate-900" value="Management">Management</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/80">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Institute */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-brand-100 mb-1.5 tracking-wide uppercase">
              Colleges & Schools
            </label>
            <div className="relative">
              <select className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 pl-4 pr-10 rounded-xl border border-white/10 hover:border-white/20 shadow-soft cursor-pointer appearance-none transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/20">
                <option className="text-slate-900" value="All">All Colleges & Schools</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/80">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-brand-900 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-brand-800 shadow-glow mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Academic Year */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-brand-100 mb-1.5 tracking-wide uppercase">
            Academic Year
          </label>
          <div className="relative">
            <select
              value={currentFilters.academicYear}
              onChange={(e) => handleChange("academicYear", e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 pl-4 pr-10 rounded-xl border border-white/10 hover:border-white/20 shadow-soft cursor-pointer appearance-none transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option className="text-slate-900" value="2025-26">2025-26 (Current)</option>
              <option className="text-slate-900" value="2024-25">2024-25</option>
              <option className="text-slate-900" value="2023-24">2023-24</option>
              <option className="text-slate-900" value="2022-23">2022-23</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/80">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* University */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-brand-100 mb-1.5 tracking-wide uppercase">
            University
          </label>
          <div className="relative">
            <select
              value={currentFilters.university}
              onChange={(e) => handleChange("university", e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 pl-4 pr-10 rounded-xl border border-white/10 hover:border-white/20 shadow-soft cursor-pointer appearance-none transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option className="text-slate-900" value="All">All Universities</option>
              <option className="text-slate-900" value="SPPU">SPPU - Savitribai Phule Pune Univ</option>
              <option className="text-slate-900" value="MU">MU - University of Mumbai</option>
              <option className="text-slate-900" value="DBATU">DBATU - Dr. BATU Lonere</option>
              <option className="text-slate-900" value="SUK">SUK - Shivaji University Kolhapur</option>
              <option className="text-slate-900" value="SGBAU">SGBAU - Sant Gadge Baba Amravati Univ</option>
              <option className="text-slate-900" value="PAHSU">PAHSU - Solapur University</option>
              <option className="text-slate-900" value="KBCNMU">KBCNMU - North Maharashtra Univ</option>
              <option className="text-slate-900" value="SRTMUN">SRTMUN - SRTM University Nanded</option>
              <option className="text-slate-900" value="HSNC">HSNC - HSNC University Mumbai</option>
              <option className="text-slate-900" value="BAMU">BAMU - Dr. BAMU Chh. Sambhajinagar</option>
              <option className="text-slate-900" value="COEP">COEP - COEP Technological Univ</option>
              <option className="text-slate-900" value="KBPU">KBPU - Karmaveer Bhaurao Patil Univ</option>
              <option className="text-slate-900" value="HBSU">HBSU - Dr. Homi Bhabha State Univ</option>
              <option className="text-slate-900" value="SNDT">SNDT - SNDT Women&apos;s University</option>
              <option className="text-slate-900" value="GUG">GUG - Gondwana University Gadchiroli</option>
              <option className="text-slate-900" value="LIT">LIT - Laxminarayan Tech University</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/80">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* University Type */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-brand-100 mb-1.5 tracking-wide uppercase">
            Institution Type
          </label>
          <div className="relative">
            <select
              value={currentFilters.universityType}
              onChange={(e) => handleChange("universityType", e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 pl-4 pr-10 rounded-xl border border-white/10 hover:border-white/20 shadow-soft cursor-pointer appearance-none transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option className="text-slate-900" value="All">All Types</option>
              <option className="text-slate-900" value="State Government">State Government University</option>
              <option className="text-slate-900" value="Deemed">Deemed University</option>
              <option className="text-slate-900" value="Private">Private / Autonomous</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/80">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* College */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-brand-100 tracking-wide uppercase">
              Colleges & Schools
            </label>
            {isCollegeDisabled && (
              <span className="text-[10px] text-amber-300 font-semibold">(Available when University is &apos;All&apos;)</span>
            )}
          </div>
          <div className="relative">
            <select
              disabled={isCollegeDisabled}
              value={isCollegeDisabled ? "All" : currentFilters.college}
              onChange={(e) => handleChange("college", e.target.value)}
              className={`w-full text-white font-semibold py-2.5 pl-4 pr-10 rounded-xl border shadow-soft appearance-none transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 ${
                isCollegeDisabled
                  ? "bg-white/5 border-white/5 opacity-50 cursor-not-allowed text-white/50"
                  : "bg-white/10 hover:bg-white/15 border-white/10 hover:border-white/20 cursor-pointer"
              }`}
            >
              <option className="text-slate-900" value="All">All Colleges & Schools</option>
              <option className="text-slate-900" value="VIT Pune">VIT Pune - Vishwakarma Institute of Technology</option>
              <option className="text-slate-900" value="COEP Pune">COEP Technological University Pune</option>
              <option className="text-slate-900" value="VJTI Mumbai">VJTI Mumbai</option>
              <option className="text-slate-900" value="TCET Mumbai">TCET Thakur College Mumbai</option>
              <option className="text-slate-900" value="ICT Mumbai">ICT Mumbai</option>
              <option className="text-slate-900" value="YCCE Nagpur">YCCE Hingna Road Nagpur</option>
              <option className="text-slate-900" value="TGPCET Nagpur">TGPCET Gaikwad-Patil Nagpur</option>
              <option className="text-slate-900" value="MIT Pune">MIT AOE Alandi Pune</option>
              <option className="text-slate-900" value="Sanjivani COE">Sanjivani College of Engineering Kopargaon</option>
            </select>
            <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 ${
              isCollegeDisabled ? "text-white/30" : "text-white/80"
            }`}>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
