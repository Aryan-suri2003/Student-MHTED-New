import React from 'react';
import { DistrictData, Language } from '../types';
import { X, Building2, Users, IndianRupee, BookOpen, Layers, TrendingUp, CheckCircle, Award } from 'lucide-react';

interface DistrictDetailModalProps {
  district: DistrictData | null;
  onClose: () => void;
  language: Language;
}

export const DistrictDetailModal: React.FC<DistrictDetailModalProps> = ({
  district,
  onClose,
  language,
}) => {
  if (!district) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-blue-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#003366] to-[#0284c7] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-blue-950 flex items-center justify-center font-bold text-lg shadow-md">
              {district.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                {district.name} {language === 'bn' ? 'জেলা তথ্য' : 'District Profile'}
              </h2>
              <p className="text-xs text-blue-100">
                {district.bengaliName} • {district.division} Division | Department of Higher Education & Mass Education Extension, Govt. of West Bengal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-gray-800 text-xs sm:text-sm">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[10px] text-gray-500 block uppercase font-bold">Public Libraries</span>
              <span className="text-lg font-extrabold text-blue-900">{district.totalLibraries}</span>
            </div>
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
              <span className="text-[10px] text-gray-500 block uppercase font-bold">Total Members</span>
              <span className="text-lg font-extrabold text-sky-800">{district.totalMembers.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[10px] text-gray-500 block uppercase font-bold">Funds (₹ Cr)</span>
              <span className="text-lg font-extrabold text-blue-950">₹ {district.totalFundsCr} Cr</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-gray-500 block uppercase font-bold">YoY Growth</span>
              <span className={`text-lg font-extrabold ${district.growthPct >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {district.growthPct >= 0 ? `+${district.growthPct}%` : `${district.growthPct}%`}
              </span>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-800 text-xs sm:text-sm mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              Grade-wise Library Classification
            </h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-gray-200">
                <span className="text-[10px] text-gray-500 block">Grade A</span>
                <span className="font-bold text-emerald-700 text-sm">{district.grades.A}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-gray-200">
                <span className="text-[10px] text-gray-500 block">Grade B</span>
                <span className="font-bold text-sky-600 text-sm">{district.grades.B}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-gray-200">
                <span className="text-[10px] text-gray-500 block">Grade C</span>
                <span className="font-bold text-blue-900 text-sm">{district.grades.C}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-gray-200">
                <span className="text-[10px] text-gray-500 block">Grade D</span>
                <span className="font-bold text-cyan-700 text-sm">{district.grades.D}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-gray-200">
                <span className="text-[10px] text-gray-500 block">No Class</span>
                <span className="font-bold text-amber-600 text-sm">{district.grades.noClass}</span>
              </div>
            </div>
          </div>

          {/* Higher Education & Library Infrastructure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-950 mb-2 flex items-center gap-1.5 text-xs">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Library Premises Infrastructure
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li className="flex justify-between">
                  <span className="text-gray-600">Owned Buildings:</span>
                  <span className="font-bold text-sky-700">{district.buildingType.owned}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Rented Premises:</span>
                  <span className="font-bold text-blue-950">{district.buildingType.rented}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Free / Donated:</span>
                  <span className="font-bold text-emerald-700">{district.buildingType.freeOfCharge}</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-950 mb-2 flex items-center gap-1.5 text-xs">
                <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                District Grant Disbursal (₹ Lac)
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li className="flex justify-between">
                  <span className="text-gray-600">Installment 1 (Q1/Q2):</span>
                  <span className="font-bold text-blue-700">₹ {district.grantsLac.installment1.toFixed(2)} Lac</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Installment 2 (Q3/Q4):</span>
                  <span className="font-bold text-sky-600">₹ {district.grantsLac.installment2.toFixed(2)} Lac</span>
                </li>
                <li className="flex justify-between pt-1 border-t border-blue-200">
                  <span className="font-semibold text-gray-800">Total Annual Grant:</span>
                  <span className="font-bold text-blue-950">
                    ₹ {(district.grantsLac.installment1 + district.grantsLac.installment2).toFixed(2)} Lac
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">
            District Library Officer (DLO) | West Bengal Public Libraries Act
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#003366] hover:bg-blue-900 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

