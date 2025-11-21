'use client';

import '../../styles/QualityScore.css';

export default function QualityScore({ data }) {
  if (!data || !data.metrics) {
    return (
      <div className="quality-score">
        <h2>Quality Score</h2>
        <p className="score-empty">No quality data available</p>
      </div>
    );
  }

  const { qualityScore = 0, metrics = {} } = data;

  const getScoreColor = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  // Calculate trend from previous analysis
  const getTrend = () => {
    try {
      const stored = localStorage.getItem('previousQualityScore');
      if (stored) {
        const prev = parseFloat(stored);
        if (qualityScore > prev) return { direction: 'up', change: qualityScore - prev };
        if (qualityScore < prev) return { direction: 'down', change: prev - qualityScore };
      }
      return null;
    } catch {
      return null;
    }
  };

  const trend = getTrend();

  return (
    <div className="quality-score">
      <h2>Data Quality Score</h2>

      <div className={`score-display ${getScoreColor(qualityScore)}`}>
        <div className="score-circle" role="img" aria-label={`Quality score: ${qualityScore} out of 100`}>
          <span className="score-value">{qualityScore}</span>
          <span className="score-max">/100</span>
        </div>
        <p className="score-label">{getScoreLabel(qualityScore)}</p>
        {trend && (
          <p className={`score-trend trend-${trend.direction}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.change.toFixed(1)} points {trend.direction === 'up' ? 'improvement' : 'decline'}
          </p>
        )}
      </div>

      <div className="metrics-breakdown">
        <h3>Metrics Breakdown</h3>

        <div className="metric-item">
          <div className="metric-label">
            <span>Completeness</span>
            <span className="metric-value">{metrics.completeness?.toFixed(1) || 0}%</span>
          </div>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{ width: `${metrics.completeness || 0}%` }}
              role="progressbar"
              aria-valuenow={metrics.completeness}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Completeness metric"
            ></div>
          </div>
          <p className="metric-description">Percentage of non-null values in dataset</p>
        </div>

        <div className="metric-item">
          <div className="metric-label">
            <span>Consistency</span>
            <span className="metric-value">{metrics.consistency?.toFixed(1) || 0}%</span>
          </div>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{ width: `${metrics.consistency || 0}%` }}
              role="progressbar"
              aria-valuenow={metrics.consistency}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Consistency metric"
            ></div>
          </div>
          <p className="metric-description">Uniformity and standardization of data</p>
        </div>

        <div className="metric-item">
          <div className="metric-label">
            <span>Accuracy</span>
            <span className="metric-value">{metrics.accuracy?.toFixed(1) || 0}%</span>
          </div>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{ width: `${metrics.accuracy || 0}%` }}
              role="progressbar"
              aria-valuenow={metrics.accuracy}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Accuracy metric"
            ></div>
          </div>
          <p className="metric-description">Correctness of data values</p>
        </div>

        <div className="metric-item">
          <div className="metric-label">
            <span>Validity</span>
            <span className="metric-value">{metrics.validity?.toFixed(1) || 0}%</span>
          </div>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{ width: `${metrics.validity || 0}%` }}
              role="progressbar"
              aria-valuenow={metrics.validity}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Validity metric"
            ></div>
          </div>
          <p className="metric-description">Compliance with expected formats</p>
        </div>
      </div>

      <div className="score-guidance">
        {qualityScore >= 90 && <p>✓ Excellent! This dataset is ready for analysis.</p>}
        {qualityScore >= 70 && qualityScore < 90 && (
          <p>◐ Good! Consider addressing the flagged issues for better quality.</p>
        )}
        {qualityScore >= 50 && qualityScore < 70 && (
          <p>⚠ Fair - Data quality needs improvement. Review recommendations.</p>
        )}
        {qualityScore < 50 && (
          <p>✗ Poor - Significant data quality issues detected. Action needed.</p>
        )}
      </div>

      {/* Store current score for trend calculation next time */}
      {typeof window !== 'undefined' && localStorage.setItem('previousQualityScore', qualityScore.toString())}
    </div>
  );
}
