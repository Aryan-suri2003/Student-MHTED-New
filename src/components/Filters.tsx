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
              <option className="text-slate-900" value="All">All Universities (West Bengal)</option>
              <option className="text-slate-900" value="CU">CU - University of Calcutta</option>
              <option className="text-slate-900" value="JU">JU - Jadavpur University</option>
              <option className="text-slate-900" value="MAKAUT">MAKAUT - Maulana Abul Kalam Azad Univ of Tech</option>
              <option className="text-slate-900" value="BU">BU - University of Burdwan</option>
              <option className="text-slate-900" value="WBSU">WBSU - West Bengal State University Barasat</option>
              <option className="text-slate-900" value="KU">KU - University of Kalyani</option>
              <option className="text-slate-900" value="VU">VU - Vidyasagar University Midnapore</option>
              <option className="text-slate-900" value="NBU">NBU - North Bengal University Siliguri</option>
              <option className="text-slate-900" value="UGB">UGB - University of Gour Banga Malda</option>
              <option className="text-slate-900" value="KNU">KNU - Kazi Nazrul University Asansol</option>
              <option className="text-slate-900" value="SKBU">SKBU - Sidho-Kanho-Birsha University Purulia</option>
              <option className="text-slate-900" value="BKU">BKU - Bankura University</option>
              <option className="text-slate-900" value="CBPBU">CBPBU - Cooch Behar Panchanan Barma Univ</option>
              <option className="text-slate-900" value="Presidency">Presidency University Kolkata</option>
              <option className="text-slate-900" value="Visva-Bharati">Visva-Bharati Central University Santiniketan</option>
              <option className="text-slate-900" value="Aliah">Aliah University Kolkata</option>
              <option className="text-slate-900" value="RBU">RBU - Rabindra Bharati University</option>
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
              <option className="text-slate-900" value="State-Aided">State-Aided & Affiliated (84.2%)</option>
              <option className="text-slate-900" value="State Government">Government Colleges (9.5%)</option>
              <option className="text-slate-900" value="Autonomous">Autonomous / Deemed (6.3%)</option>
              <option className="text-slate-900" value="Central">Central / National Institutes</option>
              <option className="text-slate-900" value="Private">Private Universities / Colleges</option>
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
              <option className="text-slate-900" value="Presidency College">Presidency College Kolkata</option>
              <option className="text-slate-900" value="St. Xavier's College">St. Xavier&apos;s College (Autonomous), Kolkata</option>
              <option className="text-slate-900" value="Scottish Church College">Scottish Church College, Kolkata</option>
              <option className="text-slate-900" value="Bethune College">Bethune College, Kolkata</option>
              <option className="text-slate-900" value="Maulana Azad College">Maulana Azad College, Kolkata</option>
              <option className="text-slate-900" value="Asutosh College">Asutosh College, Kolkata</option>
              <option className="text-slate-900" value="Lady Brabourne College">Lady Brabourne College, Kolkata</option>
              <option className="text-slate-900" value="RKM Vidyamandira">RKM Vidyamandira, Belur Math</option>
              <option className="text-slate-900" value="RKM Narendrapur">RKM Residential College, Narendrapur</option>
              <option className="text-slate-900" value="Heritage Tech">Heritage Institute of Technology, Kolkata</option>
              <option className="text-slate-900" value="Haldia Institute">Haldia Institute of Technology</option>
              <option className="text-slate-900" value="KGEC Kalyani">Kalyani Govt Engineering College</option>
              <option className="text-slate-900" value="JGEC Jalpaiguri">Jalpaiguri Govt Engineering College</option>
              <option className="text-slate-900" value="Midnapore College">Midnapore College (Autonomous)</option>
              <option className="text-slate-900" value="Burdwan Raj College">Burdwan Raj College, Bardhaman</option>
              <option className="text-slate-900" value="Siliguri College">Siliguri College, Darjeeling</option>
              <option className="text-slate-900" value="Malda College">Malda College, Malda</option>
              <option className="text-slate-900" value="Hooghly Mohsin College">Hooghly Mohsin College</option>
              <option className="text-slate-900" value="Krishnagar Govt College">Krishnagar Govt College, Nadia</option>
              <option className="text-slate-900" value="South Point High School">South Point High School, Kolkata</option>
              <option className="text-slate-900" value="Hindu School">Hindu School Kolkata</option>
              <option className="text-slate-900" value="Hare School">Hare School Kolkata</option>
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
