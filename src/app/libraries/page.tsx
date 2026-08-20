"use client";

import dynamic from 'next/dynamic';
import { YearProvider } from '@/contexts/YearContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const LibraryDashboardClient = dynamic(() => import('@/components/LibraryDashboardClient'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function LibrariesPage() {
  return (
    <YearProvider>
      <div className="flex h-screen overflow-hidden bg-white text-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-white">
            <LibraryDashboardClient />
          </main>
        </div>
      </div>
    </YearProvider>
  );
}
