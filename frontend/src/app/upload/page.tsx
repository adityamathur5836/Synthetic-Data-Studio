"use client";

import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { useMedicalStore } from '@/store/useMedicalStore';

export default function UploadPage() {
  const { addAuditLog } = useMedicalStore();

  const handleUpload = () => {
    addAuditLog("Dataset Upload initiated", "Researcher started uploading 5 DICOM files.");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Stage 1: Upload Dataset</h1>
        <p className="text-slate-500 mt-1 font-medium">Upload medical images and metadata to begin the synthesis pipeline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 bg-white flex flex-col items-center justify-center text-center group hover:border-medical-accent transition-colors cursor-pointer" onClick={handleUpload}>
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
              <UploadCloud className="w-8 h-8 text-medical-accent" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Drag and drop medical files</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-xs">Supports DICOM, PNG, JPEG, and CSV metadata files up to 2GB.</p>
            <button className="mt-8 px-6 py-2.5 bg-medical-accent text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
              Select Files
            </button>
          </div>

          <div className="glass-card">
            <h3 className="font-bold text-slate-900 mb-4">Accepted Formats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-sm">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">DICOM</p>
                  <p className="text-xs text-slate-500 font-medium">Medical standard</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Anonymized CSV</p>
                  <p className="text-xs text-slate-500 font-medium">Patient Metadata</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card">
            <h3 className="font-bold text-slate-900 mb-4">Compliance Check</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-medical-success shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Automatic PHI Scrubbing</p>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">System automatically removes PII from DICOM headers during upload.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-medical-success shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Medical Consistency</p>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Cross-validation between metadata and image modality.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Queue Status</p>
            <p className="text-lg font-bold">Idle</p>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium italic">
              "Ready to process incoming biomedical datasets for neural training."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
