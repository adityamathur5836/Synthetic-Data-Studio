import axios from 'axios';
import {
    PatientData,
    SyntheticSample,
    AnalyticsMetrics,
    UploadResponse,
    Dataset
} from '../types/medical';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const medicalApi = {
    // Authentication placeholder (if needed later)
    setAuthToken: (token: string) => {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    // Core Endpoints
    generateData: async (patientData: PatientData, count: number = 1): Promise<SyntheticSample[]> => {
        const response = await apiClient.post(`/generate?count=${count}`, patientData);
        return response.data;
    },

    getAnalytics: async (): Promise<AnalyticsMetrics> => {
        const response = await apiClient.get('/analytics');
        return response.data;
    },

    uploadDataset: async (files: File[]): Promise<UploadResponse> => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        const response = await apiClient.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // For streaming training data, we use standard EventSource
    getTrainingStreamUrl: () => `${API_BASE_URL}/train`,

    getHealth: async () => {
        const response = await apiClient.get('/health', { baseURL: 'http://localhost:8000' });
        return response.data;
    }
};
