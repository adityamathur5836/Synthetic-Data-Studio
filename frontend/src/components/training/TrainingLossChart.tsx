"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useMedicalStore } from '@/store/useMedicalStore';
import { useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TrainingLossChart() {
  const { trainingHistory } = useMedicalStore();

  // Mock data for demonstration if no history exists
  const mockData = useMemo(() => {
    const labels = Array.from({ length: 20 }, (_, i) => `Epoch ${i + 1}`);
    const gLoss = Array.from({ length: 20 }, () => Math.random() * 0.5 + 0.1);
    const dLoss = Array.from({ length: 20 }, () => Math.random() * 0.3 + 0.05);
    const accuracy = Array.from({ length: 20 }, (_, i) => 0.6 + (i * 0.015) + (Math.random() * 0.05));

    return {
      labels,
      datasets: [
        {
          label: 'Generator Loss',
          data: gLoss,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.3,
          yAxisID: 'y',
        },
        {
          label: 'Discriminator Loss',
          data: dLoss,
          borderColor: 'rgb(244, 63, 94)',
          backgroundColor: 'rgba(244, 63, 94, 0.5)',
          tension: 0.3,
          yAxisID: 'y',
        },
        {
          label: 'Accuracy (FID Sim)',
          data: accuracy,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          tension: 0.1,
          yAxisID: 'y1',
          borderDash: [5, 5],
        },
      ],
    };
  }, []);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: '#f8fafc',
        },
        title: {
          display: true,
          text: 'Loss Value',
          font: { size: 10, weight: 'bold' }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Accuracy / Similarity',
          font: { size: 10, weight: 'bold' }
        },
        min: 0,
        max: 1
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 10 }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: { size: 10, weight: 'bold' }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 12 },
        bodyFont: { size: 11 },
        cornerRadius: 8,
      }
    }
  };

  return (
    <div className="h-full w-full min-h-[350px]">
      <Line data={mockData} options={options} />
    </div>
  );
}
