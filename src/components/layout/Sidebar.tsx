"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  GraduationCap, 
  Library, 
  Map, 
  Microscope,
  Award,
  FileText,
  Menu,
  ChevronLeft
} from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const navigation = [
  { group: "ACADEMIC PORTAL", items: [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Universities', href: '/universities', icon: Building2 },
    { name: 'Colleges', href: '/colleges', icon: GraduationCap },
    { name: 'Public Libraries', href: '/libraries', icon: Library },
  ]},
  { group: "ANALYTICS & DOCS", items: [
    { name: 'Districts', href: '/districts', icon: Map },
    { name: 'Research', href: '/research', icon: Microscope },
    { name: 'Scholarships', href: '/scholarships', icon: Award },
    { name: 'Reports', href: '/reports', icon: FileText },
  ]}
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={clsx(
      "bg-[#253C73] border-r border-[#1E3361] flex flex-col transition-all duration-300 relative z-20 shrink-0 h-screen sticky top-0 text-white",
      collapsed ? "w-[76px]" : "w-[260px]"
    )}>
      
      {/* Sidebar Header */}
      <div className="h-20 flex items-center justify-between px-6">
        {!collapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded flex items-center justify-center shrink-0">
               <Building2 size={24} className="text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-white text-[16px]">West Bengal</span>
              <span className="font-bold text-white text-[16px]">Portal</span>
            </div>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors mx-auto"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* User Profile Block */}
      {!collapsed && (
        <div className="px-5 py-4">
          <div className="bg-[#2D457F] border border-[#3A538D] rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1E3361] flex items-center justify-center font-bold text-white text-sm">
              AC
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-white leading-tight">Ashita Chhabra</span>
              <span className="text-[11px] text-white/60 font-medium">Academics Admin</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-6 px-3">
        {navigation.map((group, idx) => (
          <div key={idx}>
            {!collapsed && (
              <div className="px-4 mb-3 text-[11px] font-bold tracking-wider text-white/50 uppercase">
                {group.group}
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className="relative flex items-center group outline-none"
                    title={collapsed ? item.name : undefined}
                  >
                    {/* Active solid blue pill */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeAccentPill" 
                        className="absolute inset-0 bg-[#2563EB] rounded-xl z-0" 
                      />
                    )}
                    
                    <div className={clsx(
                      "relative z-10 flex items-center gap-3 py-3 px-4 rounded-xl w-full transition-colors",
                      isActive 
                        ? "text-white" 
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}>
                      <item.icon size={18} className={clsx("shrink-0", isActive ? "text-white" : "text-white/60 group-hover:text-white")} />
                      
                      {!collapsed && (
                        <span className={clsx("text-[14px] font-medium whitespace-nowrap", isActive ? "font-bold" : "")}>
                          {item.name}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

    </aside>
  );
}
