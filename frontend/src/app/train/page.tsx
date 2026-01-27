"use client";

import { BrainCircuit, Play, Pause, Activity } from 'lucide-react';

export default function TrainPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Stage 2: Train GAN Model</h1>
          <p className="text-slate-500 mt-1 font-medium">Configure and monitor the neural network training process.</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Pause className="w-4 h-4" /> Pause
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-medical-accent rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
            <Play className="w-4 h-4" /> Start Training
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Training visualization will appear here.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card">
            <h3 className="font-bold text-slate-900 mb-4">Training Config</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Fidelity</label>
                <div className="mt-1 font-bold">Standard (90%+)</div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Privacy Level (Epsilon)</label>
                <div className="mt-1 font-bold">ε = 0.5 (High Privacy)</div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">ETA</span>
                <span className="text-sm font-bold text-medical-accent">~45 minutes</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-medical-accent/10 border border-medical-accent/20">
            <h3 className="font-bold text-medical-accent flex items-center gap-2 mb-2">
              <BrainCircuit className="w-4 h-4" /> AI Notice
            </h3>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
              Medical GAN training requires significant GPU resources. System is currently allocated 2x NVIDIA V100.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
