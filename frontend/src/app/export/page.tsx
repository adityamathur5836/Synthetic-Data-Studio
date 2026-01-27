"use client";

import { ShieldCheck, Download, ExternalLink, FileJson } from 'lucide-react';
import Link from 'next/link';

export default function ExportPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Stage 5: Export Data</h1>
        <p className="text-slate-500 mt-1 font-medium">Securely download your synthetic dataset for AI training.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card">
            <h3 className="font-bold text-slate-900 mb-6">Available Formats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 group hover:border-medical-accent hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Full Image Dataset (.zip)</p>
                    <p className="text-xs text-slate-500 font-medium italic">High-resolution synthetic scans + metadata JSON</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-bold text-medical-accent border border-medical-accent/20 rounded-lg hover:bg-medical-accent hover:text-white transition-all">
                  Generate Zip
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 group hover:border-medical-accent hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                    <FileJson className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Metadata Table (.csv/.json)</p>
                    <p className="text-xs text-slate-500 font-medium italic">Anonymized tabular data only</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-bold text-amber-600 border border-amber-600/20 rounded-lg hover:bg-amber-600 hover:text-white transition-all">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card border-emerald-100 bg-emerald-50/30">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900">Pre-Export Audit</h3>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              All exports pass through a final privacy scrub to ensure no residual PHI is present in synthetic pixels or headers.
            </p>
            <Link href="/privacy" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline">
              View Audit Log <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
