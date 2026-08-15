import React from 'react';
import { RotateCcw, ChevronDown, ListFilter } from 'lucide-react';
import { ActiveTab, FilterState } from '../types';
import { DISTRICTS_LIST, UNIVERSITY_LIST, COLLEGE_TYPES, RESEARCH_THEMES, UNIVERSITY_OUTPUT_DATA } from '../data/mockData';

interface FilterBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeTab,
  onSelectTab,
  filters,
  onFilterChange,
  onResetFilters
}) => {
  return (
    <div className="bg-white px-4 lg:px-8 py-4 z-30 relative">

      {/* Top Row / Dynamic Controls depending on tab */}
      {activeTab === 'affiliation' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 mb-4 ">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              University Type
            </label>
            <div className="relative">
              <select
                id="filter-university-type"
                value={filters.universityType}
                onChange={(e) => onFilterChange('universityType', e.target.value)}
                className="w-full bg-white   px-4 py-2 text-[12px] font-medium text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:outline-none appearance-none cursor-pointer transition-all  pr-10"
              >
                <option value="All">All</option>
                <option value="State Public">State Public Universities</option>
                <option value="State Private">State Private Universities</option>
                <option value="Deemed">Deemed Universities</option>
                <option value="State Board">State Board (Polytechnics)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              University
            </label>
            <div className="relative">
              <select
                id="filter-university"
                value={filters.university}
                onChange={(e) => onFilterChange('university', e.target.value)}
                className="w-full bg-white   px-4 py-2 text-[12px] font-medium text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:outline-none appearance-none cursor-pointer transition-all  pr-10"
              >
                {UNIVERSITY_LIST.map((u) => (
                  <option key={u} value={u === 'All Universities' ? 'All' : u}>
                    {u === 'All Universities' ? 'All' : u}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              College Type
            </label>
            <div className="relative">
              <select
                id="filter-college-type"
                value={filters.collegeType}
                onChange={(e) => onFilterChange('collegeType', e.target.value)}
                className="w-full bg-white   px-4 py-2 text-[12px] font-medium text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:outline-none appearance-none cursor-pointer transition-all  pr-10"
              >
                {COLLEGE_TYPES.map((t) => (
                  <option key={t} value={t === 'All Types' ? 'All' : t}>
                    {t === 'All Types' ? 'All' : t}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              College Name
            </label>
            <div className="relative">
              <select
                id="filter-college-name"
                value={filters.collegeName}
                onChange={(e) => onFilterChange('collegeName', e.target.value)}
                className="w-full bg-white   px-4 py-2 text-[12px] font-medium text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:outline-none appearance-none cursor-pointer transition-all  pr-10"
              >
                <option value="All">All</option>
                <option value="St. Xavier's College (Autonomous)">St. Xavier's College (Autonomous)</option>
                <option value="Bethune College">Bethune College</option>
                <option value="Scottish Church College">Scottish Church College</option>
                <option value="Presidency College Campus Wing">Presidency College Campus Wing</option>
                <option value="Central Calcutta Polytechnic">Central Calcutta Polytechnic</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'campus' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 mb-4 ">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              University
            </label>
            <div className="relative">
              <select
                id="campus-filter-university"
                value={filters.university}
                onChange={(e) => onFilterChange('university', e.target.value)}
                className="w-full bg-white   px-4 py-2 text-[12px] font-medium text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:outline-none appearance-none cursor-pointer transition-all  pr-10"
              >
                <option value="All">All</option>
                <option value="Calcutta University">Calcutta University</option>
                <option value="Jadavpur University">Jadavpur University</option>
                <option value="Presidency University">Presidency University</option>
                <option value="MAKAUT">MAKAUT</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              District
            </label>
            <div className="relative">
              <select
                id="campus-filter-district"
                value={filters.district}
                onChange={(e) => onFilterChange('district', e.target.value)}
                className="w-full bg-white   px-4 py-2 text-[12px] font-medium text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:outline-none appearance-none cursor-pointer transition-all  pr-10"
              >
                {DISTRICTS_LIST.map((d) => (
                  <option key={d} value={d === 'All Districts' ? 'All' : d}>
                    {d === 'All Districts' ? 'All' : d}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'research' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 mb-4 ">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              University Code
            </label>
            <div className="relative flex-1">
              <select
                id="filter-research-univ-code"
                value={filters.universityCode}
                onChange={(e) => onFilterChange('universityCode', e.target.value)}
                className="w-full bg-white   px-4 py-2 text-[12px] font-medium text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:outline-none appearance-none cursor-pointer transition-all  pr-10"
              >
                <option value="All">All</option>
                {UNIVERSITY_OUTPUT_DATA.map((u) => (
                  <option key={u.code} value={u.code}>{u.code} - {u.fullName}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Year
            </label>
            <div className="relative flex-1">
              <select
                id="filter-research-year"
                value={filters.year}
                onChange={(e) => onFilterChange('year', e.target.value)}
                className="w-full bg-white   px-4 py-2 text-[12px] font-medium text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:outline-none appearance-none cursor-pointer transition-all  pr-10"
              >
                <option value="All">All</option>
                <option value="2026">2026</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Theme
            </label>
            <div className="relative flex-1">
              <select
                id="filter-research-theme"
                value={filters.theme}
                onChange={(e) => onFilterChange('theme', e.target.value)}
                className="w-full bg-white  px-3 py-1.5 text-[12px] font-medium text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none appearance-none cursor-pointer transition-colors  pr-8 truncate"
              >
                <option value="All">All</option>
                {RESEARCH_THEMES.map((t) => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Sub-theme
            </label>
            <div className="relative flex-1">
              <select
                id="filter-research-subtheme"
                value={filters.subTheme}
                onChange={(e) => onFilterChange('subTheme', e.target.value)}
                className="w-full bg-white  px-3 py-1.5 text-[12px] font-medium text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none appearance-none cursor-pointer transition-colors  pr-8 truncate"
              >
                <option value="All">All</option>
                <option value="Computer Vision">Computer Vision & Diagnostics</option>
                <option value="NLP">NLP for Indic Scripts</option>
                <option value="Nanomaterials">Nanomaterials & Composites</option>
                <option value="Perovskite">Perovskite Solar Cells</option>
                <option value="Digital Humanities">Digital Humanities</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {/* Main Switcher Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* View Switcher Pills */}
        <div className="flex items-center gap-4 p-1.5 overflow-hidden border-b border-slate-200">
          <button
            id="tab-btn-affiliation"
            onClick={() => onSelectTab('affiliation')}
            className={`py-1.5 text-[12px] font-semibold transition-all cursor-pointer ${activeTab === 'affiliation'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Affiliation - College
          </button>
          <button
            id="tab-btn-campus"
            onClick={() => onSelectTab('campus')}
            className={`py-1.5 text-[12px] font-semibold transition-all cursor-pointer ${activeTab === 'campus'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            University Campus
          </button>
          <button
            id="tab-btn-research"
            onClick={() => onSelectTab('research')}
            className={`py-1.5 text-[12px] font-semibold transition-all cursor-pointer ${activeTab === 'research'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Research
          </button>
        </div>

        {/* Right side dropdowns for Campus view & Reset All Button */}
        <div className="flex items-center gap-2.5">
          <button
            id="filter-reset-all-btn"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-4 py-2 hover:bg-slate-50 text-[12px] font-medium text-slate-500 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
