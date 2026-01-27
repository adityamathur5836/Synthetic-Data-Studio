"use client";

import { BarChart3, PieChart, ShieldAlert, TrendingUp, Info } from 'lucide-react';
import { useState } from 'react';
import { useMedicalStore } from '@/store/useMedicalStore';
import MetricCard from '@/components/metrics/MetricCard';
import QualityChart from '@/components/metrics/QualityChart';
import PrivacyGauge from '@/components/metrics/PrivacyGauge';
import MetricDrillDown from '@/components/metrics/MetricDrillDown';

export default function AnalyzePage() {
  const { analytics } = useMedicalStore();
  const [drillDown, setDrillDown] = useState<{ isOpen: boolean; title: string } | null>(null);

  const handleOpenDrillDown = (title: string) => {
    setDrillDown({ isOpen: true, title });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Stage 4: Analyze Results</h1>
          <p className="text-slate-500 mt-1 font-medium">Verify data fidelity and privacy preservation metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <Info className="w-4 h-4" /> Methodology
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => handleOpenDrillDown("Quality Index")}>
          <MetricCard 
            label="Overall Quality" 
            value="94.2" 
            unit="%" 
            trend={+1.5}
            description="Composite score of fidelity, diversity, and medical consistency."
            history={[88, 89, 91, 92, 94]}
          />
        </div>
        <div onClick={() => handleOpenDrillDown("Fidelity")}>
          <MetricCard 
            label="FID Score" 
            value="12.4" 
            description="Fréchet Inception Distance - lower is better for image fidelity."
            history={[18, 16, 15, 13, 12]}
            thresholds={{ warning: 15, critical: 25, inverse: true }}
          />
        </div>
        <div onClick={() => handleOpenDrillDown("Privacy")}>
          <MetricCard 
            label="Anonymity Index" 
            value="99.8" 
            unit="%" 
            description="Calculated based on K-Anonymity and differentially private noise levels."
            history={[99, 99.5, 99.7, 99.8, 99.8]}
            thresholds={{ warning: 95, critical: 90 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card">
           <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900">Demographic Bias Assessment</h3>
           </div>
           <div className="h-64 flex flex-col items-center justify-center">
              <BarChart3 className="w-12 h-12 text-slate-100 mb-4" />
              <p className="text-slate-400 font-medium">Distribution Comparison (Real vs Synthetic)</p>
           </div>
        </div>

        <div className="glass-card flex flex-col items-center justify-center text-center">
           <h3 className="text-lg font-bold text-medical-text mb-6 w-full text-left flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-600" />
              Privacy Validation Gauge
           </h3>
           <PrivacyGauge score={0.998} size={200} />
        </div>
        
        <div className="lg:col-span-2 glass-card bg-medical-accent/5 border-medical-accent/20">
           <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-medical-accent" />
              <h3 className="font-bold text-slate-900">Utility Improvement Curve</h3>
           </div>
           <div className="h-48">
              <QualityChart 
                data={[0.7, 0.75, 0.82, 0.88, 0.94]} 
                labels={['B1', 'B2', 'B3', 'B4', 'B5']} 
                label="Data Utility Index" 
              />
           </div>
        </div>
      </div>

      <MetricDrillDown 
        isOpen={!!drillDown?.isOpen}
        onClose={() => setDrillDown(null)}
        title={drillDown?.title || ""}
        value={drillDown?.title === "FID Score" ? "12.4" : "94.2%"}
        history={drillDown?.title === "FID Score" ? [18, 16, 15, 13, 12] : [88, 89, 91, 92, 94]}
        labels={['T1', 'T2', 'T3', 'T4', 'T5']}
        description={
          drillDown?.title === "Privacy" 
          ? "This metric ensures that the synthetic samples do not leak patient secrets. We use Differential Privacy (DP) with ε=0.5."
          : "Measures the structural and clinical accuracy of generated images. High scores indicate the data is suitable for AI training."
        }
      />
    </div>
  );
}
