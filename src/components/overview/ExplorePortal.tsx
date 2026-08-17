"use client";

import React from "react";
import Link from "next/link";
import { Users, Building2, GraduationCap, Library, Microscope, Award } from "lucide-react";

export default function ExplorePortal() {
  const modules = [
    { name: "Students", icon: Users, href: "/students", color: "text-[#8B6FE8]", bg: "bg-[#F0EBFF]" },
    { name: "Universities", icon: Building2, href: "/universities", color: "text-[#4F7FEF]", bg: "bg-[#EAF2FF]" },
    { name: "Colleges", icon: GraduationCap, href: "/colleges", color: "text-[#4F7FEF]", bg: "bg-[#EAF2FF]" },
    { name: "Public Libraries", icon: Library, href: "/libraries", color: "text-[#48B9D9]", bg: "bg-[#E3F6FB]" },
    { name: "Research", icon: Microscope, href: "/research", color: "text-[#25B98A]", bg: "bg-[#E2F8F0]" },
    { name: "Scholarships", icon: Award, href: "/scholarships", color: "text-[#F2A93B]", bg: "bg-[#FFF2DD]" },
  ];

  return (
    <section className="bg-[#F7F9FC] py-16">
      <div className="max-w-7xl mx-auto w-full px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-[20px] font-bold text-[#172033] mb-1">Explore Portal</h2>
            <p className="text-[13px] text-[#667085]">Navigate directly to domain-specific dashboards.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {modules.map((m, idx) => (
            <Link 
              key={idx} 
              href={m.href}
              className="group bg-white border border-[#E6EAF0] hover:border-[#4F7FEF]/50 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${m.bg} ${m.color} group-hover:scale-110 transition-transform`}>
                <m.icon size={22} />
              </div>
              <span className="text-[14px] font-bold text-[#172033] group-hover:text-[#4F7FEF] transition-colors">
                {m.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
