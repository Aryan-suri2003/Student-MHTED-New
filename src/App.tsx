import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FilterBar } from './components/FilterBar';
import { ResearchView } from './components/views/ResearchView';
import { CampusView } from './components/views/CampusView';
import { AffiliationView } from './components/views/AffiliationView';
import { DrilldownModal } from './components/modals/DrilldownModal';
import { ReportModal } from './components/modals/ReportModal';
import { SupportModal } from './components/modals/SupportModal';
import { ActiveTab, NavCategory, FilterState } from './types';
import { Menu, X } from 'lucide-react';

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

export default function App() {
  const [activeCategory, setActiveCategory] = useState<NavCategory>('institutions');
  const [activeTab, setActiveTab] = useState<ActiveTab>('affiliation');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fe] text-slate-800 font-sans flex flex-col antialiased">
      {/* Top Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onResetFilters={handleResetFilters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer"
        >
          {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{isMobileSidebarOpen ? 'Close Menu' : 'Navigation Menu'}</span>
        </button>
        <div className="text-xs font-bold text-slate-600 capitalize">
          Current View: <span className="text-blue-600 font-semibold">{activeTab}</span>
        </div>
      </div>

      {/* Main Body with Left Sidebar & Content Canvas */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenSupportModal={() => setIsSupportModalOpen(true)}
          />
        </div>

        {/* Mobile Drawer Sidebar */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative z-50 w-72 bg-white h-full shadow-2xl overflow-y-auto">
              <Sidebar
                activeTab={activeTab}
                onSelectTab={handleSelectTab}
                onOpenReportModal={() => {
                  setIsMobileSidebarOpen(false);
                  setIsReportModalOpen(true);
                }}
                onOpenSupportModal={() => {
                  setIsMobileSidebarOpen(false);
                  setIsSupportModalOpen(true);
                }}
              />
            </div>
          </div>
        )}

        {/* Right Main Content Canvas */}
        <main className="flex-1 flex flex-col min-w-0 bg-white overflow-x-hidden">
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
        </main>
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
