'use client';

import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import '../styles/HomePage.css';

export default function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1 className="home-title">
            <span className="title-icon">📊</span>
            Data Quality Analysis Platform
          </h1>
          <p className="home-subtitle">
            Analyze your datasets instantly with AI-powered insights
          </p>
        </div>
      </header>

      <main className="home-main">
        <section className="upload-section">
          <div className="upload-card">
            <h2 className="section-title">Upload Your Dataset</h2>
            <p className="section-description">
              Drag and drop your CSV, JSON, or Excel file to get started
            </p>
            <FileUpload />
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">What You Can Do</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Instant Analysis</h3>
              <p>Get comprehensive data quality metrics in seconds</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Insights</h3>
              <p>Receive natural language explanations of data issues</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Visual Reports</h3>
              <p>See data quality metrics with interactive charts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Recommendations</h3>
              <p>Get actionable suggestions to improve your data</p>
            </div>
          </div>
        </section>

        <section className="info-section">
          <div className="info-card">
            <h3>How It Works</h3>
            <ol className="steps-list">
              <li>
                <strong>Upload:</strong> Choose your dataset file (CSV, JSON, or Excel)
              </li>
              <li>
                <strong>Analyze:</strong> Our system automatically processes your data
              </li>
              <li>
                <strong>Review:</strong> Check data quality scores and metrics
              </li>
              <li>
                <strong>Improve:</strong> Follow AI recommendations to enhance data quality
              </li>
            </ol>
          </div>
          <div className="info-card">
            <h3>Supported Formats</h3>
            <ul className="formats-list">
              <li>
                <strong>CSV</strong> - Comma-separated values
              </li>
              <li>
                <strong>JSON</strong> - JavaScript Object Notation
              </li>
              <li>
                <strong>Excel</strong> - .xlsx and .xls files
              </li>
            </ul>
            <p className="file-limit">Maximum file size: 50MB</p>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; 2025 Data Quality Analysis Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
