"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { YearProvider } from "@/contexts/YearContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StudentSectionHeader from "@/components/Header";
import Filters, { GlobalFilterState } from "@/components/Filters";
import ActiveFilterBanner from "@/components/ActiveFilterBanner";
import AdmissionDashboard from "@/components/AdmissionDashboard";
import FRADashboard from "@/components/FRADashboard";
import { FRAProvider } from "@/context/FRAContext";
import ScholarshipDashboard from "@/components/ScholarshipDashboard";
import ExaminationDashboard from "@/components/ExaminationDashboard";
import CAPDashboard from "@/components/CAPDashboard";

type TabId = "admission" | "examination" | "scholarship" | "fra" | "cap";

function StudentContent() {
  const searchParams = useSearchParams();
  const tabFromQuery = (searchParams?.get("tab") as TabId) || "admission";
  const [activeTab, setActiveTab] = useState<TabId>(tabFromQuery);

  useEffect(() => {
    if (tabFromQuery && ["admission", "examination", "scholarship", "fra", "cap"].includes(tabFromQuery)) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  const [globalFilters, setGlobalFilters] = useState<GlobalFilterState>({
    academicYear: "2025-26",
    university: "All",
    district: "All",
    universityType: "All",
    college: "All",
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F9FC] text-[#172033] antialiased font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col gap-6 bg-[#F7F9FC]">
          {/* Filters Section */}
          <Filters filters={globalFilters} onFilterChange={setGlobalFilters} activeTab={activeTab} />

          {/* Student Module Section Title / Breadcrumbs */}
          <StudentSectionHeader activeTab={activeTab} />

          {/* Active Filter Banner (Unified across all pages) */}
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
          ) : null}

          {/* Footer */}
          <footer className="border-t border-borderLight pt-6 text-center text-xs text-textMuted mt-auto flex-shrink-0">
            <p>© 2026 Department of Higher Education, Government of West Bengal (Banglar Uchchashiksha). All rights reserved.</p>
            <p className="mt-1 text-[10px] text-textMuted">West Bengal State Higher Education Institutions Portal & MIS Dashboard.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function StudentsPage() {
  return (
    <YearProvider>
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <StudentContent />
      </Suspense>
    </YearProvider>
  );
}
