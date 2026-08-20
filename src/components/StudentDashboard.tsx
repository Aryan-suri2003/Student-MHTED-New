"use client";

import React, { useState } from 'react';
import { Language, DistrictData } from '../types';
import Filters, { GlobalFilterState } from "@/components/Filters";
import ActiveFilterBanner from "@/components/ActiveFilterBanner";
import Sidebar from "@/components/Sidebar";
import AdmissionDashboard from "@/components/AdmissionDashboard";
import FRADashboard from "@/components/FRADashboard";
import { FRAProvider } from "@/context/FRAContext";
import ScholarshipDashboard from "@/components/ScholarshipDashboard";
import ExaminationDashboard from "@/components/ExaminationDashboard";
import CAPDashboard from "@/components/CAPDashboard";

type TabId = "admission" | "examination" | "scholarship" | "fra" | "cap";

interface StudentDashboardProps {
  language?: Language;
  selectedYear?: string;
  selectedDistrict?: string;
  onSelectDistrict?: (dId: string) => void;
  filteredDistricts?: DistrictData[];
}

export const StudentDashboard: React.FC<StudentDashboardProps> = () => {
  const [activeTab, setActiveTab] = useState<TabId>("admission");
  const [globalFilters, setGlobalFilters] = useState<GlobalFilterState>({
    academicYear: "2025-26",
    university: "All",
    district: "All",
    universityType: "All",
    college: "All",
  });

  return (
    <div className="w-full bg-surface rounded-3xl border border-borderLight flex flex-col overflow-hidden shadow-soft">
      {/* Top Banner Accent */}
      <div className="w-full h-2 bg-brand-800 flex-shrink-0" />

      {/* Dashboard Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-[850px]">
        {/* Sidebar Section */}
        <Sidebar />

        {/* Right Column: Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 lg:p-8 gap-6 bg-background">
          {/* Filters Section */}
          <Filters filters={globalFilters} onFilterChange={setGlobalFilters} activeTab={activeTab} />

          {/* Active Filter Banner */}
          <ActiveFilterBanner filters={globalFilters} onFilterChange={setGlobalFilters} />

          {/* Dynamic Section Contents */}
          {activeTab === "admission" ? (
            <AdmissionDashboard
              globalFilters={globalFilters}
              onDistrictChange={(dist) =>
                setGlobalFilters((prev) => ({ ...prev, district: dist }))
              }
              onUniversityChange={(uni) =>
                setGlobalFilters((prev) => ({ ...prev, university: uni, college: "All" }))
              }
            />
          ) : activeTab === "fra" ? (
            <FRAProvider><FRADashboard globalFilters={globalFilters} /></FRAProvider>
          ) : activeTab === "scholarship" ? (
            <ScholarshipDashboard
              globalFilters={globalFilters}
              onUniversityChange={(uni) =>
                setGlobalFilters((prev) => ({ ...prev, university: uni }))
              }
            />
          ) : activeTab === "examination" ? (
            <ExaminationDashboard
              globalFilters={globalFilters}
              onUniversityChange={(uni) =>
                setGlobalFilters((prev) => ({ ...prev, university: uni }))
              }
            />
          ) : activeTab === "cap" ? (
            <CAPDashboard
              globalFilters={globalFilters}
              onUniversityChange={(uni) =>
                setGlobalFilters((prev) => ({ ...prev, university: uni }))
              }
            />
          ) : null}

          {/* Footer */}
          <footer className="border-t border-borderLight pt-6 text-center text-xs text-textMuted mt-auto flex-shrink-0">
            <p>© 2026 Department of Higher Education, Government of West Bengal (Banglar Uchchashiksha). All rights reserved.</p>
            <p className="mt-1 text-[10px] text-textMuted">West Bengal State Higher Education Institutions Portal & MIS Dashboard.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
