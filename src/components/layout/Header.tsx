"use client";

import React from "react";
import { Search, Bell, User } from "lucide-react";
import { useYear } from "@/contexts/YearContext";
import { usePathname, useSearchParams } from "next/navigation";

const routeTitles: Record<string, string> = {
  "/": "Overview",
  "/students": "Students",
  "/universities": "Universities",
  "/libraries": "Public Libraries",
};

const studentTabTitles: Record<string, string> = {
  admission: "Students — Admission",
  examination: "Students — Examination & Result",
  scholarship: "Students — Scholarship",
  fra: "Students — Fee Regulating Authority (FRA)",
  cap: "Students — Centralized Admission Process (CAP)",
};

function HeaderContent() {
  const { academicYear, setAcademicYear } = useYear();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab");

  let pageTitle = routeTitles[pathname] || "Dashboard";
  if (pathname === "/students" && tab && studentTabTitles[tab]) {
    pageTitle = studentTabTitles[tab];
  }

  return (
    <header className="h-20 bg-[#F7F9FC] flex items-center justify-between px-8 sticky top-0 z-10 border-b border-slate-200/80 shrink-0">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-[#172033] tracking-tight">{pageTitle}</h2>
        <p className="text-[13px] font-medium text-[#667085]">West Bengal Higher Education Intelligence</p>
      </div>

      <div className="flex items-center gap-2 text-slate-400">
        <button className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors">
          <Search size={18} strokeWidth={2.5} />
        </button>
        <button className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors relative">
          <Bell size={18} strokeWidth={2.5} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-white"></span>
        </button>
        <button className="w-10 h-10 rounded-full bg-[#EAF2FF] border border-[#4F7FEF]/20 text-[#4F7FEF] flex items-center justify-center hover:bg-[#4F7FEF] hover:text-white transition-colors">
          <User size={18} />
        </button>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <React.Suspense fallback={<header className="h-20 bg-[#F7F9FC] border-b border-slate-200/80" />}>
      <HeaderContent />
    </React.Suspense>
  );
}
