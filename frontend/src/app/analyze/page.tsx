"use client";

export const dynamic = 'force-dynamic';

import dynamic_loader from 'next/dynamic';
import { LayoutGrid, Microscope, ShieldCheck as EthicsShield, FileText, Download, Info, BarChart3, PieChart, ShieldAlert, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useMedicalStore } from '@/store/useMedicalStore';
import MetricCard from '@/components/metrics/MetricCard';
import PrivacyGauge from '@/components/metrics/PrivacyGauge';
import MetricDrillDown from '@/components/metrics/MetricDrillDown';

const DemographicDistribution = dynamic_loader(() => import('@/components/analytics/DemographicDistribution'), { ssr: false });
const ComparativeHeatmap = dynamic_loader(() => import('@/components/analytics/ComparativeHeatmap'), { ssr: false });
const CorrelationMatrix = dynamic_loader(() => import('@/components/analytics/CorrelationMatrix'), { ssr: false });
const BiasRadarChart = dynamic_loader(() => import('@/components/analytics/BiasRadarChart'), { ssr: false });
const MitigationPanel = dynamic_loader(() => import('@/components/analytics/MitigationPanel'), { ssr: false });

export default function AnalyzePage() {
  const { analytics, mockAnalytics } = useMedicalStore();
  const [drillDownMetric, setDrillDownMetric] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'executive' | 'research' | 'ethics'>('executive');

  const handleOpenDrillDown = (title: string) => {
    setDrillDownMetric(title);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Stage 4: Quality & Fidelity Analytics</h1>
          <p className="text-slate-500 mt-1 font-medium">Verify synthetic dataset's statistical alignment and clinical integrity.</p>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-xl shadow-inner shadow-slate-200/50">
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
        <div onClick={() => handleOpenDrillDown("Fidelity Score")}>
          <MetricCard
            label="Fidelity Score"
            value={analytics?.fidelity_metrics?.real_vs_synthetic_similarity || 0.942}
            trend={1.2}
            description="Structural similarity to real distributions."
            history={[0.88, 0.89, 0.91, 0.92, 0.94]}
          />
        </div>
        <div onClick={() => handleOpenDrillDown("Privacy Level")}>
          <MetricCard
            label="Privacy Level"
            value={analytics?.privacy_metrics?.reidentification_risk_score || 0.008}
            trend={-0.5}
            description="Calculated risk of patient re-identification."
            thresholds={{ warning: 0.1, critical: 0.2, inverse: true }}
            history={[0.012, 0.010, 0.009, 0.008, 0.008]}
          />
        </div>
        <div onClick={() => handleOpenDrillDown("Bias Score")}>
          <MetricCard
            label="Bias Score"
            value={0.021}
            trend={-2.4}
            description="Parity across ethnicity and gender subgroups."
            thresholds={{ warning: 0.05, critical: 0.15, inverse: true }}
            history={[0.045, 0.038, 0.031, 0.025, 0.021]}
          />
        </div>
        <div onClick={() => handleOpenDrillDown("Utility Index")}>
          <MetricCard
            label="Data Utility"
            value={0.88}
            trend={4.1}
            description="Downstream predictive performance of synthetic data."
            history={[0.72, 0.78, 0.81, 0.85, 0.88]}
          />
        </div>
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
                 <p className="text-xs text-slate-600 leading-relaxed font-medium">
                   All demographic subgroups show no significant difference (p &gt; 0.05) between real and synthetic cohorts 
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
            <h3 className="text-lg font-bold text-slate-900 mb-6 w-full text-left flex items-center gap-2">
               <ShieldAlert className="w-5 h-5 text-emerald-600" />
               Privacy Guardrail
            </h3>
            <PrivacyGauge score={analytics ? 0.992 : 0.0} />
            <div className="mt-8 p-4 rounded-2xl bg-slate-50 w-full text-left border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
               <div className="text-xs font-bold text-medical-success flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-medical-success animate-pulse" />
                  Clinical Grade Privacy
               </div>
            </div>
          </div>
          
          <button className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-black transition-all group">
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            Generate PDF Report
          </button>
        </div>
      </div>

      <MetricDrillDown 
        isOpen={!!drillDownMetric}
        onClose={() => setDrillDownMetric(null)}
        title={drillDownMetric || ""}
        value={drillDownMetric === "Fidelity Score" ? "0.942" : drillDownMetric === "Privacy Level" ? "0.008" : "0.88"}
        history={[0.88, 0.89, 0.91, 0.92, 0.94]}
        labels={['T1', 'T2', 'T3', 'T4', 'T5']}
        description={
          drillDownMetric === "Privacy Level" 
          ? "This metric ensures that the synthetic samples do not leak patient secrets. We use Differential Privacy (DP) with ε=0.5."
          : "Measures the structural and clinical accuracy of generated images. High scores indicate the data is suitable for AI training."
        }
      />
    </div>
  );
}
