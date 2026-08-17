"use client";
import React from 'react';
import { X, Download, ExternalLink, CheckCircle, Search, Filter } from 'lucide-react';
import { SAMPLE_COLLEGES, UNIVERSITY_OUTPUT_DATA } from '@/data/university/mockData';

interface DrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  type: string;
}

export const DrilldownModal: React.FC<DrilldownModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  type
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#0c2340] text-white">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
              Department Registry Drill-down
            </span>
            <h3 className="text-base lg:text-lg font-bold text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-800">
          {/* If colleges list or general list */}
          {type === 'colleges_list' && (
            <div>
              <p className="text-xs text-slate-500 mb-3">
                Showing institutional directory records matching the active selection.
              </p>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="py-2.5 px-4">College Name</th>
                      <th className="py-2.5 px-4">Affiliating University</th>
                      <th className="py-2.5 px-4">District</th>
                      <th className="py-2.5 px-4">NAAC Grade</th>
                      <th className="py-2.5 px-4 text-center">Hostels (F/M)</th>
                      <th className="py-2.5 px-4 text-center">Active MoUs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SAMPLE_COLLEGES.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {c.name}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Code: {c.code} • {c.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">{c.university}</td>
                        <td className="py-2.5 px-4 text-slate-600">{c.district}</td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-800">
                            {c.naacGrade}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center font-medium">
                          {c.femaleHostels} / {c.maleHostels}
                        </td>
                        <td className="py-2.5 px-4 text-center font-bold text-blue-600">
                          {c.mousCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Theme Detail breakdown */}
          {type === 'theme_detail' && data && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-900 text-sm mb-1">{data.name}</h4>
                <div className="grid grid-cols-3 gap-4 text-center mt-3 pt-3 border-t border-blue-200/60">
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium">Conference Papers</span>
                    <p className="text-xl font-bold text-slate-900">{data.conferencePapers}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium">Research Grants</span>
                    <p className="text-xl font-bold text-blue-700">{data.researchGrants}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium">Published Papers</span>
                    <p className="text-xl font-bold text-purple-700">{data.publishedPapers}</p>
                  </div>
                </div>
              </div>

              {data.subThemes && (
                <div>
                  <h5 className="font-bold text-xs text-slate-700 mb-2">Sub-Theme Allocations & Lead Institutions</h5>
                  <div className="space-y-2">
                    {data.subThemes.map((st: any, i: number) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900">{st.name}</p>
                          <p className="text-[11px] text-slate-500">Lead Node: {st.leadUniversity}</p>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Grants</span>
                            <span className="font-bold text-blue-600">{st.researchGrants}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Published</span>
                            <span className="font-bold text-slate-900">{st.publishedPapers}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grantee detail */}
          {type === 'grantee_detail' && data && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                <p className="text-xs text-slate-500 font-semibold uppercase">Total Grant Allocation</p>
                <p className="text-3xl font-extrabold text-blue-700 font-mono mt-1">₹{data.amountFormatted}</p>
                <p className="text-xs text-slate-600 mt-2 font-medium">
                  Sponsoring Body: <span className="font-bold text-slate-900">{data.name}</span> ({data.category})
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Active Sanctioned Projects: <span className="font-bold text-slate-800">{data.projectCount}</span>
                </p>
              </div>
            </div>
          )}

          {/* Fallback for simple metric drilldown */}
          {type !== 'colleges_list' && type !== 'theme_detail' && type !== 'grantee_detail' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 mx-auto flex items-center justify-center font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">{title}</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Detailed verified registry records authenticated by the Higher Education Department database.
              </p>
              <div className="p-4 bg-white rounded-lg border border-slate-200 text-left text-xs max-w-md mx-auto space-y-1 font-mono text-slate-700">
                <p>Status: Active Verified State Record</p>
                <p>Registry Cycle: 2025-2026 Academic Year</p>
                <p>Authentication Hash: WB-HED-SEC-892401</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Export available in standard CSV / Audit formats
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert('Downloading institutional dataset CSV...');
              }}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#0c2340] hover:bg-[#173354] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


