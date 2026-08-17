import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-6 text-center">
      <div className="max-w-md bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-4">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
          404
        </div>
        <h1 className="text-2xl font-black text-slate-900">Page Under Construction</h1>
        <p className="text-sm text-slate-500">
          This section is currently being integrated into the West Bengal State Higher Education Portal.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Go to Overview
          </Link>
          <Link
            href="/students"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Go to Student Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
