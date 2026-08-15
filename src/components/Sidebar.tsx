import React from 'react';
import {
  Building2,
  GraduationCap,
  FlaskConical,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenReportModal: () => void;
  onOpenSupportModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab
}) => {
  const menuItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'affiliation', label: 'Affiliation', icon: Building2 },
    { id: 'campus', label: 'Campus', icon: GraduationCap },
    { id: 'research', label: 'Research', icon: FlaskConical }
  ];

  return (
    <aside className="w-64 bg-white flex flex-col justify-between shrink-0 h-full min-h-[calc(100vh-3.5rem)] py-6 px-4 select-none">
      {/* Navigation List */}
      <div>
        <div className="px-3 mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Dashboard Views</span>
        </div>
        <nav className="space-y-1" aria-label="Main Sidebar Navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[13px] font-medium transition-all cursor-pointer group ${isActive
                    ? 'bg-indigo-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white opacity-80" />}
              </button>
            );
          })}
        </nav>
      </div>

    </aside>
  );
};
