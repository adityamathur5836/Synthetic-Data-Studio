import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    SyntheticSample,
    AnalyticsMetrics,
    TrainingMetrics,
    Dataset
} from '@/types/medical';

interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
}

interface PipelineConfig {
    diseasePrevalence: number;
    mildSeverity: number;
    moderateSeverity: number;
    severeSeverity: number;
    ageMin: number;
    ageMax: number;
    noiseLevel: number;
    batchSize: number;
}

interface ResourceUsage {
    gpuMemory: number;
    gpuLoad: number;
    cpuLoad: number;
    diskSpace: number;
}

interface GalleryFilters {
    condition?: string;
    minConfidence: number;
    severity?: string;
    gender?: string;
    flaggedOnly: boolean;
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
    pipelineConfig: PipelineConfig;
    resourceUsage: ResourceUsage;

    // Gallery State
    galleryFilters: GalleryFilters;

    setSamples: (samples: SyntheticSample[]) => void;
    updateSample: (id: string, updates: Partial<SyntheticSample>) => void;
    addSamples: (samples: SyntheticSample[]) => void;
    setAnalytics: (analytics: AnalyticsMetrics) => void;
    setTrainingProgress: (progress: TrainingMetrics) => void;
    setGenerating: (isGenerating: boolean) => void;
    setTraining: (isTraining: boolean) => void;
    setActiveDataset: (dataset: Dataset | null) => void;
    setCurrentStep: (step: number) => void;
    addAuditLog: (action: string, details: string) => void;
    setPipelineConfig: (config: Partial<PipelineConfig>) => void;
    setResourceUsage: (usage: Partial<ResourceUsage>) => void;
    setGalleryFilters: (filters: Partial<GalleryFilters>) => void;
    resetPipeline: () => void;
}

const defaultPipelineConfig: PipelineConfig = {
    diseasePrevalence: 0.1,
    mildSeverity: 0.4,
    moderateSeverity: 0.3,
    severeSeverity: 0.3,
    ageMin: 18,
    ageMax: 65,
    noiseLevel: 0.05,
    batchSize: 32,
};

const defaultResourceUsage: ResourceUsage = {
    gpuMemory: 0,
    gpuLoad: 0,
    cpuLoad: 0,
    diskSpace: 0,
};

const defaultGalleryFilters: GalleryFilters = {
    minConfidence: 0.7,
    flaggedOnly: false,
};

export const useMedicalStore = create<MedicalState>()(
    persist(
        (set) => ({
            samples: [],
            analytics: null,
            trainingProgress: null,
            activeDataset: null,
            isGenerating: false,
            isTraining: false,
            currentStep: 1,
            auditLogs: [],
            pipelineConfig: defaultPipelineConfig,
            resourceUsage: defaultResourceUsage,
            galleryFilters: defaultGalleryFilters,

            setSamples: (samples: SyntheticSample[]) => set({ samples }),
            updateSample: (id: string, updates: Partial<SyntheticSample>) => set((state: MedicalState) => ({
                samples: state.samples.map(s => s.id === id ? { ...s, ...updates } : s)
            })),
            addSamples: (newSamples: SyntheticSample[]) => set((state: MedicalState) => ({
                samples: [...state.samples, ...newSamples]
            })),
            setAnalytics: (analytics: AnalyticsMetrics) => set({ analytics }),
            setTrainingProgress: (progress: TrainingMetrics) => set({ trainingProgress: progress }),
            setGenerating: (isGenerating: boolean) => set({ isGenerating }),
            setTraining: (isTraining: boolean) => set({ isTraining }),
            setActiveDataset: (dataset: Dataset | null) => set({ activeDataset: dataset }),
            setCurrentStep: (step: number) => set({ currentStep: step }),
            addAuditLog: (action: string, details: string) => set((state: MedicalState) => ({
                auditLogs: [
                    {
                        id: Math.random().toString(36).substring(2, 9),
                        timestamp: new Date().toISOString(),
                        user: "Researcher Alpha",
                        action,
                        details
                    },
                    ...state.auditLogs
                ]
            })),
            setPipelineConfig: (config: Partial<PipelineConfig>) => set((state: MedicalState) => ({
                pipelineConfig: { ...state.pipelineConfig, ...config }
            })),
            setResourceUsage: (usage: Partial<ResourceUsage>) => set((state: MedicalState) => ({
                resourceUsage: { ...state.resourceUsage, ...usage }
            })),
            setGalleryFilters: (filters: Partial<GalleryFilters>) => set((state: MedicalState) => ({
                galleryFilters: { ...state.galleryFilters, ...filters }
            })),
            resetPipeline: () => set({
                trainingProgress: null,
                isTraining: false,
                isGenerating: false,
                pipelineConfig: defaultPipelineConfig,
                resourceUsage: defaultResourceUsage,
                samples: [],
                galleryFilters: defaultGalleryFilters
            })
        }),
        {
            name: 'medical-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state: MedicalState) => ({
                pipelineConfig: state.pipelineConfig,
                auditLogs: state.auditLogs,
                currentStep: state.currentStep,
                galleryFilters: state.galleryFilters
            }),
        }
    )
);
