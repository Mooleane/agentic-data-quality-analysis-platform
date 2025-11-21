'use client';

import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { generateDataTypeDistribution } from '@/lib/dataAnalysis';
import '../../styles/DataVisualizations.css';

export default function DataVisualizations({ data }) {
  const chartRef = useRef(null);
  const distributionRef = useRef(null);
  const chartInstance = useRef(null);
  const distributionInstance = useRef(null);

  useEffect(() => {
    if (!data || !data.metrics) return;

    // Metrics chart
    if (chartRef.current && !chartInstance.current) {
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Completeness', 'Consistency', 'Accuracy', 'Validity'],
          datasets: [
            {
              label: 'Quality Metrics',
              data: [
                data.metrics.completeness || 0,
                data.metrics.consistency || 0,
                data.metrics.accuracy || 0,
                data.metrics.validity || 0,
              ],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              pointBackgroundColor: 'rgb(59, 130, 246)',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 20,
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
        },
      });
    }

    // Data type distribution chart
    if (distributionRef.current && !distributionInstance.current && data.dataTypes) {
      const distribution = generateDataTypeDistribution(data.dataTypes);
      const labels = Object.keys(distribution);
      const values = Object.values(distribution);

      const ctx = distributionRef.current.getContext('2d');
      distributionInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                'rgba(16, 185, 129, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(168, 85, 247, 0.8)',
              ],
              borderColor: [
                'rgb(16, 185, 129)',
                'rgb(59, 130, 246)',
                'rgb(245, 158, 11)',
                'rgb(239, 68, 68)',
                'rgb(168, 85, 247)',
              ],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      });
    }

    return () => {
      // Cleanup will happen on unmount
    };
  }, [data]);

  if (!data || !data.metrics) {
    return (
      <div className="data-visualizations">
        <h2>Data Visualizations</h2>
        <p className="viz-empty">No visualization data available</p>
      </div>
    );
  }

  return (
    <div className="data-visualizations">
      <h2>Data Visualizations</h2>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Quality Metrics Overview</h3>
          <canvas
            ref={chartRef}
            role="img"
            aria-label="Radar chart showing quality metrics: completeness, consistency, accuracy, and validity"
          ></canvas>
        </div>

        <div className="chart-container">
          <h3>Data Type Distribution</h3>
          <canvas
            ref={distributionRef}
            role="img"
            aria-label="Doughnut chart showing distribution of data types across columns"
          ></canvas>
        </div>
      </div>

      <div className="visualization-info">
        <h3>What These Charts Show</h3>
        <dl className="info-list">
          <dt>Quality Metrics Radar</dt>
          <dd>
            Shows how well your data performs across four key quality dimensions. Higher values (closer
            to outer edge) indicate better quality in each area.
          </dd>

          <dt>Data Type Distribution</dt>
          <dd>
            Displays the breakdown of column types in your dataset. This helps identify if your data
            structure matches expectations.
          </dd>
        </dl>
      </div>
    </div>
  );
}
