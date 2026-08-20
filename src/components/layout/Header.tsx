"use client";

import React from "react";
import { Search, Bell, User } from "lucide-react";

function HeaderContent() {
  return (
    <header className="h-20 bg-white flex items-center justify-between px-8 sticky top-0 z-10 border-b border-blue-100 shrink-0">
      <div className="flex items-center gap-3">
        <h2 className="flex flex-wrap items-center gap-x-2 text-base sm:text-lg font-extrabold tracking-[-0.01em]">
          <span className="text-[#0B5CAD]">Department of Higher Education</span>
          <span className="text-blue-200" aria-hidden="true">|</span>
          <span className="text-sm font-medium tracking-normal text-[#475467] sm:text-base">Govt of West Bengal</span>
        </h2>
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
