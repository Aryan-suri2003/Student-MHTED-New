"use client";

import React from 'react';
import Link from 'next/link';
import { WB_DISTRICTS } from "@/components/WestBengalMap";

export default function Footer() {
  return (
    <footer className="relative bg-[#0F172A] text-slate-300 pt-10 pb-5 overflow-hidden border-t border-slate-800">
      {/* Background Subtle SVG Map */}
      <div className="absolute right-[-5%] top-[-10%] opacity-[0.02] pointer-events-none w-[600px] h-[800px] text-white">
        <svg viewBox="0 0 480 680" className="w-full h-full drop-shadow-2xl">
          <g>
            {WB_DISTRICTS.map((dist) => (
              <path 
                key={dist.id} 
                d={dist.d} 
                fill="currentColor" 
                stroke="#1E293B" 
                strokeWidth={1} 
                strokeLinejoin="round" 
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        
        {/* Main Row: Identity + Links */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-8">
          
          {/* Identity Column */}
          <div className="md:w-1/3">
            <h2 className="text-[18px] font-black text-white tracking-tight leading-tight">
              WEST BENGAL<br />
              <span className="text-blue-400 font-bold text-[16px]">Higher Education Intelligence Portal</span>
            </h2>
            <p className="text-[12.5px] text-slate-400 mt-2 font-medium pr-4">
              A unified view of West Bengal's higher education ecosystem.
            </p>
          </div>

          {/* Links Columns */}
          <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-[11px] uppercase tracking-widest mb-3">Portal</h3>
              <ul className="space-y-2 text-[12.5px]">
                <li><Link href="/" className="hover:text-blue-400 transition-colors">Overview</Link></li>
                <li><Link href="/universities" className="hover:text-blue-400 transition-colors">Institutions</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Reports</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-[11px] uppercase tracking-widest mb-3">Resources</h3>
              <ul className="space-y-2 text-[12.5px]">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">User Guide</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Help & Support</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">FAQs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-[11px] uppercase tracking-widest mb-3">Data</h3>
              <ul className="space-y-2 text-[12.5px]">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Data Sources</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Data Dictionary</Link></li>
                <li><span className="text-slate-500">Last Updated:</span> <span className="text-slate-300 font-semibold">18 Aug 2026</span></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Data Disclaimer</Link></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="w-full h-[1px] bg-slate-800/60 mb-5"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between text-[11.5px] text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">© 2026 Government of West Bengal</span>
            <span className="hidden md:inline text-slate-700">•</span>
            <span>Higher Education Department</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="#" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <span className="text-slate-700">•</span>
            <Link href="#" className="hover:text-slate-300 transition-colors">Accessibility</Link>
            <span className="text-slate-700">•</span>
            <Link href="#" className="hover:text-slate-300 transition-colors">Terms</Link>
          </div>

          <div>
            <span className="bg-slate-800/50 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700/50">v1.0.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
