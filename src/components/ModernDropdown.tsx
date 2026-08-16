import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  badgeColor?: string;
  group?: string;
  icon?: React.ReactNode;
}

interface ModernDropdownProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  icon: React.ReactNode;
  iconBgClass?: string;
  iconColorClass?: string;
  activeBorderColorClass?: string;
  activeRingColorClass?: string;
  placeholder?: string;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  className?: string;
  minWidth?: string;
  align?: 'left' | 'right';
}

export const ModernDropdown: React.FC<ModernDropdownProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  icon,
  iconBgClass = 'bg-blue-100/80 text-blue-700',
  activeBorderColorClass = 'hover:border-blue-400 focus:border-blue-500',
  activeRingColorClass = 'focus:ring-blue-100',
  enableSearch = false,
  searchPlaceholder = 'Search...',
  className = '',
  minWidth = 'w-56',
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search on open
  useEffect(() => {
    if (isOpen && enableSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearch('');
    }
  }, [isOpen, enableSearch]);

  const filteredOptions = options.filter((opt) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      opt.label.toLowerCase().includes(q) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(q)) ||
      (opt.group && opt.group.toLowerCase().includes(q)) ||
      (opt.badge && opt.badge.toLowerCase().includes(q))
    );
  });

  return (
    <div className={`relative ${className}`} ref={dropdownRef} id={id}>
      {/* Trigger Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`h-11 w-full relative flex items-center justify-between bg-gradient-to-b from-slate-50 to-slate-100/90 hover:to-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer group text-left ${activeBorderColorClass} ${
          isOpen ? 'ring-2 ring-blue-500/20 border-blue-500 bg-white' : ''
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center min-w-0 pr-2">
          <div
            className={`w-6 h-6 rounded-lg ${iconBgClass} flex items-center justify-center mr-2 shrink-0 group-hover:scale-105 transition-transform duration-200`}
          >
            {icon}
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none">
              {label}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-black text-slate-900 truncate max-w-[120px] sm:max-w-[140px]">
                {selectedOption?.label || label}
              </span>
              {selectedOption?.badge && (
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase shrink-0 ${
                    selectedOption.badgeColor || 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {selectedOption.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-auto text-slate-400 group-hover:text-slate-600 shrink-0 pl-1"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Popover Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={`absolute top-full ${
              align === 'right' ? 'right-0' : 'left-0'
            } z-50 mt-1 ${minWidth} max-w-[340px] bg-white/98 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.12)] p-1.5 overflow-hidden`}
          >
            {/* Search header inside dropdown */}
            {enableSearch && (
              <div className="p-1.5 border-b border-slate-100 mb-1">
                <div className="relative flex items-center bg-slate-100/90 rounded-xl px-2.5 py-1.5 border border-slate-200/80 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-hidden font-medium"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* List of options */}
            <div className="max-h-60 overflow-y-auto space-y-0.5 pr-0.5 no-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="py-4 px-3 text-center text-xs text-slate-400 font-medium">
                  No matching options found
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <motion.button
                      key={opt.value}
                      type="button"
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50/70 text-blue-950 font-bold border border-blue-200/70 shadow-2xs'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        <div className="flex flex-col min-w-0">
                          <span className={`truncate ${isSelected ? 'font-black text-blue-950' : 'font-semibold text-slate-800'}`}>
                            {opt.label}
                          </span>
                          {opt.sublabel && (
                            <span className="text-[10px] text-slate-400 truncate">
                              {opt.sublabel}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {opt.badge && (
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md font-mono ${
                              opt.badgeColor || (isSelected ? 'bg-blue-200/70 text-blue-900' : 'bg-slate-200 text-slate-700')
                            }`}
                          >
                            {opt.badge}
                          </span>
                        )}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs"
                          >
                            <Check className="w-2.5 h-2.5" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
