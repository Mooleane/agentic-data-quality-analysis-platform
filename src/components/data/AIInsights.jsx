'use client';

import { useState, useEffect } from 'react';
import { generateAIInsights, generateAIRecommendations } from '../../lib/aiIntegration';
import '../../styles/AIInsights.css';

export default function AIInsights({ data }) {
  const [insights, setInsights] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('insights');

  const generateInsights = async () => {
    if (insights) return; // Already generated

    setLoading(true);
    setError(null);

    try {
      const result = await generateAIInsights(data);
      setInsights(result);
    } catch (err) {
      setError('Failed to generate insights');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    if (recommendations) return; // Already generated

    setLoading(true);
    setError(null);

    try {
      const result = await generateAIRecommendations(data);
      setRecommendations(result);
    } catch (err) {
      setError('Failed to generate recommendations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type = 'text') => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${type} copied to clipboard!`);
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const exportReport = () => {
    let reportText = `DATA QUALITY ANALYSIS REPORT\n`;
    reportText += `File: ${data?.fileName || 'Unknown'}\n`;
    reportText += `Generated: ${new Date().toLocaleString()}\n`;
    reportText += `\n=== QUALITY SCORE ===\n${data?.qualityScore}/100\n`;
    reportText += `\n=== INSIGHTS ===\n${insights || 'No insights generated'}\n`;
    reportText += `\n=== RECOMMENDATIONS ===\n`;
    if (Array.isArray(recommendations) && recommendations.length > 0) {
      recommendations.forEach((rec, idx) => {
        reportText += `\n${idx + 1}. ${rec.action}\n   Priority: ${rec.priority}\n   Benefit: ${rec.benefit}\n`;
      });
    } else {
      reportText += 'No recommendations available';
    }

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportText));
    element.setAttribute('download', `quality-report-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    // Auto-generate insights on mount
    if (!insights && !loading) {
      generateInsights();
    }
  }, []);

  return (
    <div className="ai-insights">
      <h2>✨ AI-Powered Insights & Recommendations</h2>

      <div className="insights-tabs">
        <button
          className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          Insights
        </button>
        <button
          className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          Recommendations
        </button>
      </div>

      {error && <div className="insights-error">{error}</div>}

      {activeTab === 'insights' && (
        <div className="insights-panel">
          {loading && <div className="loading-spinner">Generating insights...</div>}

          {insights && !loading && (
            <div className="insights-content">
              <div className="content-with-action">
                <p>{insights}</p>
                <button className="copy-button" onClick={() => copyToClipboard(insights, 'Insights')} aria-label="Copy insights to clipboard">📋 Copy</button>
              </div>
            </div>
          )}

          {!insights && !loading && (
            <button className="generate-button" onClick={generateInsights}>
              Generate AI Insights
            </button>
          )}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="recommendations-panel">
          {loading && <div className="loading-spinner">Generating recommendations...</div>}

          {recommendations && !loading && (
            <div className="recommendations-content">
              {Array.isArray(recommendations) && recommendations.length > 0 ? (
                <div>
                  <ul className="recommendations-list">
                    {recommendations.map((rec, idx) => (
                      <li key={idx} className={`recommendation-item priority-${rec.priority}`}>
                        <div className="rec-header">
                          <span className="priority-badge">{rec.priority}</span>
                          <h4>{rec.action}</h4>
                        </div>
                        {rec.benefit && (
                          <p className="rec-benefit">
                            <strong>Benefit:</strong> {rec.benefit}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <button className="export-button" onClick={exportReport} aria-label="Download report as text file">📥 Download Report</button>
                </div>
              ) : (
                <p className="no-recommendations">
                  {data?.recommendations && data.recommendations.length > 0
                    ? 'Review the column analysis for detailed recommendations'
                    : 'No specific recommendations available'}
                </p>
              )}
            </div>
          )}

          {!recommendations && !loading && (
            <button className="generate-button" onClick={generateRecommendations}>
              Generate Recommendations
            </button>
          )}
        </div>
      )}

      <div className="insights-footer">
        <p className="insights-note">
          💡 <strong>Note:</strong> AI insights are generated based on data analysis. Always validate
          recommendations against your business requirements.
        </p>
      </div>
    </div>
  );
}
