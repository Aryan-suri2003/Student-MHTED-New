"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

export interface GlobalFilterState {
  academicYear: string;
  university: string;
  district: string;
  universityType: string;
  college: string;
}

interface FiltersProps {
  filters?: GlobalFilterState;
  onFilterChange: (filters: GlobalFilterState) => void;
  activeTab?: string;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const currentFilters: GlobalFilterState = filters || {
    academicYear: "2025-26",
    university: "All",
    district: "All",
    universityType: "All",
    college: "All",
  };

  const handleChange = (field: keyof GlobalFilterState, value: string) => {
    if (field === "university") {
      onFilterChange({
        ...currentFilters,
        university: value,
        college: "All", // Reset college when university changes
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
    <div className="w-full bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* 1. Academic Year */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 mb-1.5 tracking-wide uppercase">
            Academic Year
          </label>
          <div className="relative">
            <select
              value={currentFilters.academicYear}
              onChange={(e) => handleChange("academicYear", e.target.value)}
              className="w-full bg-[#F8FAFC] hover:bg-slate-100 text-slate-800 font-semibold py-2.5 pl-3.5 pr-8 rounded-xl border border-slate-200 shadow-2xs cursor-pointer appearance-none transition-colors duration-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option className="text-slate-900" value="2025-26">2025-26 (Current)</option>
              <option className="text-slate-900" value="2024-25">2024-25</option>
              <option className="text-slate-900" value="2023-24">2023-24</option>
              <option className="text-slate-900" value="2022-23">2022-23</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <ChevronDown size={15} />
            </div>
          </div>
        </div>

        {/* 2. University */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 mb-1.5 tracking-wide uppercase truncate">
            University
          </label>
          <div className="relative">
            <select
              value={currentFilters.university}
              onChange={(e) => handleChange("university", e.target.value)}
              className="w-full bg-[#F8FAFC] hover:bg-slate-100 text-slate-800 font-semibold py-2.5 pl-3.5 pr-8 rounded-xl border border-slate-200 shadow-2xs cursor-pointer appearance-none transition-colors duration-200 text-xs md:text-sm truncate focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
              <option className="text-slate-900" value="Visva-Bharati">Visva-Bharati Central University</option>
              <option className="text-slate-900" value="Aliah">Aliah University Kolkata</option>
              <option className="text-slate-900" value="RBU">RBU - Rabindra Bharati University</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <ChevronDown size={15} />
            </div>
          </div>
        </div>

        {/* 3. District */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 mb-1.5 tracking-wide uppercase truncate">
            District
          </label>
          <div className="relative">
            <select
              value={currentFilters.district}
              onChange={(e) => handleChange("district", e.target.value)}
              className="w-full bg-[#F8FAFC] hover:bg-slate-100 text-slate-800 font-semibold py-2.5 pl-3.5 pr-8 rounded-xl border border-slate-200 shadow-2xs cursor-pointer appearance-none transition-colors duration-200 text-xs md:text-sm truncate focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option className="text-slate-900" value="All">All Districts</option>
              <option className="text-slate-900" value="Kolkata">Kolkata</option>
              <option className="text-slate-900" value="North 24 Parganas">North 24 Parganas</option>
              <option className="text-slate-900" value="South 24 Parganas">South 24 Parganas</option>
              <option className="text-slate-900" value="Howrah">Howrah</option>
              <option className="text-slate-900" value="Hooghly">Hooghly</option>
              <option className="text-slate-900" value="Purba Bardhaman">Purba Bardhaman</option>
              <option className="text-slate-900" value="Paschim Bardhaman">Paschim Bardhaman</option>
              <option className="text-slate-900" value="Nadia">Nadia</option>
              <option className="text-slate-900" value="Murshidabad">Murshidabad</option>
              <option className="text-slate-900" value="Paschim Medinipur">Paschim Medinipur</option>
              <option className="text-slate-900" value="Purba Medinipur">Purba Medinipur</option>
              <option className="text-slate-900" value="Malda">Malda</option>
              <option className="text-slate-900" value="Uttar Dinajpur">Uttar Dinajpur</option>
              <option className="text-slate-900" value="Dakshin Dinajpur">Dakshin Dinajpur</option>
              <option className="text-slate-900" value="Darjeeling">Darjeeling</option>
              <option className="text-slate-900" value="Jalpaiguri">Jalpaiguri</option>
              <option className="text-slate-900" value="Alipurduar">Alipurduar</option>
              <option className="text-slate-900" value="Cooch Behar">Cooch Behar</option>
              <option className="text-slate-900" value="Bankura">Bankura</option>
              <option className="text-slate-900" value="Purulia">Purulia</option>
              <option className="text-slate-900" value="Birbhum">Birbhum</option>
              <option className="text-slate-900" value="Kalimpong">Kalimpong</option>
              <option className="text-slate-900" value="Jhargram">Jhargram</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <ChevronDown size={15} />
            </div>
          </div>
        </div>

        {/* 4. Institution Type / Stream */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 mb-1.5 tracking-wide uppercase truncate">
            Institution Type
          </label>
          <div className="relative">
            <select
              value={currentFilters.universityType}
              onChange={(e) => handleChange("universityType", e.target.value)}
              className="w-full bg-[#F8FAFC] hover:bg-slate-100 text-slate-800 font-semibold py-2.5 pl-3.5 pr-8 rounded-xl border border-slate-200 shadow-2xs cursor-pointer appearance-none transition-colors duration-200 text-xs md:text-sm truncate focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option className="text-slate-900" value="All">All Types & Streams</option>
              <option className="text-slate-900" value="State-Aided">State-Aided & Affiliated (84.2%)</option>
              <option className="text-slate-900" value="State Government">Government Colleges (9.5%)</option>
              <option className="text-slate-900" value="Autonomous">Autonomous / Deemed (6.3%)</option>
              <option className="text-slate-900" value="Central">Central / National Institutes</option>
              <option className="text-slate-900" value="Private">Private Universities / Colleges</option>
              <option className="text-slate-900" value="Engineering">Engineering & Technology</option>
              <option className="text-slate-900" value="Pharmacy">Pharmacy</option>
              <option className="text-slate-900" value="Management">Management (MBA/MCA)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <ChevronDown size={15} />
            </div>
          </div>
        </div>

        {/* 5. College */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-500 tracking-wide uppercase truncate">
              Colleges & Schools
            </label>
            {isCollegeDisabled && (
              <span className="text-[10px] text-amber-600 font-semibold truncate ml-1">(When Uni is &apos;All&apos;)</span>
            )}
          </div>
          <div className="relative">
            <select
              disabled={isCollegeDisabled}
              value={isCollegeDisabled ? "All" : currentFilters.college}
              onChange={(e) => handleChange("college", e.target.value)}
              className={`w-full font-semibold py-2.5 pl-3.5 pr-8 rounded-xl border shadow-2xs appearance-none transition-colors duration-200 text-xs md:text-sm truncate focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                isCollegeDisabled
                  ? "bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed text-slate-400"
                  : "bg-[#F8FAFC] hover:bg-slate-100 text-slate-800 border-slate-200 cursor-pointer"
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
            <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${
              isCollegeDisabled ? "text-slate-300" : "text-slate-400"
            }`}>
              <ChevronDown size={15} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
