'use client';

import { useEffect, useState } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import DataPreview from '../../components/data/DataPreview';
import QualityScore from '../../components/data/QualityScore';
import DataVisualizations from '../../components/data/DataVisualizations';
import ColumnDetails from '../../components/data/ColumnDetails';
import AIInsights from '../../components/data/AIInsights';
import '../../styles/AnalysisPage.css';

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousAnalysis, setPreviousAnalysis] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    // Retrieve analysis data from session storage
    const storedData = sessionStorage.getItem('analysisData');
    if (storedData) {
      try {
        const currentAnalysis = JSON.parse(storedData);
        setAnalysisData(currentAnalysis);

        // Load previous analysis for comparison
        const stored = localStorage.getItem('lastAnalysis');
        if (stored) {
          try {
            setPreviousAnalysis(JSON.parse(stored));
          } catch {
            setPreviousAnalysis(null);
          }
        }

        // Store current as last for next time
        localStorage.setItem('lastAnalysis', storedData);
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

            {/* Comparison Section */}
            {previousAnalysis && (
              <section className="analysis-section comparison-section">
                <div className="comparison-card">
                  <div className="comparison-header">
                    <h3>📊 Before/After Comparison</h3>
                    <button
                      className="comparison-toggle"
                      onClick={() => setShowComparison(!showComparison)}
                      aria-expanded={showComparison}
                    >
                      {showComparison ? '▼ Hide' : '▶ Show'}
                    </button>
                  </div>
                  {showComparison && (
                    <div className="comparison-content">
                      <div className="comparison-item">
                        <div className="comparison-before">
                          <h4>Previous Analysis</h4>
                          <p className="comparison-file">{previousAnalysis.fileName}</p>
                          <div className="comparison-metrics">
                            <div className="metric">
                              <span>Quality Score</span>
                              <span className="metric-value">{previousAnalysis.qualityScore}/100</span>
                            </div>
                            <div className="metric">
                              <span>Completeness</span>
                              <span className="metric-value">{previousAnalysis.metrics?.completeness?.toFixed(1) || 0}%</span>
                            </div>
                            <div className="metric">
                              <span>Consistency</span>
                              <span className="metric-value">{previousAnalysis.metrics?.consistency?.toFixed(1) || 0}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="comparison-arrow">→</div>
                        <div className="comparison-after">
                          <h4>Current Analysis</h4>
                          <p className="comparison-file">{analysisData.fileName}</p>
                          <div className="comparison-metrics">
                            <div className="metric">
                              <span>Quality Score</span>
                              <span className="metric-value">{analysisData.qualityScore}/100</span>
                            </div>
                            <div className="metric">
                              <span>Completeness</span>
                              <span className="metric-value">{analysisData.metrics?.completeness?.toFixed(1) || 0}%</span>
                            </div>
                            <div className="metric">
                              <span>Consistency</span>
                              <span className="metric-value">{analysisData.metrics?.consistency?.toFixed(1) || 0}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="comparison-summary">
                        {analysisData.qualityScore > previousAnalysis.qualityScore ? (
                          <p className="improvement">
                            ✓ Quality improved by {(analysisData.qualityScore - previousAnalysis.qualityScore).toFixed(1)} points
                          </p>
                        ) : analysisData.qualityScore < previousAnalysis.qualityScore ? (
                          <p className="decline">
                            ✗ Quality declined by {(previousAnalysis.qualityScore - analysisData.qualityScore).toFixed(1)} points
                          </p>
                        ) : (
                          <p className="stable">
                            ◐ Quality score remains stable
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

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
