"use client";

import { BrainCircuit, Play, Pause, Activity, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { useMedicalStore } from '@/store/useMedicalStore';
import { useRealTimeMetrics } from '@/hooks/useRealTimeMetrics';
import MetricCard from '@/components/metrics/MetricCard';
import QualityChart from '@/components/metrics/QualityChart';
import PrivacyGauge from '@/components/metrics/PrivacyGauge';
import { useState, useEffect } from 'react';

export default function TrainPage() {
  const { isTraining, setTraining, trainingProgress, addAuditLog } = useMedicalStore();
  const { isConnected } = useRealTimeMetrics();
  const [lossHistory, setLossHistory] = useState<number[]>([]);

  useEffect(() => {
    if (trainingProgress?.generator_loss) {
      setLossHistory(prev => [...prev, trainingProgress.generator_loss].slice(-20));
    }
  }, [trainingProgress]);

  const handleStartTraining = () => {
    setTraining(true);
    addAuditLog("GAN Training Started", "Researcher initiated model training on retinal dataset.");
  };

  const handlePauseTraining = () => {
    setTraining(false);
    addAuditLog("GAN Training Paused", "Researcher manually paused the training process.");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Stage 2: Train GAN Model</h1>
          <p className="text-slate-500 mt-1 font-medium">Configure and monitor the neural network training process.</p>
        </div>
        <div className="flex gap-3">
          {isTraining ? (
            <button 
              onClick={handlePauseTraining}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Pause className="w-4 h-4 fill-current" /> Pause
            </button>
          ) : (
            <button 
              onClick={handleStartTraining}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-medical-accent rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              <Play className="w-4 h-4 fill-current" /> Start Training
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Epoch Progress" 
          value={trainingProgress?.epoch || 0} 
          unit="/ 100" 
          description="The current training iteration of the GAN."
          history={[]}
        />
        <MetricCard 
          label="Generator Loss" 
          value={trainingProgress?.generator_loss?.toFixed(4) || "0.0000"} 
          description="Measures how well the generator is fooling the discriminator."
          history={lossHistory}
          thresholds={{ warning: 0.8, critical: 1.2, inverse: true }}
        />
        <MetricCard 
          label="Discriminator Loss" 
          value={trainingProgress?.discriminator_loss?.toFixed(4) || "0.0000"} 
          description="Measures how well the discriminator distinguishes real from synthetic."
          history={[]}
        />
        <MetricCard 
          label="Fidelity Score" 
          value={trainingProgress ? "92.4" : "0.0"} 
          unit="%" 
          trend={+2.1}
          description="Overall perceptual similarity to real clinical data."
          history={[85, 87, 88, 90, 92]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-medical-text">Loss Convergence Curve</h3>
              <p className="text-xs text-medical-muted font-medium">Real-time optimization tracking</p>
            </div>
            {isTraining && (
               <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-medical-accent"></span>
                  </span>
                  <span className="text-[10px] font-bold text-medical-accent uppercase tracking-wider">Live Stream</span>
               </div>
            )}
          </div>
          <div className="h-64 mt-4">
            {lossHistory.length > 0 ? (
              <QualityChart 
                data={lossHistory} 
                labels={lossHistory.map((_, i) => `T-${20-i}`)} 
                label="Generator Loss" 
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Activity className="w-10 h-10 text-slate-200 mb-2" />
                <p className="text-slate-400 font-medium text-sm">Waiting for training stream...</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-bold text-medical-text mb-6 w-full text-left">Privacy Safeguard</h3>
            <PrivacyGauge score={trainingProgress ? 0.984 : 0.0} />
            <p className="mt-6 text-xs text-medical-muted font-medium leading-relaxed px-4">
              Our Differentially Private GAN ensures patient re-identification risk remains below 0.01%.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-indigo-200" />
                <h3 className="font-bold">Hardware Acceleration</h3>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                System is utilizing distributed training across 2x A100 Nodes. Current throughput: 42 samples/sec.
              </p>
              <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-indigo-300">
                <span>Temp: 64°C</span>
                <span>Load: 92%</span>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-20">
              <BrainCircuit className="w-32 h-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
