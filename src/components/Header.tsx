"use client";

import React from "react";
import { ChevronRight, Landmark } from "lucide-react";

interface HeaderProps {
  activeTab: "admission" | "examination" | "scholarship" | "fra" | "cap";
}

export default function Header({ activeTab }: HeaderProps) {
  const titleMap = {
    admission: {
      title: "Student Overview",
      subtitle: "Statewide consolidated overview of student enrollments, category shares, and institutional intakes.",
      tag: "Module 01 • Admissions",
    },
    examination: {
      title: "Examination & Results",
      subtitle: "University-wide examination conduct, medium of appearance, pass/fail ratios, and backlog distribution.",
      tag: "Module 02 • Academics",
    },
    scholarship: {
      title: "Scholarship & DBT Disbursals",
      subtitle: "Comprehensive monitoring of government welfare schemes, direct benefit transfers, and district disbursal progress.",
      tag: "Module 03 • Welfare & DBT",
    },
    fra: {
      title: "Fee Regulating Authority (FRA)",
      subtitle: "Regulatory oversight of institutional fee structures, proposals, and fee approval decisions.",
      tag: "Module 04 • Regulations",
    },
    cap: {
      title: "Centralized Admission Process (CAP)",
      subtitle: "Real-time tracking of CET seat allotments, choice code confirmations, and institutional intake fill rates.",
      tag: "Module 05 • Centralized Admissions",
    },
  };

  const { title, subtitle, tag } = titleMap[activeTab];

  return (
    <header className="mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-1.5">
            <Landmark size={13} className="text-blue-600" />
            <span>Govt. of West Bengal</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span>Higher Education Department</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-blue-700 font-extrabold">{title}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-brand-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 max-w-3xl font-medium">{subtitle}</p>
        </div>

        <div className="self-start md:self-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-blue-50 border border-blue-200/80 text-blue-900 shadow-2xs">
            {tag}
          </span>
        </div>
      </div>
    </header>
  );
}

