"use client";

import React from "react";
import Link from "next/link";
import { Users, Library, BookOpen, GraduationCap, Microscope, Award } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

const nodes = [
  { id: "students", label: "Students", value: "12.4L", icon: Users, color: "text-[#8B5CF6]", bg: "bg-[#F5F3FF]", border: "border-[#8B5CF6]/20", route: "/students" },
  { id: "universities", label: "Universities", value: "42", icon: Library, color: "text-[#2563EB]", bg: "bg-[#EEF5FF]", border: "border-[#2563EB]/20", route: "/universities" },
  { id: "colleges", label: "Colleges", value: "2,408", icon: GraduationCap, color: "text-[#2563EB]", bg: "bg-[#EEF5FF]", border: "border-[#2563EB]/20", route: "/colleges" },
  { id: "libraries", label: "Public Libraries", value: "3,120", icon: BookOpen, color: "text-[#F59E0B]", bg: "bg-[#FFF7ED]", border: "border-[#F59E0B]/20", route: "/libraries" },
  { id: "research", label: "Research", value: "15.2K", icon: Microscope, color: "text-[#10B981]", bg: "bg-[#F0FDF9]", border: "border-[#10B981]/20", route: "/research" },
  { id: "scholarships", label: "Scholarships", value: "4.8L", icon: Award, color: "text-[#F59E0B]", bg: "bg-[#FFF7ED]", border: "border-[#F59E0B]/20", route: "/scholarships" },
];

export default function EcosystemOrbit() {
  return (
    <section className="bg-[#F7F9FC] border-b border-slate-100 py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-8 relative flex flex-col items-center">
        
        <div className="text-center mb-24">
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Education Ecosystem</h2>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            The interconnected domains of West Bengal. Navigate directly to operational modules.
          </p>
        </div>

        {/* Orbit Visualization */}
        <div className="relative w-full max-w-3xl aspect-square md:aspect-[2/1] flex items-center justify-center">
          
          {/* Subtle concentric rings */}
          <div className="absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full border border-slate-200" />
          <div className="absolute w-[450px] md:w-[750px] h-[450px] md:h-[750px] rounded-full border border-slate-100" />

          {/* Central Node */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center p-8 bg-white rounded-full shadow-xl border border-slate-100 w-48 h-48 md:w-56 md:h-56">
            <span className="text-[10px] font-bold tracking-widest text-[#2563EB] mb-2 uppercase">West Bengal</span>
            <span className="text-xl font-black text-slate-900 leading-tight">Higher <br />Education</span>
          </div>

          {/* Orbiting Nodes */}
          {nodes.map((node, i) => {
            // Position nodes in a circle
            const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2; // Start from top
            // Elliptical radius for better fit on screens
            const radiusX = typeof window !== 'undefined' && window.innerWidth < 768 ? 160 : 350;
            const radiusY = typeof window !== 'undefined' && window.innerWidth < 768 ? 160 : 250;
            
            const x = Math.cos(angle) * radiusX;
            const y = Math.sin(angle) * radiusY;

            return (
              <motion.div
                key={node.id}
                className="absolute z-30"
                style={{ x, y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring" }}
              >
                <Link href={node.route} className="block group">
                  <div className={clsx(
                    "flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-300",
                    "border shadow-sm hover:shadow-lg bg-white",
                    node.border
                  )}>
                    <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center mb-3", node.bg, node.color)}>
                      <node.icon size={24} />
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-black text-slate-900 mb-0.5">{node.value}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{node.label}</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
