'use client';

import '../../styles/DataPreview.css';

export default function DataPreview({ data }) {
  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="data-preview">
        <h2>Data Preview</h2>
        <p className="preview-empty">No data available for preview</p>
      </div>
    );
  }

  const rows = data.data.slice(0, 10);
  const columns = data.columns || Object.keys(rows[0] || {});

  return (
    <div className="data-preview">
      <h2>Data Preview</h2>
      <div className="preview-container">
        <table className="data-table" role="grid" aria-label="Data preview table">
          <thead>
            <tr>
              <th className="row-number">#</th>
              {columns.map((col) => (
                <th key={col} title={col}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="row-number">{idx + 1}</td>
                {columns.map((col) => (
                  <td key={`${idx}-${col}`} title={String(row[col] || '')}>
                    <span className="cell-content">{String(row[col] || '—')}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="preview-note">
        Showing first {rows.length} of {data.rowCount} rows
      </p>
    </div>
  );
}
