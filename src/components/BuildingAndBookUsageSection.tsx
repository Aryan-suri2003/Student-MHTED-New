import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { Building2, BookOpen, Search, ArrowUpDown, ExternalLink, X, CheckCircle2, Sparkles, Filter } from 'lucide-react';
import { DistrictData, Language, BuildingFilter, GradeFilter } from '../types';

interface BuildingAndBookUsageSectionProps {
  language: Language;
  onSelectDistrict: (districtId: string) => void;
  selectedDistrict: string;
  onOpenDistrictModal: (district: DistrictData) => void;
  selectedBuilding: BuildingFilter;
  onSelectBuilding: (b: BuildingFilter) => void;
  selectedGrade: GradeFilter;
  filteredDistricts: DistrictData[];
  allDistricts?: DistrictData[];
}

export const BuildingAndBookUsageSection: React.FC<BuildingAndBookUsageSectionProps> = ({
  language,
  onSelectDistrict,
  selectedDistrict,
  onOpenDistrictModal,
  selectedBuilding,
  onSelectBuilding,
  selectedGrade,
  filteredDistricts,
  allDistricts = filteredDistricts,
}) => {
  const [tableSearch, setTableSearch] = useState<string>('');
  const [sortField, setSortField] = useState<'name' | 'libraries' | 'books' | 'usage' | 'share' | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [hoveredBuildingKey, setHoveredBuildingKey] = useState<BuildingFilter>(null);

  // Compute building stats from full division/year dataset for accurate pie proportions
  const baseDistricts = allDistricts.length > 0 ? allDistricts : filteredDistricts;
  const totalRented = baseDistricts.reduce((acc, d) => acc + d.buildingType.rented, 0);
  const totalOwned = baseDistricts.reduce((acc, d) => acc + d.buildingType.owned, 0);
  const totalFree = baseDistricts.reduce((acc, d) => acc + d.buildingType.freeOfCharge, 0);
  const sumBuildings = totalRented + totalOwned + totalFree || 1;

  const buildingConfig = {
    owned: {
      key: 'owned' as const,
      name: language === 'bn' ? 'নিজস্ব ভবন (Own)' : 'Own Building',
      shortName: language === 'bn' ? 'নিজস্ব' : 'Own',
      color: '#0284c7',
      gradId: 'gradOwnBuilding',
      gradientStart: '#38bdf8',
      gradientMiddle: '#0284c7',
      gradientEnd: '#0369a1',
      bgLight: 'bg-sky-50',
      border: 'border-sky-300',
      text: 'text-sky-900',
      count: totalOwned,
      pct: Math.round((totalOwned / sumBuildings) * 100),
    },
    rented: {
      key: 'rented' as const,
      name: language === 'bn' ? 'ভাড়া ভবন (Rented)' : 'Rented Premises',
      shortName: language === 'bn' ? 'ভাড়া' : 'Rented',
      color: '#003366',
      gradId: 'gradRentedBuilding',
      gradientStart: '#60a5fa',
      gradientMiddle: '#1d4ed8',
      gradientEnd: '#002244',
      bgLight: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-950',
      count: totalRented,
      pct: Math.round((totalRented / sumBuildings) * 100),
    },
    freeOfCharge: {
      key: 'freeOfCharge' as const,
      name: language === 'bn' ? 'বিনামূল্যে প্রাপ্ত (Free/Donated)' : 'Free / Donated',
      shortName: language === 'bn' ? 'বিনামূল্যে' : 'Free/Donated',
      color: '#059669',
      gradId: 'gradFreeBuilding',
      gradientStart: '#34d399',
      gradientMiddle: '#059669',
      gradientEnd: '#064e3b',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-900',
      count: totalFree,
      pct: Math.round((totalFree / sumBuildings) * 100),
    },
  };

  const dynamicBuildingData = [
    buildingConfig.owned,
    buildingConfig.rented,
    buildingConfig.freeOfCharge,
  ];

  // Filter and sort districts for the table
  const displayedDistricts = useMemo(() => {
    let result = [...filteredDistricts];

    if (selectedBuilding) {
      result = result.filter((d) => (d.buildingType[selectedBuilding] || 0) > 0);
    }

    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      result = result.filter(
        (d) => d.name.toLowerCase().includes(q) || d.bengaliName.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      if (sortField === 'name') {
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortField === 'libraries') {
        valA = selectedBuilding ? a.buildingType[selectedBuilding] : a.totalLibraries;
        valB = selectedBuilding ? b.buildingType[selectedBuilding] : b.totalLibraries;
      } else if (sortField === 'books') {
        if (selectedBuilding) {
          const ratioA = a.totalLibraries > 0 ? a.buildingType[selectedBuilding] / a.totalLibraries : 0;
          const ratioB = b.totalLibraries > 0 ? b.buildingType[selectedBuilding] / b.totalLibraries : 0;
          valA = a.booksInLac * ratioA;
          valB = b.booksInLac * ratioB;
        } else {
          valA = a.booksInLac;
          valB = b.booksInLac;
        }
      } else if (sortField === 'usage') {
        if (selectedBuilding) {
          const ratioA = a.totalLibraries > 0 ? a.buildingType[selectedBuilding] / a.totalLibraries : 0;
          const ratioB = b.totalLibraries > 0 ? b.buildingType[selectedBuilding] / b.totalLibraries : 0;
          valA = a.usageInLac * ratioA;
          valB = b.usageInLac * ratioB;
        } else {
          valA = a.usageInLac;
          valB = b.usageInLac;
        }
      } else if (sortField === 'share') {
        if (selectedBuilding) {
          valA = a.totalLibraries > 0 ? (a.buildingType[selectedBuilding] / a.totalLibraries) * 100 : 0;
          valB = b.totalLibraries > 0 ? (b.buildingType[selectedBuilding] / b.totalLibraries) * 100 : 0;
        } else {
          valA = a.totalLibraries;
          valB = b.totalLibraries;
        }
      }

      return sortAsc ? valA - valB : valB - valA;
    });

    return result;
  }, [filteredDistricts, selectedBuilding, tableSearch, sortField, sortAsc]);

  const handleSort = (field: 'name' | 'libraries' | 'books' | 'usage' | 'share') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Dynamic summary calculations based on building filter
  const summaryMetrics = useMemo(() => {
    if (selectedBuilding) {
      const bLibraries = displayedDistricts.reduce((acc, d) => acc + (d.buildingType[selectedBuilding] || 0), 0);
      const bBooks = displayedDistricts.reduce((acc, d) => {
        const ratio = d.totalLibraries > 0 ? (d.buildingType[selectedBuilding] || 0) / d.totalLibraries : 0;
        return acc + (d.booksInLac * ratio);
      }, 0);
      const bUsage = displayedDistricts.reduce((acc, d) => {
        const ratio = d.totalLibraries > 0 ? (d.buildingType[selectedBuilding] || 0) / d.totalLibraries : 0;
        return acc + (d.usageInLac * ratio);
      }, 0);

      return {
        districtsCount: displayedDistricts.length,
        totalLibraries: bLibraries,
        totalBooks: bBooks,
        totalUsage: bUsage,
      };
    } else {
      const tLibs = displayedDistricts.reduce((acc, d) => acc + d.totalLibraries, 0);
      const tBooks = displayedDistricts.reduce((acc, d) => acc + d.booksInLac, 0);
      const tUsage = displayedDistricts.reduce((acc, d) => acc + d.usageInLac, 0);

      return {
        districtsCount: displayedDistricts.length,
        totalLibraries: tLibs,
        totalBooks: tBooks,
        totalUsage: tUsage,
      };
    }
  }, [displayedDistricts, selectedBuilding]);

  const activeBuildingLabel = selectedBuilding ? buildingConfig[selectedBuilding]?.name : null;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Card: Building Ownership Donut with Gradient */}
      <div
        id="building-ownership-card"
        className="lg:col-span-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-200"
      >
        {/* Clean Header */}
        <div className="px-5 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                  {language === 'bn' ? 'গ্রন্থাগার ভবনের ধরন' : 'Building Ownership Type'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                  <Sparkles className="w-2.5 h-2.5" />
                  Interactive
                </span>
              </div>
            </div>
          </div>
          {selectedBuilding && (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => onSelectBuilding(null)}
              className="text-[11px] font-bold text-blue-700 hover:text-blue-950 flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200 cursor-pointer shadow-2xs"
            >
              <X className="w-3 h-3" />
              <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
            </motion.button>
          )}
        </div>

        {/* Donut Chart with SVG Gradients */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div className="w-full h-52 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {dynamicBuildingData.map((item) => (
                    <linearGradient key={item.gradId} id={item.gradId} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={item.gradientStart} />
                      <stop offset="50%" stopColor={item.gradientMiddle || item.gradientStart} />
                      <stop offset="100%" stopColor={item.gradientEnd} />
                    </linearGradient>
                  ))}
                  <filter id="pieDropShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.15" />
                  </filter>
                </defs>
                <Pie
                  data={dynamicBuildingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="pct"
                  isAnimationActive={true}
                  animationDuration={1300}
                  animationEasing="ease-out"
                  cursor="pointer"
                  style={{ filter: 'url(#pieDropShadow)' }}
                  onMouseEnter={(entry: any) => {
                    const key = entry?.key || entry?.payload?.key;
                    setHoveredBuildingKey(key);
                  }}
                  onMouseLeave={() => setHoveredBuildingKey(null)}
                  onClick={(entry: any) => {
                    const key = entry?.key || entry?.payload?.key;
                    if (key) {
                      onSelectBuilding(selectedBuilding === key ? null : key);
                    }
                  }}
                >
                  {dynamicBuildingData.map((entry, index) => {
                    const isSelected = selectedBuilding === entry.key;
                    const isHovered = hoveredBuildingKey === entry.key;
                    const isDimmed = selectedBuilding && !isSelected;

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isDimmed ? '#cbd5e1' : `url(#${entry.gradId})`}
                        stroke={isSelected ? '#0f172a' : isHovered ? '#475569' : '#ffffff'}
                        strokeWidth={isSelected ? 3.5 : isHovered ? 2 : 1.5}
                        opacity={isDimmed ? 0.3 : 1}
                        className="transition-all duration-200"
                      />
                    );
                  })}
                </Pie>
                <RechartsTooltip
                  formatter={(val: number, name: string, item: any) => [
                    `${val}% (${item.payload.count.toLocaleString('en-IN')} premises)`,
                    item.payload.name,
                  ]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '12px',
                    fontSize: '11px',
                    boxShadow: '0 8px 24px -4px rgb(0 0 0 / 0.15)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-slate-900 font-mono">
                {selectedBuilding
                  ? buildingConfig[selectedBuilding]?.count.toLocaleString('en-IN')
                  : sumBuildings.toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                {selectedBuilding ? buildingConfig[selectedBuilding]?.shortName : 'Premises'}
              </span>
            </div>
          </div>

          {/* Interactive Legend Buttons with Gradients */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-500 font-semibold mb-1 flex items-center justify-between">
              <span>{language === 'bn' ? 'ফিল্টার করতে ক্লিক করুন:' : 'Click category to filter table:'}</span>
              {selectedBuilding && (
                <span className="text-blue-700 font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" /> Active
                </span>
              )}
            </div>
            {dynamicBuildingData.map((item) => {
              const isSelected = selectedBuilding === item.key;
              const isHovered = hoveredBuildingKey === item.key;
              const isDimmed = selectedBuilding && !isSelected;

              return (
                <motion.button
                  key={item.key}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setHoveredBuildingKey(item.key)}
                  onMouseLeave={() => setHoveredBuildingKey(null)}
                  onClick={() => onSelectBuilding(isSelected ? null : item.key)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-600/30 font-bold shadow-xs'
                      : isHovered
                      ? 'bg-slate-100 border-slate-300 text-slate-900'
                      : isDimmed
                      ? 'bg-slate-50/50 border-slate-200/60 opacity-60 text-slate-400'
                      : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                      style={{
                        background: `linear-gradient(135deg, ${item.gradientStart}, ${item.gradientEnd})`,
                      }}
                    />
                    <span className="text-slate-800 text-[11px] sm:text-xs truncate font-medium">{item.name}</span>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <div>
                      <span className="font-black text-slate-900 text-xs font-mono">{item.pct}%</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{item.count.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Card: District-wise Collection & Usage of Books */}
      <div
        id="book-usage-card"
        className="lg:col-span-8 rounded-2xl bg-white border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-200"
      >
        {/* Clean Header with Active Building Pill & Search */}
        <div className="px-5 py-3.5 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  {language === 'bn' ? 'জেলাভিত্তিক গ্রন্থভাণ্ডার ও ব্যবহার পরিসংখ্যান' : 'District-wise Collection & Usage of Books'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  <Sparkles className="w-2.5 h-2.5" />
                  Synced
                </span>
              </div>
              {selectedBuilding && (
                <p className="text-[11px] text-sky-800 font-semibold flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3 text-sky-600" />
                  <span>
                    {language === 'bn'
                      ? `${activeBuildingLabel} পরিসংখ্যানে ফিল্টার করা হয়েছে`
                      : `Filtered by: ${activeBuildingLabel}`}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Filter Switchers */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px]">
              <button
                onClick={() => onSelectBuilding(null)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedBuilding === null
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'bn' ? 'সব ভবন' : 'All'}
              </button>
              <button
                onClick={() => onSelectBuilding('owned')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedBuilding === 'owned'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'bn' ? 'নিজস্ব' : 'Own'}
              </button>
              <button
                onClick={() => onSelectBuilding('rented')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedBuilding === 'rented'
                    ? 'bg-[#003366] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'bn' ? 'ভাড়া' : 'Rented'}
              </button>
              <button
                onClick={() => onSelectBuilding('freeOfCharge')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedBuilding === 'freeOfCharge'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'bn' ? 'বিনামূল্যে' : 'Free'}
              </button>
            </div>

            {/* Search within table */}
            <div className="relative flex items-center bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder={language === 'bn' ? 'জেলা খুঁজুন...' : 'Search district...'}
                className="text-xs text-slate-800 bg-transparent outline-hidden w-24 sm:w-32 placeholder:text-slate-400 font-medium"
              />
              {tableSearch && (
                <button onClick={() => setTableSearch('')} className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card Body - Responsive Scrollable Table */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="border border-slate-200/90 rounded-xl overflow-hidden max-h-[340px] overflow-y-auto shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 text-slate-600 font-bold z-10">
                <tr>
                  <th
                    onClick={() => handleSort('name')}
                    className={`py-3 px-3 cursor-pointer transition-all duration-150 select-none ${
                      sortField === 'name'
                        ? 'bg-blue-50 text-blue-900 font-bold'
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] uppercase tracking-wider">{language === 'bn' ? 'জেলা' : 'District'}</span>
                      <ArrowUpDown className={`w-3 h-3 ${sortField === 'name' ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('libraries')}
                    className={`py-3 px-3 text-right cursor-pointer transition-all duration-150 select-none ${
                      sortField === 'libraries'
                        ? 'bg-blue-50 text-blue-900 font-bold'
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-[11px] uppercase tracking-wider">
                        {selectedBuilding
                          ? `${buildingConfig[selectedBuilding]?.shortName} Libs`
                          : language === 'bn'
                          ? 'গ্রন্থাগার'
                          : 'Libraries'}
                      </span>
                      <ArrowUpDown className={`w-3 h-3 ${sortField === 'libraries' ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('books')}
                    className={`py-3 px-3 text-right cursor-pointer transition-all duration-150 select-none ${
                      sortField === 'books'
                        ? 'bg-blue-50 text-blue-900 font-bold'
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-[11px] uppercase tracking-wider">
                        {selectedBuilding
                          ? `${buildingConfig[selectedBuilding]?.shortName} Books`
                          : language === 'bn'
                          ? 'বই (লক্ষ)'
                          : 'Books (L)'}
                      </span>
                      <ArrowUpDown className={`w-3 h-3 ${sortField === 'books' ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('usage')}
                    className={`py-3 px-3 text-right cursor-pointer transition-all duration-150 select-none ${
                      sortField === 'usage'
                        ? 'bg-blue-50 text-blue-900 font-bold'
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-[11px] uppercase tracking-wider">
                        {selectedBuilding
                          ? `${buildingConfig[selectedBuilding]?.shortName} Usage`
                          : language === 'bn'
                          ? 'ব্যবহার (লক্ষ)'
                          : 'Usage (L)'}
                      </span>
                      <ArrowUpDown className={`w-3 h-3 ${sortField === 'usage' ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('share')}
                    className={`py-3 px-2 text-center cursor-pointer transition-all duration-150 select-none ${
                      sortField === 'share'
                        ? 'bg-blue-50 text-blue-900 font-bold'
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-[11px] uppercase tracking-wider">{selectedBuilding ? 'Share' : 'Building Mix'}</span>
                      <ArrowUpDown className={`w-3 h-3 ${sortField === 'share' ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                  </th>

                  <th className="py-3 px-2 text-center text-[11px] uppercase tracking-wider text-slate-600 font-bold">
                    {language === 'bn' ? 'বিবরণ' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedDistricts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                      No matching districts found for the selected building ownership type.
                    </td>
                  </tr>
                ) : (
                  displayedDistricts.map((district, idx) => {
                    const isSelected = selectedDistrict === district.id;
                    const bCount = selectedBuilding ? district.buildingType[selectedBuilding] : district.totalLibraries;
                    const bRatio = district.totalLibraries > 0 ? bCount / district.totalLibraries : 0;
                    const bBooks = selectedBuilding ? district.booksInLac * bRatio : district.booksInLac;
                    const bUsage = selectedBuilding ? district.usageInLac * bRatio : district.usageInLac;
                    const sharePct = (bRatio * 100).toFixed(1);

                    // Ownership percentages for stacked bar
                    const ownedPct = district.totalLibraries > 0 ? (district.buildingType.owned / district.totalLibraries) * 100 : 0;
                    const rentedPct = district.totalLibraries > 0 ? (district.buildingType.rented / district.totalLibraries) * 100 : 0;
                    const freePct = district.totalLibraries > 0 ? (district.buildingType.freeOfCharge / district.totalLibraries) * 100 : 0;

                    return (
                      <tr
                        key={district.id}
                        onClick={() => onSelectDistrict(isSelected ? 'all' : district.id)}
                        className={`transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/90 font-bold border-l-4 border-blue-600 shadow-2xs'
                            : idx % 2 === 0
                            ? 'bg-white hover:bg-slate-50/80'
                            : 'bg-slate-50/30 hover:bg-slate-50/80'
                        }`}
                      >
                        {/* District Column */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400 w-4 shrink-0">
                              #{idx + 1}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-900 font-bold truncate">{district.name}</span>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />}
                              </div>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {district.bengaliName} • {district.division}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Libraries Count Column */}
                        <td className="py-2.5 px-3 text-right font-medium text-slate-800 font-mono">
                          {selectedBuilding ? (
                            <div>
                              <span className="font-black text-slate-900">{bCount}</span>
                              <span className="text-[10px] text-slate-400 block font-sans">of {district.totalLibraries}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                              {district.totalLibraries}
                            </span>
                          )}
                        </td>

                        {/* Books Collection Column */}
                        <td className="py-2.5 px-3 text-right font-mono">
                          <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            {bBooks.toFixed(2)} L
                          </span>
                        </td>

                        {/* Book Usage Column */}
                        <td className="py-2.5 px-3 text-right font-mono">
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            {bUsage.toFixed(2)} L
                          </span>
                        </td>

                        {/* Building Share / Stacked Mix Column */}
                        <td className="py-2.5 px-2 text-center">
                          {selectedBuilding ? (
                            <div className="flex flex-col items-center gap-1">
                              <span className="px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-blue-100 text-blue-900 font-mono">
                                {sharePct}%
                              </span>
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{
                                    width: `${sharePct}%`,
                                    backgroundColor: buildingConfig[selectedBuilding]?.color,
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              {/* 3-segment stacked micro-bar */}
                              <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden flex" title={`Own: ${district.buildingType.owned}, Rented: ${district.buildingType.rented}, Free: ${district.buildingType.freeOfCharge}`}>
                                <div style={{ width: `${ownedPct}%` }} className="h-full bg-sky-500" />
                                <div style={{ width: `${rentedPct}%` }} className="h-full bg-[#003366]" />
                                <div style={{ width: `${freePct}%` }} className="h-full bg-emerald-500" />
                              </div>
                              <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500">
                                <span className="text-sky-700 font-bold">{district.buildingType.owned}O</span>
                                <span>/</span>
                                <span className="text-blue-950 font-bold">{district.buildingType.rented}R</span>
                                <span>/</span>
                                <span className="text-emerald-700 font-bold">{district.buildingType.freeOfCharge}F</span>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Action Column */}
                        <td className="py-2.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onOpenDistrictModal(district)}
                            title="View District Profile"
                            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-700 hover:text-blue-900 border border-transparent hover:border-blue-200 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block">
                {selectedBuilding ? 'Districts Represented' : 'Districts Listed'}
              </span>
              <span className="font-bold text-slate-900 font-mono">
                {summaryMetrics.districtsCount} of 23
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block">
                {selectedBuilding ? `${buildingConfig[selectedBuilding]?.shortName} Libraries` : 'Total Libraries'}
              </span>
              <span className="font-bold text-slate-900 font-mono">
                {summaryMetrics.totalLibraries.toLocaleString('en-IN')} units
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block">
                {selectedBuilding ? `${buildingConfig[selectedBuilding]?.shortName} Books` : 'Total Books Collection'}
              </span>
              <span className="font-bold text-[#003366] font-mono">
                {summaryMetrics.totalBooks.toFixed(2)} Lac
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block">
                {selectedBuilding ? `${buildingConfig[selectedBuilding]?.shortName} Usage` : 'Annual Usage Recorded'}
              </span>
              <span className="font-bold text-emerald-700 font-mono">
                {summaryMetrics.totalUsage.toFixed(2)} Lac
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
