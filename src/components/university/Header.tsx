"use client";
import React, { useState } from 'react';
import {
  Search,
  Bell,
  Settings,
  RotateCcw,
  Building,
  X,
  User,
  Shield,
  FileSpreadsheet,
  Command
} from 'lucide-react';
import { NavCategory } from '@/types/university';

interface HeaderProps {
  activeCategory: NavCategory;
  onSelectCategory: (category: NavCategory) => void;
  onResetFilters: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onResetFilters,
  searchQuery,
  onSearchChange,
  onOpenReportModal
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'NIRF Ranking Data Synchronized', time: '10 mins ago', type: 'info' },
    { id: 2, title: 'MHRD Grant Utilization Certificate Approved', time: '1 hour ago', type: 'success' },
    { id: 3, title: 'NAAC A++ Assessment Completed for Jadavpur Univ', time: 'Yesterday', type: 'success' }
  ];

  return (
    <header className="bg-white text-slate-900 sticky top-0 z-40">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Department Emblem & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
            WB
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-slate-900 leading-tight">
              Higher Education Department
            </h1>
            <p className="text-[10px] font-medium text-slate-500 hidden sm:block uppercase tracking-wider">
              Institutional Analytics
            </p>
          </div>
        </div>

        {/* Center: Main Navigation Tabs */}


        {/* Right: Search, Reset, Icons & Profile */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          {/* Search Box */}
          <div className="relative hidden sm:block w-44 lg:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              id="header-search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search universities..."
              className="w-full bg-slate-100 border-transparent rounded-full pl-9 pr-8 py-2 text-[12px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50 pointer-events-none">
                <Command className="w-3 h-3" />
                <span className="text-[9px] font-medium font-sans border border-slate-300 rounded px-1">K</span>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              id="header-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-600 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-[10px] text-slate-500 uppercase tracking-wider">System Alerts</span>
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 transition cursor-pointer text-xs">
                      <p className="font-medium text-slate-800">{n.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-indigo-600 font-medium hover:underline cursor-pointer"
                  >
                    Close Alerts
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <div className="relative">
            <button
              id="header-settings-btn"
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {showSettingsMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100 font-semibold text-slate-500 text-[10px] uppercase tracking-wider">
                  Portal Preferences
                </div>
                <button
                  onClick={() => {
                    onOpenReportModal();
                    setShowSettingsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                  Generate Audit Report
                </button>
                <div className="px-3 py-2 text-[10px] text-slate-400 bg-slate-50/50">
                  Data Refresh: Daily at 00:00 IST
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative ml-1">
            <button
              id="header-profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-full ring-2 ring-transparent hover:ring-slate-200 transition cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Admin Avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 text-xs">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="font-semibold text-slate-900">Dr. S. Mukherjee, IAS</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Principal Secretary • Higher Education</p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] font-medium border border-slate-200 uppercase tracking-wide">
                    <Shield className="w-2.5 h-2.5 text-indigo-600" />
                    Verified State Admin
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Department Profile
                  </button>
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    University Directory
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


