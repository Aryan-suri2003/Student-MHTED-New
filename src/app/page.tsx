"use client";

import React, { useState } from "react";
import Filters, { GlobalFilterState } from "@/components/Filters";
import ActiveFilterBanner from "@/components/ActiveFilterBanner";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AdmissionDashboard from "@/components/AdmissionDashboard";
import FRADashboard from "@/components/FRADashboard";
import { FRAProvider } from "@/context/FRAContext";
import ScholarshipDashboard from "@/components/ScholarshipDashboard";
import ExaminationDashboard from "@/components/ExaminationDashboard";
import CAPDashboard from "@/components/CAPDashboard";

type TabId = "admission" | "examination" | "scholarship" | "fra" | "cap";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("admission");
  const [globalFilters, setGlobalFilters] = useState<GlobalFilterState>({
    academicYear: "2025-26",
    university: "All",
    district: "All",
    universityType: "All",
    college: "All",
  });

  // Helper to map tab to page number and name
  const getPageData = () => {
    switch (activeTab) {
      case "admission":
        return { num: "1", name: "Admission" };
      case "examination":
        return { num: "2", name: "Examination & Result" };
      case "scholarship":
        return { num: "3", name: "Scholarship" };
      case "fra":
        return { num: "4", name: "FRA" };
      case "cap":
        return { num: "5", name: "CAP" };
      default:
        return { num: "1", name: "Admission" };
    }
  };

  const pageData = getPageData();

  return (
    <div className="w-screen h-screen bg-background text-textMain antialiased font-sans flex flex-col overflow-hidden">
      <div className="w-full h-full bg-surface flex flex-col overflow-hidden relative">
        {/* Top Banner Accent */}
        <div className="w-full h-2 bg-brand-800 flex-shrink-0" />

        {/* Dashboard Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Sidebar Section */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Right Column: Content Area */}
          <div className="flex-1 flex flex-col overflow-y-auto p-6 lg:p-8 gap-6 bg-background">
            {/* Filters Section */}
            <Filters filters={globalFilters} onFilterChange={setGlobalFilters} activeTab={activeTab} />

            {/* Header Section */}
            <Header activeTab={activeTab} />

            {/* Active Filter Banner (Unified across all pages) */}
            <ActiveFilterBanner filters={globalFilters} onFilterChange={setGlobalFilters} />

            {/* Dynamic Section Contents */}
            {activeTab === "admission" ? (
              <AdmissionDashboard
                globalFilters={globalFilters}
                onDistrictChange={(dist) =>
                  setGlobalFilters((prev) => ({ ...prev, district: dist }))
                }
              />
            ) : activeTab === "fra" ? (
              <FRAProvider><FRADashboard /></FRAProvider>
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
            ) : (
              <div className="bg-background rounded-2xl md:rounded-3xl border border-borderLight p-12 text-center min-h-[350px] flex flex-col items-center justify-center flex-1">
                <div className="space-y-3">
                  <h2 className="text-5xl font-extrabold text-brand-900 tracking-tight">
                    Page {pageData.num}
                  </h2>
                  <p className="text-brand-600 font-bold text-lg uppercase tracking-wider">
                    {pageData.name} Section
                  </p>
                  <div className="w-16 h-1 bg-brand-600 rounded-full mx-auto my-4" />
                  <p className="text-sm text-textMuted max-w-md mx-auto leading-relaxed">
                    This content area represents Page {pageData.num} of your student portal dashboard. Modify this template to append new data grids or widgets under the {pageData.name} context.
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <footer className="border-t border-borderLight pt-6 text-center text-xs text-textMuted mt-auto flex-shrink-0">
              <p>© 2026 Department of Higher Education, Government of West Bengal (Banglar Uchchashiksha). All rights reserved.</p>
              <p className="mt-1 text-[10px] text-textMuted">West Bengal State Higher Education Institutions Portal & MIS Dashboard.</p>
            </footer>
          </div>

        </div>
      </div>
    </div>
  );
}
