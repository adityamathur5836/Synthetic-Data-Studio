import { create } from 'zustand';
import {
    SyntheticSample,
    AnalyticsMetrics,
    TrainingMetrics,
    Dataset
} from '../types/medical';

interface AuditLog {
    id: string;
    timestamp: string;
    action: string;
    details: string;
    user: string;
}

interface MedicalState {
    samples: SyntheticSample[];
    analytics: AnalyticsMetrics | null;
    trainingProgress: TrainingMetrics | null;
    activeDataset: Dataset | null;
    isGenerating: boolean;
    isTraining: boolean;

    // Pipeline State
    currentStep: number;
    auditLogs: AuditLog[];

    setSamples: (samples: SyntheticSample[]) => void;
    addSamples: (samples: SyntheticSample[]) => void;
    setAnalytics: (analytics: AnalyticsMetrics) => void;
    setTrainingProgress: (progress: TrainingMetrics) => void;
    setGenerating: (isGenerating: boolean) => void;
    setTraining: (isTraining: boolean) => void;
    setActiveDataset: (dataset: Dataset | null) => void;
    setCurrentStep: (step: number) => void;
    addAuditLog: (action: string, details: string) => void;
}

export const useMedicalStore = create<MedicalState>((set) => ({
    samples: [],
    analytics: null,
    trainingProgress: null,
    activeDataset: null,
    isGenerating: false,
    isTraining: false,
    currentStep: 0,
    auditLogs: [],

    setSamples: (samples) => set({ samples }),
    addSamples: (newSamples) => set((state) => ({ samples: [...newSamples, ...state.samples] })),
    setAnalytics: (analytics) => set({ analytics }),
    setTrainingProgress: (trainingProgress) => set({ trainingProgress }),
    setGenerating: (isGenerating) => set({ isGenerating }),
    setTraining: (isTraining) => set({ isTraining }),
    setActiveDataset: (activeDataset) => set({ activeDataset }),
    setCurrentStep: (currentStep) => set({ currentStep }),
    addAuditLog: (action, details) => set((state) => ({
        auditLogs: [
            {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString(),
                action,
                details,
                user: "Dr. Researcher"
            },
            ...state.auditLogs
        ]
    })),
}));
