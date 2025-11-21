'use client';

import { useEffect, useState } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import DataPreview from '@/components/data/DataPreview';
import QualityScore from '@/components/data/QualityScore';
import DataVisualizations from '@/components/data/DataVisualizations';
import ColumnDetails from '@/components/data/ColumnDetails';
import AIInsights from '@/components/data/AIInsights';
import '../../styles/AnalysisPage.css';

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve analysis data from session storage
    const storedData = sessionStorage.getItem('analysisData');
    if (storedData) {
      try {
        setAnalysisData(JSON.parse(storedData));
      } catch (err) {
        setError('Failed to load analysis data');
      }
    } else {
      setError('No analysis data found. Please upload a file first.');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="analysis-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analysis-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <a href="/" className="back-link">
            ← Back to Upload
          </a>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="analysis-container">
        <header className="analysis-header">
          <div className="header-content">
            <h1>Data Quality Analysis</h1>
            {analysisData?.fileName && (
              <p className="file-info">
                File: <strong>{analysisData.fileName}</strong>
                {analysisData.rowCount && analysisData.columnCount && (
                  <span>
                    ({analysisData.rowCount} rows × {analysisData.columnCount} columns)
                  </span>
                )}
              </p>
            )}
          </div>
          <a href="/" className="back-link">
            ← Upload New File
          </a>
        </header>

        <main className="analysis-main">
          <div className="analysis-grid">
            {/* Quality Score Section */}
            <section className="analysis-section quality-section">
              <QualityScore data={analysisData} />
            </section>

            {/* Data Preview Section */}
            <section className="analysis-section preview-section">
              <DataPreview data={analysisData} />
            </section>

            {/* Visualizations Section */}
            <section className="analysis-section visualization-section">
              <DataVisualizations data={analysisData} />
            </section>

            {/* Column Details Section */}
            <section className="analysis-section details-section">
              <ColumnDetails data={analysisData} />
            </section>

            {/* AI Insights Section */}
            <section className="analysis-section insights-section">
              <AIInsights data={analysisData} />
            </section>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
