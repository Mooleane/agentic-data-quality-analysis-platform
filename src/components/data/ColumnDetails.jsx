'use client';

import { useState } from 'react';
import '../../styles/ColumnDetails.css';

export default function ColumnDetails({ data }) {
  const [expandedColumn, setExpandedColumn] = useState(null);

  if (!data || !data.columnAnalysis) {
    return (
      <div className="column-details">
        <h2>Column Analysis</h2>
        <p className="details-empty">No column data available</p>
      </div>
    );
  }

  const columns = Object.values(data.columnAnalysis);

  const toggleColumn = (columnName) => {
    setExpandedColumn(expandedColumn === columnName ? null : columnName);
  };

  return (
    <div className="column-details">
      <h2>Column-by-Column Analysis</h2>

      <div className="columns-list">
        {columns.map((col) => (
          <div key={col.column} className="column-card">
            <button
              className={`column-header ${expandedColumn === col.column ? 'expanded' : ''}`}
              onClick={() => toggleColumn(col.column)}
              aria-expanded={expandedColumn === col.column}
            >
              <span className="column-name">{col.column}</span>
              <span className="column-type-badge">{col.dataType}</span>
              {col.issues.length > 0 && (
                <span className="issues-indicator" aria-label={`${col.issues.length} issues`}>
                  ⚠ {col.issues.length}
                </span>
              )}
              <span className="expand-icon">{expandedColumn === col.column ? '−' : '+'}</span>
            </button>

            {expandedColumn === col.column && (
              <div className="column-details-expanded">
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Data Type:</span>
                    <span className="detail-value">{col.dataType}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Non-Null Values:</span>
                    <span className="detail-value">
                      {col.totalCount - col.nullCount} / {col.totalCount}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Missing Values:</span>
                    <span className="detail-value">{col.nullPercentage}%</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Unique Values:</span>
                    <span className="detail-value">{col.uniqueCount}</span>
                  </div>

                  {col.dataType === 'numeric' && (
                    <>
                      <div className="detail-item">
                        <span className="detail-label">Min:</span>
                        <span className="detail-value">{col.min}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Max:</span>
                        <span className="detail-value">{col.max}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Mean:</span>
                        <span className="detail-value">{col.mean}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Median:</span>
                        <span className="detail-value">{col.median}</span>
                      </div>
                    </>
                  )}
                </div>

                {col.sampleValues && col.sampleValues.length > 0 && (
                  <div className="sample-values">
                    <h4>Sample Values</h4>
                    <ul>
                      {col.sampleValues.map((val, idx) => (
                        <li key={idx}>{val}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {col.issues.length > 0 && (
                  <div className="issues-list">
                    <h4>Issues Detected</h4>
                    <ul role="list">
                      {col.issues.map((issue, idx) => (
                        <li key={idx} className={`issue-${issue.severity}`} role="listitem">
                          <span className="issue-severity">{issue.severity}</span>
                          <span className="issue-message">{issue.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
