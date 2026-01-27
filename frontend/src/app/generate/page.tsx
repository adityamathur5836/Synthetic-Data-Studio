"use client";

import { Database, Play, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useMedicalStore } from '@/store/useMedicalStore';
import ParameterSliders from '@/components/controls/ParameterSliders';
import ResourceMonitor from '@/components/controls/ResourceMonitor';
import PipelineControls from '@/components/controls/PipelineControls';

export default function GeneratePage() {
  const { isGenerating, setGenerating, addAuditLog } = useMedicalStore();

  const handleStartGeneration = () => {
    setGenerating(true);
    addAuditLog("Synthetic Generation Started", "Batch generation of 500 retinal samples initiated.");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Stage 3: Generate Synthetic Data</h1>
          <p className="text-slate-500 mt-1 font-medium">Specify parameters and execute high-fidelity sample generation.</p>
        </div>
        <PipelineControls />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
            {isGenerating ? (
              <div className="text-center space-y-4">
                <div className="relative">
                  <Database className="w-16 h-16 text-medical-accent mx-auto animate-pulse" />
                  <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-400 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Generating Synthetic Corpus...</h3>
                <p className="text-slate-400 font-medium text-sm">Synthesizing high-dimensional clinical variants.</p>
                <div className="w-64 h-2 bg-slate-100 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-medical-accent animate-progress" />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-6">
                  <Database className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Ready for Generation</h3>
                <p className="text-slate-400 font-medium text-sm max-w-xs mx-auto">
                  Configure clinical parameters on the right to bias the synthetic distribution.
                </p>
              </div>
            )}
          </div>
          
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mt-1" />
            <div>
              <h4 className="font-bold text-emerald-900 text-sm">Differential Privacy Enabled</h4>
              <p className="text-xs text-emerald-700 font-medium leading-relaxed mt-1">
                Generation includes laplacian noise injection to ensure K-Anonymity of generated samples.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ParameterSliders />
          <ResourceMonitor />
        </div>
      </div>
    </div>
  );
}
