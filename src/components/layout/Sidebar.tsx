"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Library, 
  Menu, 
  ChevronLeft,
  ChevronDown,
  GraduationCap,
  FileText,
  Award,
  BarChart,
  Layers
} from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface SubItem {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  subItems?: SubItem[];
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  { 
    group: "ACADEMIC PORTAL", 
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { 
        name: 'Students', 
        href: '/students', 
        icon: Users,
        subItems: [
          { id: 'admission', name: 'Admission', href: '/students?tab=admission', icon: GraduationCap },
          { id: 'examination', name: 'Examination & Result', href: '/students?tab=examination', icon: FileText },
          { id: 'scholarship', name: 'Scholarship', href: '/students?tab=scholarship', icon: Award },
          { id: 'fra', name: 'FRA', href: '/students?tab=fra', icon: BarChart },
          { id: 'cap', name: 'CAP', href: '/students?tab=cap', icon: Layers },
        ]
      },
      { name: 'Universities', href: '/universities', icon: Building2 },
      { name: 'Public Libraries', href: '/libraries', icon: Library },
    ]
  }
];

function SidebarNavList({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (c: boolean) => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'admission';
  const isStudentsPage = pathname?.startsWith('/students');

  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    Students: true
  });

  useEffect(() => {
    if (isStudentsPage) {
      setOpenDropdowns(prev => ({ ...prev, Students: true }));
    }
  }, [isStudentsPage]);

  const toggleDropdown = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-6 px-3">
      {navigation.map((group, idx) => (
        <div key={idx}>
          {!collapsed && (
            <div className="px-4 mb-3 text-[11px] font-bold tracking-wider text-white/50 uppercase">
              {group.group}
            </div>
          )}
          
          <div className="flex flex-col gap-1.5">
            {group.items.map((item) => {
              const isExactActive = pathname === item.href && !item.subItems;
              const isParentActive = pathname === item.href || (item.subItems && isStudentsPage && item.name === 'Students');
              const isOpen = openDropdowns[item.name] ?? false;

              return (
                <div key={item.name} className="flex flex-col">
                  <div className="relative flex items-center group outline-none">
                    {/* Active solid blue pill */}
                    {isExactActive && (
                      <motion.div 
                        layoutId="activeAccentPill" 
                        className="absolute inset-0 bg-[#2563EB] rounded-xl z-0" 
                      />
                    )}
                    
                    <Link 
                      href={item.href}
                      onClick={() => {
                        if (collapsed) setCollapsed(false);
                        if (item.subItems) {
                          setOpenDropdowns(prev => ({ ...prev, [item.name]: true }));
                        }
                      }}
                      className={clsx(
                        "relative z-10 flex items-center justify-between py-3 px-4 rounded-xl w-full transition-colors select-none",
                        isExactActive
                          ? "text-white font-bold" 
                          : isParentActive
                          ? "text-white font-bold"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <item.icon size={18} className={clsx("shrink-0", isParentActive ? "text-white" : "text-white/60 group-hover:text-white")} />
                        {!collapsed && (
                          <span className={clsx("text-[14px] whitespace-nowrap", isParentActive ? "font-bold text-white" : "font-medium text-white/75")}>
                            {item.name}
                          </span>
                        )}
                      </div>

                      {!collapsed && item.subItems && (
                        <button
                          type="button"
                          onClick={(e) => toggleDropdown(item.name, e)}
                          className="p-1 rounded-md hover:bg-white/15 text-white/70 hover:text-white transition-transform cursor-pointer"
                          title={isOpen ? "Collapse menu" : "Expand menu"}
                        >
                          <ChevronDown
                            size={16}
                            className={clsx("transition-transform duration-200", isOpen ? "rotate-180 text-white" : "text-white/60")}
                          />
                        </button>
                      )}
                    </Link>
                  </div>

                  {/* Dropdown Accordion Sub-Menu */}
                  <AnimatePresence initial={false}>
                    {!collapsed && item.subItems && isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden flex flex-col pl-3 pr-1 gap-1 mt-1 border-l-2 border-white/20 ml-6 py-1"
                      >
                        {item.subItems.map((sub) => {
                          const isSubActive = isStudentsPage && (currentTab === sub.id || (!searchParams?.get('tab') && sub.id === 'admission'));
                          return (
                            <Link
                              key={sub.id}
                              href={sub.href}
                              className={clsx(
                                "flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] transition-all select-none",
                                isSubActive
                                  ? "bg-[#2563EB] text-white font-bold shadow-xs"
                                  : "text-white/70 hover:text-white hover:bg-white/10 font-medium"
                              )}
                            >
                              <sub.icon size={15} className={clsx("shrink-0", isSubActive ? "text-white" : "text-white/60")} />
                              <span className="truncate">{sub.name}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={clsx(
      "bg-[#253C73] border-r border-[#1E3361] flex flex-col transition-all duration-300 relative z-20 shrink-0 h-screen sticky top-0 text-white",
      collapsed ? "w-[76px]" : "w-[260px]"
    )}>
      
      {/* Sidebar Header */}
      <div className={clsx("flex items-center justify-between px-4 transition-all duration-300 border-b border-white/10", collapsed ? "h-28 flex-col justify-center gap-2 py-3" : "min-h-[96px] py-4")}>
        {!collapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src="/wb-seal.png?v=5" 
              alt="West Bengal Government Logo" 
              className="w-14 h-16 object-contain shrink-0 drop-shadow-lg" 
            />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-white text-[16px] tracking-tight">West Bengal</span>
              <span className="font-semibold text-white/80 text-[13px] tracking-wider uppercase">Portal</span>
            </div>
          </div>
        ) : (
          <img 
            src="/wb-seal.png?v=5" 
            alt="West Bengal Government Logo" 
            className="w-12 h-14 object-contain shrink-0 drop-shadow-lg" 
          />
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* User Profile Block */}
      {!collapsed && (
        <div className="px-5 py-4">
          <div className="bg-[#2D457F] border border-[#3A538D] rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1E3361] flex items-center justify-center font-bold text-white text-sm">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-white leading-tight">Admin</span>
              <span className="text-[11px] text-white/60 font-medium">Academics Admin</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Suspense fallback={<div className="flex-1 p-4" />}>
        <SidebarNavList collapsed={collapsed} setCollapsed={setCollapsed} />
      </Suspense>

    </aside>
  );
}
