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
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const currentFilters: GlobalFilterState = filters || {
    academicYear: "2025-26",
    university: "All",
    universityType: "All",
    college: "All",
  };

  const handleChange = (field: keyof GlobalFilterState, value: string) => {
    onFilterChange({
      ...currentFilters,
      [field]: value,
    });
  };

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
              <option className="text-slate-900" value="2025-26">2025-26</option>
              <option className="text-slate-900" value="2024-25">2024-25</option>
              <option className="text-slate-900" value="2023-24">2023-24</option>
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
              <option className="text-slate-900" value="SPPU">SPPU - Savitribai Phule Pune University</option>
              <option className="text-slate-900" value="MU">MU - University of Mumbai</option>
              <option className="text-slate-900" value="DBATU">DBATU - Dr. BATU Lonere</option>
              <option className="text-slate-900" value="SUK">SUK - Shivaji University Kolhapur</option>
              <option className="text-slate-900" value="SGBAU">SGBAU - Sant Gadge Baba Amravati University</option>
              <option className="text-slate-900" value="PAHSU">PAHSU - Solapur University</option>
              <option className="text-slate-900" value="KBCNMU">KBCNMU - North Maharashtra University</option>
              <option className="text-slate-900" value="SRTMUN">SRTMUN - SRTM University Nanded</option>
              <option className="text-slate-900" value="HSNC">HSNC - HSNC University Mumbai</option>
              <option className="text-slate-900" value="BAMU">BAMU - Dr. BAMU Chh. Sambhajinagar</option>
              <option className="text-slate-900" value="COEP">COEP - COEP Technological University</option>
              <option className="text-slate-900" value="KBPU">KBPU - Karmaveer Bhaurao Patil University</option>
              <option className="text-slate-900" value="HBSU">HBSU - Dr. Homi Bhabha State University</option>
              <option className="text-slate-900" value="SNDT">SNDT - SNDT Women&apos;s University</option>
              <option className="text-slate-900" value="GUG">GUG - Gondwana University Gadchiroli</option>
              <option className="text-slate-900" value="LIT">LIT - Laxminarayan Innovation Tech Univ</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/80">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* University Type */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-brand-100 mb-1.5 tracking-wide uppercase">
            University Type
          </label>
          <div className="relative">
            <select
              value={currentFilters.universityType}
              onChange={(e) => handleChange("universityType", e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 pl-4 pr-10 rounded-xl border border-white/10 hover:border-white/20 shadow-soft cursor-pointer appearance-none transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option className="text-slate-900" value="All">All Types</option>
              <option className="text-slate-900" value="State Government">State Government</option>
              <option className="text-slate-900" value="Deemed">Deemed</option>
              <option className="text-slate-900" value="Private">Private</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/80">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* College */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-brand-100 mb-1.5 tracking-wide uppercase">
            College
          </label>
          <div className="relative">
            <select
              value={currentFilters.college}
              onChange={(e) => handleChange("college", e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 pl-4 pr-10 rounded-xl border border-white/10 hover:border-white/20 shadow-soft cursor-pointer appearance-none transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option className="text-slate-900" value="All">All Colleges</option>
              <option className="text-slate-900" value="COEP Pune">COEP Pune</option>
              <option className="text-slate-900" value="VJTI Mumbai">VJTI Mumbai</option>
              <option className="text-slate-900" value="ICT Mumbai">ICT Mumbai</option>
              <option className="text-slate-900" value="Sanjivani COE">Sanjivani COE</option>
              <option className="text-slate-900" value="MIT Pune">MIT Pune</option>
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
