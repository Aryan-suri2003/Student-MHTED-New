"use client";

import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowRight, Filter, RotateCcw, CheckCircle2, MapPin, PieChart, Layers, IndianRupee, TrendingUp, Building2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FilterBar } from './FilterBar';
import { KpiSection } from './KpiSection';
import { DistrictMapAndGradeSection } from './DistrictMapAndGradeSection';
import { TypeDistributionAndGrantSection } from './TypeDistributionAndGrantSection';
import { GrowthAnalysisSection } from './GrowthAnalysisSection';
import { BuildingAndBookUsageSection } from './BuildingAndBookUsageSection';
import { OverviewDashboard } from './OverviewDashboard';
import { StudentDashboard } from './StudentDashboard';
import { UniversityDashboard } from './UniversityDashboard';
import { DistrictDetailModal } from './DistrictDetailModal';
import { financialYears, westBengalDistricts } from '../data/mockData';
import { ActiveTab, DistrictData, Language, GradeFilter, BuildingFilter } from '../types';

export default function LibraryDashboardClient() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('public-library');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedYear, setSelectedYear] = useState<string>('2025-2026');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<GradeFilter>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingFilter>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalDistrict, setModalDistrict] = useState<DistrictData | null>(null);

  const currentYearData = useMemo(() => {
    return financialYears.find((y) => y.year === selectedYear) || financialYears[0];
  }, [selectedYear]);

  const yearScaledDistricts = useMemo(() => {
    const mult = currentYearData.multiplier;
    return westBengalDistricts.map((d) => ({
      ...d,
      totalLibraries: Math.round(d.totalLibraries * (selectedYear === '2025-2026' ? 1 : mult)),
      totalMembers: Math.round(d.totalMembers * mult),
      totalFundsCr: Number((d.totalFundsCr * mult).toFixed(2)),
      studentEnrollment: Math.round(d.studentEnrollment * mult),
      collegesCount: Math.round(d.collegesCount * mult),
      scholarshipsCr: Number((d.scholarshipsCr * mult).toFixed(2)),
      booksInLac: Number((d.booksInLac * mult).toFixed(2)),
      usageInLac: Number((d.usageInLac * mult).toFixed(2)),
      grantsLac: {
        installment1: Number((d.grantsLac.installment1 * mult).toFixed(2)),
        installment2: Number((d.grantsLac.installment2 * mult).toFixed(2)),
      },
    }));
  }, [currentYearData, selectedYear]);

  const filteredDistricts = useMemo(() => {
    return yearScaledDistricts.filter((d) => {
      if (selectedDivision !== 'all' && d.division !== selectedDivision) {
        return false;
      }
      if (selectedDistrict !== 'all' && d.id !== selectedDistrict) {
        return false;
      }
      if (selectedGrade) {
        if (selectedGrade === 'noClass' && d.grades.noClass <= 0) return false;
        if (selectedGrade !== 'noClass' && d.grades[selectedGrade] <= 0) return false;
      }
      if (selectedBuilding) {
        if (d.buildingType[selectedBuilding] <= 0) return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchName = d.name.toLowerCase().includes(q) || d.bengaliName.toLowerCase().includes(q);
        const matchDiv = d.division.toLowerCase().includes(q);
        if (!matchName && !matchDiv) return false;
      }
      return true;
    });
  }, [yearScaledDistricts, selectedDivision, selectedDistrict, selectedGrade, selectedBuilding, searchQuery]);

  const totalLibraries = useMemo(() => {
    return filteredDistricts.reduce((acc, d) => acc + d.totalLibraries, 0);
  }, [filteredDistricts]);

  const totalMembers = useMemo(() => {
    return filteredDistricts.reduce((acc, d) => acc + d.totalMembers, 0);
  }, [filteredDistricts]);

  const totalFundsCr = useMemo(() => {
    return Number(filteredDistricts.reduce((acc, d) => acc + d.totalFundsCr, 0).toFixed(2));
  }, [filteredDistricts]);

  const handleReset = () => {
    setSelectedYear('2025-2026');
    setSelectedDivision('all');
    setSelectedDistrict('all');
    setSelectedGrade(null);
    setSelectedBuilding(null);
    setSearchQuery('');
  };

  const handleExportCsv = () => {
    const headers = [
      'District ID',
      'District Name',
      'Division',
      'Total Libraries',
      'Total Members',
      'Funds (Cr)',
      'Books (Lac)',
      'Usage (Lac)',
      'Growth (%)',
      'Students',
      'Colleges',
    ];
    const rows = filteredDistricts.map((d) => [
      d.id,
      `"${d.name}"`,
      `"${d.division}"`,
      d.totalLibraries,
      d.totalMembers,
      d.totalFundsCr,
      d.booksInLac,
      d.usageInLac,
      d.growthPct,
      d.studentEnrollment,
      d.collegesCount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WestBengal_HigherEd_Libraries_${selectedYear}_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeDistrictData = useMemo(() => {
    if (selectedDistrict === 'all') return null;
    return westBengalDistricts.find((d) => d.id === selectedDistrict) || null;
  }, [selectedDistrict]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100">
      {activeTab === 'public-library' && (
        <FilterBar
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedDivision={selectedDivision}
          setSelectedDivision={setSelectedDivision}
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
          selectedBuilding={selectedBuilding}
          setSelectedBuilding={setSelectedBuilding}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onReset={handleReset}
          disclaimerDate={currentYearData.disclaimerDate}
          language={language}
          onExportCsv={handleExportCsv}
          matchingCount={filteredDistricts.length}
        />
      )}

      <main className="flex-1 w-full max-w-7xl 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-10 py-8 space-y-8">
        {activeTab === 'public-library' && (
          <div id="unified-single-page-dashboard" className="w-full space-y-8">
            <div className="flex items-center justify-between pt-1">
              <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 px-4 py-2.5 border border-blue-100 shadow-sm">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
                  <BookOpen className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700/80">West Bengal</p>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">Public Libraries</h2>
                </div>
              </div>
            </div>

            <section id="section-kpis" className="w-full">
              <KpiSection
                totalLibraries={totalLibraries}
                totalMembers={totalMembers}
                totalFundsCr={totalFundsCr}
                isFiltered={selectedDistrict !== 'all' || selectedDivision !== 'all' || selectedGrade !== null}
                filteredDistrictName={
                  activeDistrictData
                    ? activeDistrictData.name
                    : selectedDivision !== 'all'
                    ? `${selectedDivision} Division`
                    : selectedGrade
                    ? `Grade ${selectedGrade === 'noClass' ? 'No Class' : selectedGrade}`
                    : undefined
                }
                language={language}
              />
            </section>

            <div className="w-full bg-slate-50/80 rounded-xl px-4 py-2.5 border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center flex-wrap gap-2 text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 shrink-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  <span>Active Filter Pipeline:</span>
                </span>

                <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDistrict !== 'all'
                    ? 'bg-blue-100 text-blue-950 border border-blue-200'
                    : 'bg-white text-slate-600 border border-slate-200/60'
                }`}>
                  <MapPin className="w-3 h-3 text-blue-700" />
                  <span>{selectedDistrict !== 'all' ? westBengalDistricts.find(d => d.id === selectedDistrict)?.name : 'All 23 Districts'}</span>
                </div>

                <ArrowRight className="w-3 h-3 text-slate-400 hidden sm:inline" />

                <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedGrade
                    ? 'bg-indigo-100 text-indigo-950 border border-indigo-200'
                    : 'bg-white text-slate-600 border border-slate-200/60'
                }`}>
                  <PieChart className="w-3 h-3 text-indigo-700" />
                  <span>{selectedGrade ? `Grade ${selectedGrade === 'noClass' ? 'No Class' : selectedGrade}` : 'All Grades'}</span>
                </div>

                <ArrowRight className="w-3 h-3 text-slate-400 hidden sm:inline" />

                <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedBuilding
                    ? 'bg-sky-100 text-sky-950 border border-sky-200'
                    : 'bg-white text-slate-600 border border-slate-200/60'
                }`}>
                  <Building2 className="w-3 h-3 text-sky-700" />
                  <span>{selectedBuilding ? selectedBuilding.charAt(0).toUpperCase() + selectedBuilding.slice(1) : 'All Buildings'}</span>
                </div>

                <ArrowRight className="w-3 h-3 text-slate-400 hidden sm:inline" />

                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80 font-mono">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{filteredDistricts.length} Districts Synced</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end lg:self-auto">
                {(selectedDistrict !== 'all' || selectedDivision !== 'all' || selectedGrade !== null || selectedBuilding !== null) && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleReset}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Filters</span>
                  </motion.button>
                )}
              </div>
            </div>

            <section className="w-full">
              <DistrictMapAndGradeSection
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
                onOpenDistrictModal={(d) => setModalDistrict(d)}
                selectedGrade={selectedGrade}
                onSelectGrade={setSelectedGrade}
                selectedDivision={selectedDivision}
                language={language}
                filteredDistricts={filteredDistricts}
              />
            </section>

            <section className="w-full">
              <TypeDistributionAndGrantSection
                language={language}
                onSelectDistrict={setSelectedDistrict}
                selectedDistrict={selectedDistrict}
                selectedGrade={selectedGrade}
                onSelectGrade={setSelectedGrade}
                filteredDistricts={filteredDistricts}
              />
            </section>

            <section className="w-full">
              <GrowthAnalysisSection
                language={language}
                onSelectDistrict={setSelectedDistrict}
                selectedDistrict={selectedDistrict}
                filteredDistricts={filteredDistricts}
                allDistricts={yearScaledDistricts}
              />
            </section>

            <section className="w-full">
              <BuildingAndBookUsageSection
                language={language}
                onSelectDistrict={setSelectedDistrict}
                selectedDistrict={selectedDistrict}
                onOpenDistrictModal={(d) => setModalDistrict(d)}
                selectedBuilding={selectedBuilding}
                onSelectBuilding={setSelectedBuilding}
                selectedGrade={selectedGrade}
                filteredDistricts={filteredDistricts}
                allDistricts={yearScaledDistricts}
              />
            </section>
          </div>
        )}

        {activeTab === 'overview' && (
          <OverviewDashboard
            language={language}
            selectedYear={selectedYear}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            filteredDistricts={filteredDistricts}
          />
        )}

        {activeTab === 'student' && (
          <StudentDashboard
            language={language}
            selectedYear={selectedYear}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            filteredDistricts={filteredDistricts}
          />
        )}

        {activeTab === 'university' && (
          <UniversityDashboard
            language={language}
            selectedYear={selectedYear}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            filteredDistricts={filteredDistricts}
          />
        )}
      </main>

      <DistrictDetailModal
        district={modalDistrict}
        onClose={() => setModalDistrict(null)}
        language={language}
      />
    </div>
  );
}
