"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FiltersProps {
  onFilterChange: (filters: {
    academicYear: string;
    university: string;
    universityType: string;
    college: string;
  }) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const [academicYear, setAcademicYear] = useState("2025-26");
  const [university, setUniversity] = useState("All");
  const [universityType, setUniversityType] = useState("All");
  const [college, setCollege] = useState("All");

  const handleChange = (
    field: "academicYear" | "university" | "universityType" | "college",
    value: string
  ) => {
    const updated = {
      academicYear: field === "academicYear" ? value : academicYear,
      university: field === "university" ? value : university,
      universityType: field === "universityType" ? value : universityType,
      college: field === "college" ? value : college,
    };

    if (field === "academicYear") setAcademicYear(value);
    if (field === "university") setUniversity(value);
    if (field === "universityType") setUniversityType(value);
    if (field === "college") setCollege(value);

    onFilterChange(updated);
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
              value={academicYear}
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
              value={university}
              onChange={(e) => handleChange("university", e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 pl-4 pr-10 rounded-xl border border-white/10 hover:border-white/20 shadow-soft cursor-pointer appearance-none transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option className="text-slate-900" value="All">All</option>
              <option className="text-slate-900" value="COEP Technological University">COEP Technological University</option>
              <option className="text-slate-900" value="Mumbai University">Mumbai University</option>
              <option className="text-slate-900" value="Savitribai Phule Pune University">Savitribai Phule Pune University</option>
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
              value={universityType}
              onChange={(e) => handleChange("universityType", e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 pl-4 pr-10 rounded-xl border border-white/10 hover:border-white/20 shadow-soft cursor-pointer appearance-none transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option className="text-slate-900" value="All">All</option>
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
              value={college}
              onChange={(e) => handleChange("college", e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 pl-4 pr-10 rounded-xl border border-white/10 hover:border-white/20 shadow-soft cursor-pointer appearance-none transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option className="text-slate-900" value="All">All</option>
              <option className="text-slate-900" value="COEP Pune">COEP Pune</option>
              <option className="text-slate-900" value="VJTI Mumbai">VJTI Mumbai</option>
              <option className="text-slate-900" value="ICT Mumbai">ICT Mumbai</option>
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
