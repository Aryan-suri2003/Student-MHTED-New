"use client";

import React from "react";

interface HeaderProps {
  activeTab: "admission" | "examination" | "scholarship" | "fra" | "cap";
}

export default function Header({ activeTab }: HeaderProps) {
  // Title and subtitle mapping
  const titleMap = {
    admission: {
      title: "Student Overview",
      subtitle: "Welcome back! Here's an overview of your student information and admission details.",
    },
    examination: {
      title: "Examination & Results",
      subtitle: "Track your semesters, recent examinations, CGPA progression, and grading history.",
    },
    scholarship: {
      title: "Scholarship Portal",
      subtitle: "Apply for financial aid, view active scholarships, and track ongoing application status.",
    },
    fra: {
      title: "Fee Regulating Authority (FRA)",
      subtitle: "View institutional fee approvals, structures, regulations, and fee applications.",
    },
    cap: {
      title: "Centralized Admission Process (CAP)",
      subtitle: "Track CAP seat allocations, choices, cut-offs, and institutional registration progress.",
    },
  };

  const { title, subtitle } = titleMap[activeTab];

  return (
    <header className="mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-900 tracking-tight">{title}</h1>
        <p className="text-textMuted text-sm md:text-base mt-1 max-w-2xl">{subtitle}</p>
      </div>
    </header>
  );
}
