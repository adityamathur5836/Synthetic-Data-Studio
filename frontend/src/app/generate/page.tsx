"use client";

import { Database, Plus } from 'lucide-react';

export default function GeneratePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Stage 3: Generate Data</h1>
        <p className="text-slate-500 mt-1 font-medium">Synthesize new medical samples based on your research requirements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6 text-sm">
          <div className="glass-card">
            <h3 className="font-bold text-slate-900 mb-4">Parameters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Sample Count</label>
                <input type="number" defaultValue={10} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-bold" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Primary Condition</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-boldappearance-none">
                  <option>Diabetic Retinopathy</option>
                  <option>Glaucoma</option>
                  <option>Healthy Control</option>
                </select>
              </div>
              <button className="w-full py-3 bg-medical-accent text-white font-bold rounded-lg hover:bg-blue-700 transition-all mt-4 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Generate Batch
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 glass-card flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <Database className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium font-mono text-sm leading-relaxed">
              &gt; SYSTEM_IDLE: Awaiting synthesis parameters...<br/>
              &gt; GPU_CLUSTER: Ready
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
