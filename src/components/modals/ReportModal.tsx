import React, { useState } from 'react';
import { X, FileText, Download, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  activeTab
}) => {
  const [reportType, setReportType] = useState('full_executive');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 900);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#0c2340] text-white">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-300" />
            <h3 className="text-base font-bold text-white">
              Generate State Department Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {!isGenerated ? (
            <>
              {/* Report Scope */}
              <div>
                <label className="block font-bold text-slate-900 mb-2">
                  Select Report Scope & Module
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="reportScope"
                      checked={reportType === 'full_executive'}
                      onChange={() => setReportType('full_executive')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-bold text-slate-900">Comprehensive Executive Summary (All Modules)</p>
                      <p className="text-[11px] text-slate-500">Includes 36 Universities, 8,064 Colleges, Research KPIs & NAAC Grading</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="reportScope"
                      checked={reportType === 'research_focus'}
                      onChange={() => setReportType('research_focus')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-bold text-slate-900">Research & Grant Utilization Dossier</p>
                      <p className="text-[11px] text-slate-500">795 Journal Papers, ₹10.32 Cr Grants, MHRD/UGC/SERB funding charts</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="reportScope"
                      checked={reportType === 'affiliation_campus'}
                      onChange={() => setReportType('affiliation_campus')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-bold text-slate-900">Infrastructure & Affiliation Audit Deck</p>
                      <p className="text-[11px] text-slate-500">Hostels (984 Female / 874 Male), 577 Colleges & 28,086 MoUs</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Format selection */}
              <div>
                <label className="block font-bold text-slate-900 mb-2">
                  Output Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormat('pdf')}
                    className={`p-3 rounded-xl border text-center font-semibold transition cursor-pointer ${
                      format === 'pdf'
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    PDF Formal Briefing
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('xlsx')}
                    className={`p-3 rounded-xl border text-center font-semibold transition cursor-pointer ${
                      format === 'xlsx'
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Excel Tabular Dataset
                  </button>
                </div>
              </div>

              {/* Verification watermark notice */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2.5 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Digitally certified by Government of West Bengal Higher Education Department.</span>
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-slate-900">
                Report Generated Successfully!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your report <span className="font-mono font-bold text-slate-800">WB_HED_ANALYTICS_2026.{format}</span> has been compiled and digitally stamped.
              </p>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Downloading WB_HED_ANALYTICS_2026.${format}`);
                    onClose();
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isGenerated && (
          <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-5 py-2 rounded-lg bg-[#0c2340] hover:bg-[#173354] text-white text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Compiling Data...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
