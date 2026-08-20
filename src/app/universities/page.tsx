"use client";

import React, { useState } from 'react';
import { FilterBar } from '@/components/university/FilterBar';
import { ResearchView } from '@/components/university/views/ResearchView';
import { CampusView } from '@/components/university/views/CampusView';
import { AffiliationView } from '@/components/university/views/AffiliationView';
import { DrilldownModal } from '@/components/university/modals/DrilldownModal';
import { ReportModal } from '@/components/university/modals/ReportModal';
import { SupportModal } from '@/components/university/modals/SupportModal';
import { ActiveTab, NavCategory, FilterState } from '@/types/university';
import { Building2 } from 'lucide-react';
import '@/components/university/index.css';

const initialFilters: FilterState = {
  universityType: 'All',
  university: 'All',
  collegeType: 'All',
  collegeName: 'All',
  universityCode: 'All',
  year: 'All',
  theme: 'All',
  subTheme: 'All',
  district: 'All',
  searchQuery: ''
};

export default function UniversitiesPage() {
  const [activeCategory, setActiveCategory] = useState<NavCategory>('institutions');
  const [activeTab, setActiveTab] = useState<ActiveTab>('affiliation');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [drilldownModal, setDrilldownModal] = useState<{
    isOpen: boolean;
    title: string;
    data: any;
    type: string;
  }>({
    isOpen: false,
    title: '',
    data: null,
    type: ''
  });

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const handleFilterChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSearchQuery('');
  };

  const handleOpenDrilldown = (title: string, data: any, type: string) => {
    setDrilldownModal({
      isOpen: true,
      title,
      data,
      type
    });
  };

  const handleCloseDrilldown = () => {
    setDrilldownModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Switch category handling
  const handleSelectCategory = (category: NavCategory) => {
    setActiveCategory(category);
    if (category === 'institutions') {
      setActiveTab('affiliation');
    }
  };

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white text-slate-800 font-sans text-[15px] flex flex-col antialiased">

      {/* Main Body with Left Sidebar & Content Canvas */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto relative h-full">
        {/* Right Main Content Canvas */}
        <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
          {/* Dynamic Top Filter Bar for Affiliation, Campus, Research views */}
          {(activeTab === 'affiliation' ||
            activeTab === 'campus' ||
            activeTab === 'research') && (
              <FilterBar
                activeTab={activeTab}
                onSelectTab={handleSelectTab}
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            )}

          {/* View Container */}
          <div className="p-4 sm:p-6 lg:p-8 flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700/80">West Bengal</p>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">Universities</h2>
              </div>
            </div>

            {activeTab === 'research' && (
              <ResearchView
                filters={filters}
                onOpenDrilldown={handleOpenDrilldown}
              />
            )}

            {activeTab === 'campus' && (
              <CampusView
                filters={filters}
                onOpenDrilldown={handleOpenDrilldown}
              />
            )}

            {activeTab === 'affiliation' && (
              <AffiliationView
                filters={filters}
                onOpenDrilldown={handleOpenDrilldown}
                onFilterChange={handleFilterChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Drill-down Detail Modal */}
      <DrilldownModal
        isOpen={drilldownModal.isOpen}
        onClose={handleCloseDrilldown}
        title={drilldownModal.title}
        data={drilldownModal.data}
        type={drilldownModal.type}
      />

      {/* Official Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        activeTab={activeTab}
      />

      {/* Support & Help Desk Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}
