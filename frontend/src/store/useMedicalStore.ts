import { create } from 'zustand';
import {
    SyntheticSample,
    AnalyticsMetrics,
    TrainingMetrics,
    Dataset
} from '../types/medical';

interface MedicalState {
    samples: SyntheticSample[];
    analytics: AnalyticsMetrics | null;
    trainingProgress: TrainingMetrics | null;
    activeDataset: Dataset | null;
    isGenerating: boolean;
    isTraining: boolean;

    setSamples: (samples: SyntheticSample[]) => void;
    addSamples: (samples: SyntheticSample[]) => void;
    setAnalytics: (analytics: AnalyticsMetrics) => void;
    setTrainingProgress: (progress: TrainingMetrics) => void;
    setGenerating: (isGenerating: boolean) => void;
    setTraining: (isTraining: boolean) => void;
    setActiveDataset: (dataset: Dataset | null) => void;
}

export const useMedicalStore = create<MedicalState>((set) => ({
    samples: [],
    analytics: null,
    trainingProgress: null,
    activeDataset: null,
    isGenerating: false,
    isTraining: false,

    setSamples: (samples) => set({ samples }),
    addSamples: (newSamples) => set((state) => ({ samples: [...newSamples, ...state.samples] })),
    setAnalytics: (analytics) => set({ analytics }),
    setTrainingProgress: (trainingProgress) => set({ trainingProgress }),
    setGenerating: (isGenerating) => set({ isGenerating }),
    setTraining: (isTraining) => set({ isTraining }),
    setActiveDataset: (activeDataset) => set({ activeDataset }),
}));
