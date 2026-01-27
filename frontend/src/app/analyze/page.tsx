"use client";

import { BarChart3, PieChart, ShieldAlert } from 'lucide-react';

export default function AnalyzePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Stage 4: Analyze Results</h1>
        <p className="text-slate-500 mt-1 font-medium">Verify data fidelity and privacy preservation metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card h-80 flex flex-col items-center justify-center">
           <BarChart3 className="w-12 h-12 text-slate-100 mb-4" />
           <p className="text-slate-400 font-medium">Demographic Bias Assessment</p>
        </div>
        <div className="glass-card h-80 flex flex-col items-center justify-center">
           <PieChart className="w-12 h-12 text-slate-100 mb-4" />
           <p className="text-slate-400 font-medium">Modality Fidelity Distribution</p>
        </div>
        
        <div className="lg:col-span-2 glass-card bg-orange-50/30 border-orange-200">
           <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-orange-600" />
              <h3 className="font-bold text-slate-900">Privacy Vulnerability Report</h3>
           </div>
           <p className="text-slate-600 font-medium text-sm leading-relaxed">
             System is currently calculating the K-Anonymity and L-Diversity of the generated cohort.<br/>
             Current status: <span className="text-orange-600 font-bold">Calculating...</span>
           </p>
        </div>
      </div>
    </div>
  );
}
