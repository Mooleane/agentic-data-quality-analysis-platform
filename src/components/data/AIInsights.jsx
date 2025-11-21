'use client';

import { useState, useEffect } from 'react';
import { generateAIInsights, generateAIRecommendations } from '@/lib/aiIntegration';
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
              <p>{insights}</p>
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
