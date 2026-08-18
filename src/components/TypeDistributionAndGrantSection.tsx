import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  IndianRupee,
  ChevronUp,
  ChevronDown,
  CornerDownRight,
  ChevronsDown,
  Plus,
  Minus,
  CheckCircle2,
  Filter,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { westBengalDistricts } from '../data/mockData';
import { DistrictData, Language, GradeFilter } from '../types';

interface TypeDistributionAndGrantSectionProps {
  language: Language;
  onSelectDistrict: (districtId: string) => void;
  selectedDistrict: string;
  selectedGrade: GradeFilter;
  onSelectGrade?: (grade: GradeFilter) => void;
  filteredDistricts: DistrictData[];
}

interface HierarchySubItem {
  id: string;
  name: string;
  districtId?: string;
  count: number;
}

interface TypeItem {
  id: string;
  name: string;
  bengaliName: string;
  totalCount: number;
  subItems: HierarchySubItem[];
}

export const TypeDistributionAndGrantSection: React.FC<TypeDistributionAndGrantSectionProps> = ({
  language,
  onSelectDistrict,
  selectedDistrict,
  selectedGrade,
  onSelectGrade,
  filteredDistricts,
}) => {
  // Expansion state for each category in the matrix table (collapsed initially by default)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const [hoveredGradeKey, setHoveredGradeKey] = useState<GradeFilter>(null);

  // Dynamic base districts
  const baseDistricts = useMemo(() => {
    return filteredDistricts.length > 0 ? filteredDistricts : westBengalDistricts;
  }, [filteredDistricts]);

  // Calculate dynamic type-wise counts taking into account both district filters and selectedGrade
  const totalFilteredLibraries = useMemo(() => {
    return baseDistricts.reduce((acc, d) => {
      if (selectedGrade) {
        if (selectedGrade === 'noClass') {
          return acc + (d.grades?.noClass || 0);
        }
        return acc + (d.grades?.[selectedGrade] || 0);
      }
      return acc + d.totalLibraries;
    }, 0);
  }, [baseDistricts, selectedGrade]);

  const typeCategories: TypeItem[] = useMemo(() => {
    // If a single West Bengal district is selected
    if (selectedDistrict !== 'all') {
      const activeDistrict = westBengalDistricts.find((d) => d.id === selectedDistrict);
      if (activeDistrict) {
        let total = activeDistrict.totalLibraries;
        if (selectedGrade) {
          total = selectedGrade === 'noClass' ? (activeDistrict.grades?.noClass || 0) : (activeDistrict.grades?.[selectedGrade] || 0);
        }
        total = Math.max(1, total);

        const assocCount = Math.max(0, Math.round(total * 0.015));
        const vpCount = Math.max(1, Math.round(total * 0.055));
        const subCenterCount = Math.max(0, Math.round(total * 0.02));
        const researchCount = activeDistrict.id === 'kolkata' ? 5 : activeDistrict.id === 'purba-bardhaman' || activeDistrict.id === 'birbhum' ? 2 : 1;
        const publicCount = Math.max(1, total - (assocCount + vpCount + subCenterCount + researchCount));

        return [
          {
            id: 'assoc',
            name: 'Government-Accepted Library Association',
            bengaliName: 'সরকারি অনুদানপ্রাপ্ত লাইব্রেরি সমিতি',
            totalCount: assocCount,
            subItems: [
              {
                id: `${activeDistrict.id}-assoc-1`,
                districtId: activeDistrict.id,
                name: `${activeDistrict.name} District Library Association`,
                count: Math.max(1, assocCount),
              },
            ],
          },
          {
            id: 'public-lib',
            name: 'Government-Accepted Public Library',
            bengaliName: 'সরকারি অনুদানপ্রাপ্ত পাবলিক লাইব্রেরি',
            totalCount: publicCount,
            subItems: [
              {
                id: `${activeDistrict.id}-town`,
                districtId: activeDistrict.id,
                name: `${activeDistrict.name} Sub-Divisional & Town Units`,
                count: Math.round(publicCount * 0.65),
              },
              {
                id: `${activeDistrict.id}-rural`,
                districtId: activeDistrict.id,
                name: `${activeDistrict.name} Rural Primary Units`,
                count: Math.max(1, Math.round(publicCount * 0.35)),
              },
            ],
          },
          {
            id: 'village-panchayat',
            name: 'Government-Accepted Village Panchayat Library',
            bengaliName: 'সরকারি অনুদানপ্রাপ্ত গ্রাম পঞ্চায়েত লাইব্রেরি',
            totalCount: vpCount,
            subItems: [
              {
                id: `${activeDistrict.id}-vp-1`,
                districtId: activeDistrict.id,
                name: `${activeDistrict.name} Gram Panchayat Cluster A`,
                count: Math.ceil(vpCount / 2),
              },
              {
                id: `${activeDistrict.id}-vp-2`,
                districtId: activeDistrict.id,
                name: `${activeDistrict.name} Gram Panchayat Cluster B`,
                count: Math.floor(vpCount / 2),
              },
            ],
          },
          {
            id: 'sub-center',
            name: 'Library Sub-Center',
            bengaliName: 'লাইব্রেরি উপ-কেন্দ্র',
            totalCount: subCenterCount,
            subItems: [
              {
                id: `${activeDistrict.id}-sub-1`,
                districtId: activeDistrict.id,
                name: `${activeDistrict.name} Reading Sub-Center`,
                count: Math.max(1, subCenterCount),
              },
            ],
          },
          {
            id: 'research',
            name: 'Research Library',
            bengaliName: 'গবেষণা লাইব্রেরি',
            totalCount: researchCount,
            subItems: [
              {
                id: `${activeDistrict.id}-res-1`,
                districtId: activeDistrict.id,
                name: `${activeDistrict.name} Heritage Archives & Reference Unit`,
                count: researchCount,
              },
            ],
          },
        ];
      }
    }

    // Dynamic aggregation across active West Bengal filtered districts (scaled with selectedGrade if active)
    const vpBreakdown: HierarchySubItem[] = baseDistricts
      .map((d) => {
        const dCount = selectedGrade
          ? selectedGrade === 'noClass' ? (d.grades?.noClass || 0) : (d.grades?.[selectedGrade] || 0)
          : d.totalLibraries;
        const count = Math.max(1, Math.round(dCount * 0.045));
        return {
          id: `${d.id}-vp`,
          districtId: d.id,
          name: d.name,
          count,
        };
      })
      .sort((a, b) => b.count - a.count);

    const vpTotal = vpBreakdown.reduce((acc, item) => acc + item.count, 0);

    const assocBreakdown: HierarchySubItem[] = baseDistricts
      .slice(0, 10)
      .map((d) => ({
        id: `${d.id}-assoc`,
        districtId: d.id,
        name: `${d.name} Library Association`,
        count: d.id === 'kolkata' ? 5 : d.id === 'north-24-parganas' || d.id === 'howrah' ? 3 : 2,
      }))
      .sort((a, b) => b.count - a.count);

    const assocTotal = assocBreakdown.reduce((acc, item) => acc + item.count, 0);

    const subBreakdown: HierarchySubItem[] = [
      { id: 'kolkata-sub', districtId: 'kolkata', name: 'Kolkata City Central Sub-Center', count: 18 },
      { id: 'siliguri-sub', districtId: 'darjeeling', name: 'Siliguri North Bengal Sub-Center', count: 12 },
      { id: 'durgapur-sub', districtId: 'paschim-bardhaman', name: 'Asansol-Durgapur Sub-Center', count: 10 },
      { id: 'kharagpur-sub', districtId: 'paschim-medinipur', name: 'Kharagpur Regional Sub-Center', count: 8 },
      { id: 'baharampur-sub', districtId: 'murshidabad', name: 'Baharampur Heritage Sub-Center', count: 6 },
      { id: 'malda-sub', districtId: 'malda', name: 'Malda Town Sub-Center', count: 5 },
    ].filter((sub) => !sub.districtId || baseDistricts.some((d) => d.id === sub.districtId));

    const subTotal = subBreakdown.reduce((acc, item) => acc + item.count, 0);

    const resBreakdown: HierarchySubItem[] = [
      { id: 'nat-lib', districtId: 'kolkata', name: 'National Library of India (Kolkata Archives)', count: 5 },
      { id: 'asiatic-soc', districtId: 'kolkata', name: 'The Asiatic Society Research Section', count: 3 },
      { id: 'bangiya-sahitya', districtId: 'kolkata', name: 'Bangiya Sahitya Parishad Archives', count: 2 },
      { id: 'visva-bharati', districtId: 'birbhum', name: 'Visva-Bharati Rabindra Bhavana Archives', count: 2 },
      { id: 'carey-lib', districtId: 'hooghly', name: 'Carey Library Serampore College', count: 1 },
      { id: 'state-central', districtId: 'kolkata', name: 'State Central Library Rare Book Division', count: 1 },
    ].filter((res) => !res.districtId || baseDistricts.some((d) => d.id === res.districtId));

    const resTotal = resBreakdown.reduce((acc, item) => acc + item.count, 0);

    const remainder = Math.max(1, totalFilteredLibraries - (assocTotal + vpTotal + subTotal + resTotal));
    const pubBreakdown: HierarchySubItem[] = baseDistricts
      .map((d) => {
        const share = d.totalLibraries / (baseDistricts.reduce((a, b) => a + b.totalLibraries, 0) || 1);
        return {
          id: `${d.id}-pub`,
          districtId: d.id,
          name: d.name,
          count: Math.round(remainder * share),
        };
      })
      .sort((a, b) => b.count - a.count);

    const pubTotal = pubBreakdown.reduce((acc, item) => acc + item.count, 0);

    return [
      {
        id: 'assoc',
        name: 'Government-Accepted Library Association',
        bengaliName: 'সরকারি অনুদানপ্রাপ্ত লাইব্রেরি সমিতি',
        totalCount: assocTotal,
        subItems: assocBreakdown,
      },
      {
        id: 'public-lib',
        name: 'Government-Accepted Public Library',
        bengaliName: 'সরকারি অনুদানপ্রাপ্ত পাবলিক লাইব্রেরি',
        totalCount: pubTotal,
        subItems: pubBreakdown,
      },
      {
        id: 'village-panchayat',
        name: 'Government-Accepted Village Panchayat Library',
        bengaliName: 'সরকারি অনুদানপ্রাপ্ত গ্রাম পঞ্চায়েত লাইব্রেরি',
        totalCount: vpTotal,
        subItems: vpBreakdown,
      },
      {
        id: 'sub-center',
        name: 'Library Sub-Center',
        bengaliName: 'লাইব্রেরি উপ-কেন্দ্র',
        totalCount: subTotal,
        subItems: subBreakdown,
      },
      {
        id: 'research',
        name: 'Research Library',
        bengaliName: 'গবেষণা লাইব্রেরি',
        totalCount: resTotal,
        subItems: resBreakdown,
      },
    ];
  }, [selectedDistrict, baseDistricts, totalFilteredLibraries, selectedGrade]);

  const totalLibrariesCount = useMemo(() => {
    return typeCategories.reduce((acc, cat) => acc + cat.totalCount, 0);
  }, [typeCategories]);

  // Toggle individual category expansion
  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Expand all categories
  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    typeCategories.forEach((c) => {
      allExpanded[c.id] = true;
    });
    setExpandedCategories(allExpanded);
  };

  // Collapse all categories
  const collapseAll = () => {
    setExpandedCategories({});
  };

  // Grant data calculation
  const totalInst1 = baseDistricts.reduce((acc, d) => acc + d.grantsLac.installment1, 0);
  const totalInst2 = baseDistricts.reduce((acc, d) => acc + d.grantsLac.installment2, 0);

  const grantBarsData = useMemo(() => {
    return [
      {
        gradeKey: 'B' as const,
        label: language === 'bn' ? 'গ্রেড B' : 'Grade B',
        fullName: 'Grade B (Town / Sub-Divisional)',
        inst1: Number((totalInst1 * 0.42).toFixed(2)),
        inst2: Number((totalInst2 * 0.42).toFixed(2)),
      },
      {
        gradeKey: 'C' as const,
        label: language === 'bn' ? 'গ্রেড C' : 'Grade C',
        fullName: 'Grade C (Rural Central)',
        inst1: Number((totalInst1 * 0.36).toFixed(2)),
        inst2: Number((totalInst2 * 0.36).toFixed(2)),
      },
      {
        gradeKey: 'D' as const,
        label: language === 'bn' ? 'গ্রেড D' : 'Grade D',
        fullName: 'Grade D (Rural / Primary)',
        inst1: Number((totalInst1 * 0.16).toFixed(2)),
        inst2: Number((totalInst2 * 0.16).toFixed(2)),
      },
      {
        gradeKey: 'A' as const,
        label: language === 'bn' ? 'গ্রেড A' : 'Grade A',
        fullName: 'Grade A (District Central)',
        inst1: Number((totalInst1 * 0.05).toFixed(2)),
        inst2: Number((totalInst2 * 0.05).toFixed(2)),
      },
      {
        gradeKey: 'noClass' as const,
        label: language === 'bn' ? 'শ্রেণীহীন' : 'No Class',
        fullName: language === 'bn' ? 'শ্রেণীবিহীন পাবলিক লাইব্রেরি' : 'Libraries with No Class (Unassigned)',
        inst1: Number((totalInst1 * 0.01).toFixed(2)),
        inst2: Number((totalInst2 * 0.01).toFixed(2)),
      },
    ];
  }, [totalInst1, totalInst2, language]);

  const maxGrantValue = useMemo(() => {
    const maxRow = Math.max(...grantBarsData.map((d) => d.inst1 + d.inst2), 10);
    return maxRow * 1.1;
  }, [grantBarsData]);

  // Handle clicking a grant row to cross-filter by grade
  const handleGrantRowClick = (gradeKey: GradeFilter) => {
    if (!onSelectGrade) return;
    if (selectedGrade === gradeKey) {
      onSelectGrade(null);
    } else {
      onSelectGrade(gradeKey);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT PANEL: Type-wise Distribution of Public Libraries */}
      <div
        id="type-wise-card"
        className="lg:col-span-6 rounded-2xl bg-white border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-200"
      >
        {/* Clean Header */}
        <div className="px-5 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                  {language === 'bn' ? 'টাইপ অনুযায়ী পাবলিক লাইব্রেরি বণ্টন' : 'Type-wise Distribution of Public Libraries'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  <Sparkles className="w-2.5 h-2.5" />
                  Synced
                </span>
              </div>
            </div>
            {selectedGrade && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-950 font-bold hidden sm:inline-flex items-center gap-1 shrink-0 border border-blue-200">
                <Filter className="w-3 h-3 text-blue-700" />
                Grade {selectedGrade === 'noClass' ? 'No Class' : selectedGrade}
              </span>
            )}
            {selectedDistrict !== 'all' && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-950 font-bold hidden md:inline-block shrink-0 border border-amber-200">
                {westBengalDistricts.find((d) => d.id === selectedDistrict)?.name}
              </span>
            )}
          </div>

          {/* Drill-down Hierarchy Actions */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-slate-600 shrink-0">
            <button
              onClick={collapseAll}
              title="Collapse All"
              className="px-2 py-1 hover:text-blue-900 hover:bg-white rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-transparent hover:border-slate-200 shadow-2xs"
            >
              <ChevronUp className="w-3 h-3" />
              <span className="hidden sm:inline">Collapse</span>
            </button>
            <button
              onClick={expandAll}
              title="Expand All"
              className="px-2 py-1 hover:text-blue-900 hover:bg-white rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-transparent hover:border-slate-200 shadow-2xs"
            >
              <ChevronDown className="w-3 h-3" />
              <span className="hidden sm:inline">Expand</span>
            </button>
          </div>
        </div>

        {/* Modern Table Container */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
          <div className="border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full border-collapse text-xs min-w-[340px]">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600">
                  <th className="py-3 px-3.5 text-left font-bold text-[11px] uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Library Type & Category</span>
                    </div>
                  </th>
                  <th className="py-3 px-3.5 sm:px-4 text-right font-bold text-[11px] uppercase tracking-wider w-40 sm:w-52 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Distribution & Count</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {typeCategories.map((category) => {
                  const isExpanded = !!expandedCategories[category.id];
                  const sharePct = totalLibrariesCount > 0
                    ? ((category.totalCount / totalLibrariesCount) * 100).toFixed(1)
                    : '0.0';

                  // Category visual style mapping
                  const categoryMeta: Record<string, { bg: string; text: string; bar: string; border: string }> = {
                    assoc: { bg: 'bg-indigo-50', text: 'text-indigo-700', bar: 'bg-indigo-500', border: 'border-indigo-200' },
                    'public-lib': { bg: 'bg-sky-50', text: 'text-sky-700', bar: 'bg-sky-500', border: 'border-sky-200' },
                    'village-panchayat': { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500', border: 'border-emerald-200' },
                    'sub-center': { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500', border: 'border-amber-200' },
                    research: { bg: 'bg-purple-50', text: 'text-purple-700', bar: 'bg-purple-500', border: 'border-purple-200' },
                  };

                  const meta = categoryMeta[category.id] || {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700',
                    bar: 'bg-blue-500',
                    border: 'border-blue-200',
                  };

                  return (
                    <React.Fragment key={category.id}>
                      {/* Main Category Row */}
                      <tr
                        className={`transition-all duration-150 cursor-pointer group select-none ${
                          isExpanded ? 'bg-slate-50/70 font-semibold' : 'bg-white hover:bg-slate-50/50'
                        }`}
                        onClick={() => toggleCategory(category.id)}
                      >
                        <td className="py-3 px-3.5 text-slate-800">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Expand Pill */}
                            <span
                              className={`w-5 h-5 flex items-center justify-center rounded-md text-[10px] shrink-0 font-bold transition-all border ${
                                isExpanded
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 group-hover:border-blue-300 group-hover:text-blue-700'
                              }`}
                              title={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              {isExpanded ? (
                                <Minus className="w-3 h-3 stroke-[2.5]" />
                              ) : (
                                <Plus className="w-3 h-3 stroke-[2.5]" />
                              )}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate group-hover:text-blue-900 transition-colors" title={category.name}>
                                {language === 'bn' ? category.bengaliName : category.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium block">
                                {category.subItems.length} {category.subItems.length === 1 ? 'cluster' : 'clusters / sub-units'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3.5 sm:px-4 text-right whitespace-nowrap">
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono border ${meta.bg} ${meta.text} ${meta.border}`}>
                                {sharePct}%
                              </span>
                              <span className="font-black text-slate-900 font-mono text-[13px]">
                                {category.totalCount.toLocaleString('en-IN')}
                              </span>
                            </div>
                            {/* Micro Progress Bar */}
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${meta.bar}`}
                                style={{ width: `${Math.min(100, Math.max(3, parseFloat(sharePct)))}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Sub-items (District Breakdown) with Modern Hierarchy Appearance */}
                      {isExpanded &&
                        category.subItems.map((sub, idx) => {
                          const isSubSelected = sub.districtId && selectedDistrict === sub.districtId;
                          const subPct = category.totalCount > 0
                            ? ((sub.count / category.totalCount) * 100).toFixed(0)
                            : '0';

                          return (
                            <tr
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (sub.districtId) {
                                  onSelectDistrict(selectedDistrict === sub.districtId ? 'all' : sub.districtId);
                                }
                              }}
                              className={`transition-all duration-150 cursor-pointer ${
                                isSubSelected
                                  ? 'bg-blue-50/90 text-blue-950 font-bold border-l-4 border-blue-600'
                                  : idx % 2 === 0
                                  ? 'bg-slate-50/40 hover:bg-slate-100/70 text-slate-700'
                                  : 'bg-white hover:bg-slate-100/70 text-slate-700'
                              }`}
                              title={sub.districtId ? `Click to filter dashboard by ${sub.name}` : undefined}
                            >
                              <td className="py-2 pl-9 sm:pl-10 pr-3.5 text-[11px]">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-slate-300 font-mono select-none">└─</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <span className="truncate text-slate-800 font-medium">{sub.name}</span>
                                  {isSubSelected && (
                                    <span className="text-[9px] bg-blue-100 text-blue-900 border border-blue-200 px-1.5 py-0.5 rounded font-bold ml-1">
                                      Filtered
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-2 px-3.5 sm:px-4 text-right text-[11px] font-mono whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-[10px] text-slate-400 font-sans">{subPct}% of type</span>
                                  <span className="font-bold text-slate-800">{sub.count.toLocaleString('en-IN')}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })}

                {/* Elevated Total Row */}
                <tr className="bg-slate-50 font-bold border-t-2 border-slate-200 text-slate-900">
                  <td className="py-3 px-3.5 font-black text-xs text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>Total Public Library Network {selectedGrade ? `(Grade ${selectedGrade === 'noClass' ? 'No Class' : selectedGrade})` : ''}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5 sm:px-4 text-right font-black text-xs text-slate-900 whitespace-nowrap font-mono text-[13px]">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                        100%
                      </span>
                      <span>{totalLibrariesCount.toLocaleString('en-IN')}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footnote Bar */}
          <div className="pt-2.5 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-1">
            <span className="truncate">Click [+] to inspect districts. Matrix dynamically responds to all filters.</span>
            {(selectedDistrict !== 'all' || selectedGrade !== null) && (
              <button
                onClick={() => {
                  onSelectDistrict('all');
                  if (onSelectGrade) onSelectGrade(null);
                }}
                className="text-blue-700 hover:text-blue-950 font-bold underline cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Public Library Grant (₹ Lac) with Gradient Style Bars */}
      <div
        id="grant-disbursal-card"
        className="lg:col-span-6 rounded-2xl bg-white border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-200"
      >
        {/* Clean Header */}
        <div className="px-5 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center shrink-0">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                  {language === 'bn' ? 'পাবলিক লাইব্রেরি অনুদান (₹ লক্ষ)' : 'Public Library Grant Disbursal (₹ Lac)'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <Sparkles className="w-2.5 h-2.5" />
                  Cross-Filter
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-[11px] font-bold text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0 font-mono">
              Total: ₹ {(totalInst1 + totalInst2).toFixed(1)} Lac
            </div>
          </div>
        </div>

        {/* Horizontal Stacked Bar Chart with Gradient Styles & Cross-Filtering */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div className="space-y-3.5 sm:space-y-4 py-1">
            {grantBarsData.map((item) => {
              const rowTotal = item.inst1 + item.inst2;
              const inst1Pct = Math.min(100, (item.inst1 / maxGrantValue) * 100);
              const inst2Pct = Math.min(100, (item.inst2 / maxGrantValue) * 100);

              // CROSS-FILTERING LOGIC:
              // When a grade is selected, the chosen grade stays vibrant with lush gradients.
              // Other grades get dimmed to light grey!
              const isSelected = selectedGrade === item.gradeKey;
              const isHovered = hoveredGradeKey === item.gradeKey;
              const hasSelection = selectedGrade !== null;
              const isDimmed = hasSelection && !isSelected;

              return (
                <motion.div
                  key={item.gradeKey}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleGrantRowClick(item.gradeKey)}
                  onMouseEnter={() => setHoveredGradeKey(item.gradeKey)}
                  onMouseLeave={() => setHoveredGradeKey(null)}
                  className={`flex items-center gap-2.5 sm:gap-3 p-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/90 ring-2 ring-blue-600/40 shadow-xs'
                      : isHovered
                      ? 'bg-slate-50'
                      : isDimmed
                      ? 'opacity-40 hover:opacity-75'
                      : 'hover:bg-slate-50/70'
                  }`}
                  title={`${item.fullName}: Click to filter by Grade ${item.label}`}
                >
                  {/* Category Label on Left */}
                  <div
                    className={`w-24 sm:w-28 text-right text-[11px] sm:text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'text-blue-950 font-black'
                        : isDimmed
                        ? 'text-slate-400 font-medium'
                        : 'text-slate-700'
                    }`}
                  >
                    <span className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                      {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />}
                      <span className="truncate" title={item.fullName}>{item.label}</span>
                    </span>
                  </div>

                  {/* Horizontal Stacked Bars with Enhanced Multi-Stop Gradients & Spring Animation */}
                  <div className="flex-1 flex items-center h-8 sm:h-9 bg-slate-100/90 border border-slate-200/90 relative rounded-xl overflow-hidden group shadow-2xs">
                    {/* Stack 1: Installment One with Vibrant Sky to Indigo Gradient */}
                    <div
                      className={`h-full flex items-center justify-center text-[10px] sm:text-[11px] font-black text-white relative shadow-xs ${
                        isDimmed
                          ? 'bg-slate-300'
                          : 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_2px_4px_rgba(37,99,235,0.25)]'
                      }`}
                      style={{
                        width: `${inst1Pct}%`,
                        transition: 'width 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {inst1Pct > 18 && (
                        <span className="truncate px-1 select-none font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                          ₹ {item.inst1.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                        </span>
                      )}
                    </div>

                    {/* Stack 2: Installment Two with Indigo to Royal Midnight Gradient */}
                    <div
                      className={`h-full flex items-center justify-center text-[10px] sm:text-[11px] font-black text-white relative shadow-xs ${
                        isDimmed
                          ? 'bg-slate-400'
                          : 'bg-gradient-to-r from-indigo-600 via-blue-800 to-[#002244] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_2px_4px_rgba(0,34,68,0.3)]'
                      }`}
                      style={{
                        width: `${inst2Pct}%`,
                        transition: 'width 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {inst2Pct > 18 && (
                        <span className="truncate px-1 select-none font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                          ₹ {item.inst2.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                        </span>
                      )}
                    </div>

                    {/* Label fallback for narrow bars */}
                    {inst1Pct <= 18 && (
                      <span
                        className={`text-[10px] pl-2 font-black shrink-0 font-mono ${
                          isDimmed ? 'text-slate-400' : 'text-slate-700'
                        }`}
                      >
                        ₹ {rowTotal.toFixed(1)} L
                      </span>
                    )}

                    {/* Interactive Tooltip Card on Hover */}
                    <div className="absolute left-1/2 -top-10 -translate-x-1/2 hidden group-hover:flex items-center gap-2 bg-slate-900/95 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-xl shadow-2xl pointer-events-none z-30 whitespace-nowrap border border-slate-700 animate-in fade-in zoom-in-95 duration-150">
                      <span className="font-bold">{item.fullName}:</span>
                      <span className="text-sky-300 font-mono">Inst 1: ₹{item.inst1.toFixed(2)} L</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-blue-300 font-mono">Inst 2: ₹{item.inst2.toFixed(2)} L</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Legend with Gradient Swatches */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-r from-sky-400 to-blue-600 shrink-0 shadow-2xs" />
                <span className="font-bold text-slate-800 text-[11px]">Installment One (Grant A)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-r from-blue-700 to-[#002244] shrink-0 shadow-2xs" />
                <span className="font-bold text-slate-800 text-[11px]">Installment Two (Grant B)</span>
              </div>
            </div>

            {selectedGrade && onSelectGrade && (
              <button
                onClick={() => onSelectGrade(null)}
                className="text-[11px] text-blue-700 hover:text-blue-950 font-bold underline cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Show All Grades
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
