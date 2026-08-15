import React, { useMemo } from 'react';
import { DeltaIndicator } from './DeltaIndicator';

export const CHART_COLORS = [
  '#2a78d6', // blue
  '#eb6834', // orange
  '#1baf7a', // teal/aqua
  '#eda100', // amber
  '#e87ba4', // pink/magenta
  '#008300', // green
  '#4a3aa7', // violet
  '#e34948'  // red
];

export interface WafflePart {
  label: string;
  value: number;
  deltaPercent?: number | null;
}

interface WaffleChartProps {
  title: string;
  total: number;
  parts: WafflePart[];
  totalDeltaPercent?: number | null;
}

export const WaffleChart: React.FC<WaffleChartProps> = ({ title, total, parts, totalDeltaPercent }) => {
  const cells = useMemo(() => {
    let sumParts = 0;
    parts.forEach(p => sumParts += p.value);
    
    if (sumParts < total) {
      console.warn(`WaffleChart data gap: sum of parts (${sumParts}) is less than total (${total})`);
    }

    // Apportion 100 cells using largest remainder method
    const quotas = parts.map(p => ({
      ...p,
      quota: (p.value / total) * 100
    }));

    let unaccountedQuota = ((total - sumParts) / total) * 100;
    if (unaccountedQuota < 0) unaccountedQuota = 0;

    let remainingCells = 100;
    const allocated = quotas.map(q => {
      const floor = Math.floor(q.quota);
      remainingCells -= floor;
      return { ...q, cells: floor, remainder: q.quota - floor };
    });

    let unaccountedCells = Math.floor(unaccountedQuota);
    remainingCells -= unaccountedCells;
    const unaccountedRemainder = unaccountedQuota - unaccountedCells;

    // Distribute remaining cells to highest remainders
    const remainders = [
      ...allocated.map((a, i) => ({ idx: i, remainder: a.remainder, isUnaccounted: false })),
      { idx: -1, remainder: unaccountedRemainder, isUnaccounted: true }
    ].sort((a, b) => b.remainder - a.remainder);

    for (let i = 0; i < remainingCells; i++) {
      const r = remainders[i];
      if (r.isUnaccounted) {
        unaccountedCells++;
      } else {
        allocated[r.idx].cells++;
      }
    }

    // Generate the 100 cells flat array
    const cellArray: { color: string, isUnaccounted: boolean, label: string }[] = [];
    allocated.forEach((a, i) => {
      const color = CHART_COLORS[i % CHART_COLORS.length];
      for (let c = 0; c < a.cells; c++) {
        cellArray.push({ color, isUnaccounted: false, label: a.label });
      }
    });
    for (let c = 0; c < unaccountedCells; c++) {
      cellArray.push({ color: 'transparent', isUnaccounted: true, label: 'Unaccounted' });
    }

    return { allocated, unaccountedCells, cellArray };
  }, [total, parts]);

  return (
    <div className="bg-white rounded-[12px] p-4 border border-[#E3E7ED] shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight leading-none mb-1.5">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{total.toLocaleString()}</span>
            <DeltaIndicator deltaPercent={totalDeltaPercent} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-4">
        <div className="grid grid-cols-10 gap-0.5 w-full aspect-square max-w-[140px] mx-auto mt-2">
          {cells.cellArray.map((cell, idx) => (
            <div
              key={idx}
              title={cell.label}
              className={`w-full aspect-square rounded-[1px] ${cell.isUnaccounted ? 'border border-slate-300' : ''}`}
              style={{ backgroundColor: cell.color }}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-2 mt-auto">
          {cells.allocated.map((a, i) => (
            <div key={a.label} className="flex items-center justify-between gap-1.5 text-[11px] font-medium text-slate-600">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="truncate" title={a.label}>{a.label}</span>
              </div>
              <span className="font-bold text-slate-900">{a.value.toLocaleString()}</span>
            </div>
          ))}
          {cells.unaccountedCells > 0 && (
             <div className="flex items-center justify-between gap-1.5 text-[11px] font-medium text-slate-600">
               <div className="flex items-center gap-1.5 min-w-0">
                 <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0 border border-slate-300 bg-transparent" />
                 <span className="truncate">Unaccounted</span>
               </div>
               <span className="font-bold text-slate-900">{(total - parts.reduce((acc, p) => acc + p.value, 0)).toLocaleString()}</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
