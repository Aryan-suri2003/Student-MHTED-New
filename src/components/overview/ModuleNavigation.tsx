import React from "react";
import Link from "next/link";
import { Users, Library, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import clsx from "clsx";

const modules = [
  { id: "students", title: "Students", count: "12.4L", desc: "Enrolment, demographics, and outcomes.", icon: Users, route: "/students", color: "text-[#8B5CF6]", bg: "bg-[#F5F3FF]", border: "border-[#8B5CF6]/20", hover: "hover:border-[#8B5CF6]/60 hover:shadow-[#8B5CF6]/10" },
  { id: "universities", title: "Universities", count: "42", desc: "State and private university analytics.", icon: Library, route: "/universities", color: "text-[#2563EB]", bg: "bg-[#EEF5FF]", border: "border-[#2563EB]/20", hover: "hover:border-[#2563EB]/60 hover:shadow-[#2563EB]/10" },
  { id: "colleges", title: "Colleges", count: "2,408", desc: "Affiliated institution performance.", icon: GraduationCap, route: "/colleges", color: "text-[#2563EB]", bg: "bg-[#EEF5FF]", border: "border-[#2563EB]/20", hover: "hover:border-[#2563EB]/60 hover:shadow-[#2563EB]/10" },
  { id: "libraries", title: "Public Libraries", count: "3,120", desc: "Statewide library infrastructure.", icon: BookOpen, route: "/libraries", color: "text-[#F59E0B]", bg: "bg-[#FFF7ED]", border: "border-[#F59E0B]/20", hover: "hover:border-[#F59E0B]/60 hover:shadow-[#F59E0B]/10" },
];

export default function ModuleNavigation() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto w-full px-8">
        
        <h2 className="text-3xl font-black text-slate-900 mb-12 tracking-tight">Explore Modules</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod) => (
            <Link href={mod.route} key={mod.id} className="block group">
              <div className={clsx(
                "h-full p-8 rounded-3xl border transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col",
                mod.bg, mod.border, mod.hover
              )}>
                <div className={clsx("w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6", mod.color)}>
                  <mod.icon size={28} />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-1">{mod.title}</h3>
                <div className={clsx("text-xl font-black mb-4", mod.color)}>{mod.count}</div>
                <p className="text-slate-600 font-medium mb-8 flex-1">{mod.desc}</p>
                
                <div className={clsx("mt-auto flex items-center gap-2 text-sm font-bold tracking-wide uppercase transition-transform group-hover:translate-x-1", mod.color)}>
                  Explore <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
