import React from 'react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language: _language }) => {
  return (
    <footer className="w-full bg-[#002244] text-white border-t-2 border-[#0284c7] mt-10">
      <div className="w-full px-4 py-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-[11px] text-blue-300 gap-2">
        <span className="text-center sm:text-left">
          © 2026 Government of West Bengal. All Rights Reserved. Content managed by Department of Higher Education.
        </span>
        <span className="text-blue-400 font-medium">
          West Bengal Public Library Network (WBPLN)
        </span>
      </div>
    </footer>
  );
};

