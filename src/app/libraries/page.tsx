import LibraryDashboardClient from '@/components/LibraryDashboardClient';
import { YearProvider } from '@/contexts/YearContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

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
