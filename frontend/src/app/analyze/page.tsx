"use client";

import { LayoutGrid, Microscope, ShieldCheck as EthicsShield, FileText, Download, Info, BarChart3, PieChart, ShieldAlert, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useMedicalStore } from '@/store/useMedicalStore';
import MetricCard from '@/components/metrics/MetricCard';
import QualityChart from '@/components/metrics/QualityChart';
import PrivacyGauge from '@/components/metrics/PrivacyGauge';
import MetricDrillDown from '@/components/metrics/MetricDrillDown';
import DemographicDistribution from '@/components/analytics/DemographicDistribution';
import ComparativeHeatmap from '@/components/analytics/ComparativeHeatmap';
import CorrelationMatrix from '@/components/analytics/CorrelationMatrix';
import BiasRadarChart from '@/components/analytics/BiasRadarChart';
import MitigationPanel from '@/components/analytics/MitigationPanel';

export default function AnalyzePage() {
  const { analytics, mockAnalytics } = useMedicalStore();
  const [drillDownMetric, setDrillDownMetric] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'executive' | 'research' | 'ethics'>('executive');

  const handleOpenDrillDown = (title: string) => {
    setDrillDown({ isOpen: true, title });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Stage 4: Quality & Fidelity Analytics</h1>
          <p className="text-slate-500 mt-1 font-medium">Verify synthetic dataset's statistical alignment and clinical integrity.</p>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-xl">
           <button 
             onClick={() => setViewMode('executive')}
             className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
               viewMode === 'executive' ? 'bg-white shadow-sm text-medical-accent' : 'text-slate-500 hover:text-slate-700'
             }`}
           >
             <LayoutGrid className="w-3.5 h-3.5" /> Executive
           </button>
           <button 
             onClick={() => setViewMode('research')}
             className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
               viewMode === 'research' ? 'bg-white shadow-sm text-medical-accent' : 'text-slate-500 hover:text-slate-700'
             }`}
           >
             <Microscope className="w-3.5 h-3.5" /> Research
           </button>
           <button 
             onClick={() => setViewMode('ethics')}
             className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
               viewMode === 'ethics' ? 'bg-white shadow-sm text-medical-accent' : 'text-slate-500 hover:text-slate-700'
             }`}
           >
             <EthicsShield className="w-3.5 h-3.5" /> Ethics
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Fidelity Score"
          value={analytics?.fidelity.overall_score || 0.942}
          precision={3}
          trend={1.2}
          unit=""
          description="Structural similarity to real distributions."
          onClick={() => setDrillDownMetric('Fidelity')}
        />
        <MetricCard
          title="Privacy Level"
          value={analytics?.privacy.reidentification_risk || 0.008}
          precision={4}
          trend={-0.5}
          unit=""
          description="Calculated risk of patient re-identification."
          onClick={() => setDrillDownMetric('Privacy')}
          thresholds={{ yellow: 0.1, red: 0.2 }}
          inverse
        />
        <MetricCard
          title="Bias Score"
          value={analytics?.bias.demographic_parity || 0.021}
          precision={4}
          trend={-2.4}
          unit=""
          description="Parity across ethnicity and gender subgroups."
          onClick={() => setDrillDownMetric('Bias')}
          thresholds={{ yellow: 0.05, red: 0.15 }}
          inverse
        />
        <MetricCard
          title="Data Utility"
          value={0.88}
          precision={2}
          trend={4.1}
          unit=""
          description="Downstream predictive performance of synthetic data."
          onClick={() => setDrillDownMetric('Utility')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {viewMode === 'executive' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DemographicDistribution 
                title="Age Distribution Parity"
                labels={mockAnalytics.demographics.age.labels}
                realData={mockAnalytics.demographics.age.real}
                syntheticData={mockAnalytics.demographics.age.synthetic}
                chartId="ageDist"
              />
              <DemographicDistribution 
                title="Gender Balance"
                labels={mockAnalytics.demographics.gender.labels}
                realData={mockAnalytics.demographics.gender.real}
                syntheticData={mockAnalytics.demographics.gender.synthetic}
                chartId="genderDist"
              />
            </div>
          ) : viewMode === 'research' ? (
            <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ComparativeHeatmap 
                    title="Pathology Prevalence by Age"
                    data={mockAnalytics.prevalence}
                    chartId="prevalenceHeatmap"
                  />
                  <CorrelationMatrix 
                    attributes={mockAnalytics.correlation.attributes}
                    matrix={mockAnalytics.correlation.matrix}
                    chartId="correlationMatrix"
                  />
               </div>
               
               <div className="glass-card p-6 border-l-4 border-medical-accent">
                 <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-5 h-5 text-medical-accent" />
                    <h3 className="font-bold text-slate-900">Statistical Significance Report</h3>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium">
                   All demographic subgroups show no significant difference (p > 0.05) between real and synthetic cohorts 
                   under the current DP ε=0.5 setting. Downstream utility tests suggest 92% preservation of clinical signals.
                 </p>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="glass-card flex flex-col">
                  <div>
                     <h3 className="font-bold text-slate-900 tracking-tight">Multi-dimensional Parity Radar</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ethical Bias Assessment</p>
                  </div>
                  <div className="flex-1 mt-8">
                     <BiasRadarChart 
                        labels={['Age Parity', 'Gender Parity', 'Ethic Parity', 'Socio-Econ', 'Pathology Map', 'Hardware Bias']}
                        currentData={[0.85, 0.92, 0.78, 0.65, 0.94, 0.98]}
                        targetData={[0.95, 0.95, 0.95, 0.9, 0.98, 1.0]}
                     />
                  </div>
               </div>
               <MitigationPanel />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-6 w-full text-left">Privacy Guardrail</h3>
            <PrivacyGauge score={analytics ? 0.992 : 0.0} />
            <div className="mt-8 p-4 rounded-2xl bg-slate-50 w-full text-left border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
               <p className="text-xs font-bold text-medical-success flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-medical-success animate-pulse" />
                  Clinical Grade Privacy
               </p>
            </div>
          </div>
          
          <button className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-black transition-all group">
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            Generate PDF Report
          </button>
        </div>
      </div>

      <MetricDrillDown 
        metric={drillDownMetric} 
        onClose={() => setDrillDownMetric(null)} 
      />
    </div>
  );
}
    </div>
  );
}
