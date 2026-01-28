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

interface BiasMetrics {
    radarData: {
        labels: string[];
        current: number[];
        target: number[];
    };
    suggestions: MitigationSuggestion[];
}

interface MitigationSuggestion {
    id: string;
    text: string;
    impact: string;
    confidence: number;
}

interface GalleryFilters {
    condition?: string;
    minConfidence: number;
    severity?: string;
    gender?: string;
    flaggedOnly: boolean;
}

interface TrainingRun {
    id: string;
    startTime: string;
    endTime?: string;
    parameters: PipelineConfig;
    finalMetrics?: TrainingMetrics;
    status: 'running' | 'completed' | 'failed' | 'stopped';
}

interface ResourceSnapshot {
    timestamp: string;
    usage: ResourceUsage;
}

interface Checkpoint {
    id: string;
    runId: string;
    timestamp: string;
    epoch: number;
    metrics: TrainingMetrics;
    path: string;
}

export type ExportFormat = 'DICOM' | 'NIfTI' | 'PNG' | 'CSV' | 'JSON' | 'PARQUET';

interface ExportTask {
    id: string;
    format: ExportFormat;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    downloadUrl?: string;
    timestamp: string;
    fileCount: number;
}

interface DatasetVersion {
    id: string;
    version: string;
    timestamp: string;
    samplesCount: number;
    fidelityScore: number;
    biasScore: number;
    changelog: string;
    author: string;
}

interface APIKey {
    id: string;
    name: string;
    key: string;
    created: string;
    lastUsed?: string;
    status: 'active' | 'revoked';
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

    // Analytics & Bias State
    biasMetrics: BiasMetrics | null;
    mockAnalytics: any;

    // Training Monitoring State
    trainingHistory: TrainingRun[];
    resourceHistory: ResourceSnapshot[];
    checkpoints: Checkpoint[];
    trainingLogs: string[];

    // Export & Integration State
    datasetVersions: DatasetVersion[];
    apiKeys: APIKey[];
    exportQueue: ExportTask[];

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
    setBiasMetrics: (metrics: BiasMetrics) => void;
    applyMitigation: (suggestionId: string) => void;
    addTrainingLog: (log: string) => void;
    addResourceSnapshot: (usage: ResourceUsage) => void;
    addCheckpoint: (checkpoint: Checkpoint) => void;

    // Export Actions
    addExportTask: (task: ExportTask) => void;
    updateExportTask: (id: string, updates: Partial<ExportTask>) => void;
    addDatasetVersion: (version: DatasetVersion) => void;
    addAPIKey: (key: APIKey) => void;
    revokeAPIKey: (id: string) => void;

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
            biasMetrics: null,
            mockAnalytics: {
                demographics: {
                    age: {
                        labels: ['18-25', '26-40', '41-60', '61-80', '80+'],
                        real: [12, 34, 45, 28, 11],
                        synthetic: [14, 32, 44, 30, 10]
                    },
                    gender: {
                        labels: ['Male', 'Female', 'Other'],
                        real: [48, 51, 1],
                        synthetic: [47, 52, 1]
                    }
                },
                prevalence: [
                    { x: '18-35', y: 'Mild', value: 0.12 },
                    { x: '36-55', y: 'Mild', value: 0.24 },
                    { x: '56+', y: 'Mild', value: 0.18 },
                    { x: '18-35', y: 'Moderate', value: 0.08 },
                    { x: '36-55', y: 'Moderate', value: 0.45 },
                    { x: '56+', y: 'Moderate', value: 0.62 },
                    { x: '18-35', y: 'Severe', value: 0.02 },
                    { x: '36-55', y: 'Severe', value: 0.15 },
                    { x: '56+', y: 'Severe', value: 0.85 }
                ],
                correlation: {
                    attributes: ['Age', 'Severity', 'B-Pressure', 'BMI', 'Glucose'],
                    matrix: [
                        [1.00, 0.65, 0.42, 0.21, 0.38],
                        [0.65, 1.00, 0.58, 0.34, 0.72],
                        [0.42, 0.58, 1.00, 0.12, 0.25],
                        [0.21, 0.34, 0.12, 1.00, 0.44],
                        [0.38, 0.72, 0.25, 0.44, 1.00]
                    ]
                }
            },
            trainingHistory: [],
            resourceHistory: [],
            checkpoints: [],
            trainingLogs: [],
            datasetVersions: [],
            apiKeys: [],
            exportQueue: [],

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
            setGalleryFilters: (filters: Partial<GalleryFilters>) => set((state) => ({
                galleryFilters: { ...state.galleryFilters, ...filters }
            })),
            setBiasMetrics: (metrics: BiasMetrics) => set({ biasMetrics: metrics }),
            applyMitigation: (suggestionId: string) => {
                set((state) => ({
                    auditLogs: [
                        {
                            id: Math.random().toString(36).substring(2, 9),
                            timestamp: new Date().toISOString(),
                            user: "Researcher Alpha",
                            action: "Bias Mitigation Applied",
                            details: `Suggestion applied: ${suggestionId}`
                        },
                        ...state.auditLogs
                    ]
                }));
            },
            addTrainingLog: (log: string) => set((state) => ({
                trainingLogs: [...state.trainingLogs, log].slice(-500) // Keep last 500 logs
            })),
            addResourceSnapshot: (usage: ResourceUsage) => set((state) => ({
                resourceHistory: [...state.resourceHistory, {
                    timestamp: new Date().toISOString(),
                    usage
                }].slice(-100) // Keep last 100 snapshots
            })),
            addCheckpoint: (checkpoint: Checkpoint) => set((state) => ({
                checkpoints: [checkpoint, ...state.checkpoints]
            })),
            addExportTask: (task: ExportTask) => set((state) => ({
                exportQueue: [task, ...state.exportQueue]
            })),
            updateExportTask: (id: string, updates: Partial<ExportTask>) => set((state) => ({
                exportQueue: state.exportQueue.map(t => t.id === id ? { ...t, ...updates } : t)
            })),
            addDatasetVersion: (version: DatasetVersion) => set((state) => ({
                datasetVersions: [version, ...state.datasetVersions]
            })),
            addAPIKey: (apiKey: APIKey) => set((state) => ({
                apiKeys: [apiKey, ...state.apiKeys]
            })),
            revokeAPIKey: (id: string) => set((state) => ({
                apiKeys: state.apiKeys.map(k => k.id === id ? { ...k, status: 'revoked' } : k)
            })),
            resetPipeline: () => set({
                trainingProgress: null,
                isTraining: false,
                isGenerating: false,
                pipelineConfig: defaultPipelineConfig,
                resourceUsage: defaultResourceUsage,
                samples: [],
                galleryFilters: defaultGalleryFilters,
                biasMetrics: null,
                trainingLogs: [],
                resourceHistory: [],
                checkpoints: [],
                exportQueue: [],
                datasetVersions: [],
                apiKeys: []
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
