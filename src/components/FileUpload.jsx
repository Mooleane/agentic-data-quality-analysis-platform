'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { analyzeDataQuality } from '../lib/dataAnalysis';
import '../styles/FileUpload.css';

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const processFile = async (file) => {
    try {
      setUploading(true);
      setError(null);

      // Validate file
      if (!file) {
        setError('No file selected');
        setUploading(false);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`File size exceeds 50MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        setUploading(false);
        return;
      }

      const fileExtension = file.name.split('.').pop().toLowerCase();
      const supportedFormats = ['csv', 'json', 'xlsx', 'xls'];

      if (!supportedFormats.includes(fileExtension)) {
        setError(`Unsupported file format: .${fileExtension}. Supported: CSV, JSON, Excel`);
        setUploading(false);
        return;
      }

      setFileName(file.name);

      // Parse based on file type
      let parsedData = [];

      if (fileExtension === 'csv') {
        // Parse CSV
        await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            dynamicTyping: false,
            skipEmptyLines: true,
            complete: (results) => {
              if (results.errors && results.errors.length > 0) {
                reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
              } else {
                parsedData = results.data;
                resolve();
              }
            },
            error: (error) => {
              reject(error);
            },
          });
        });
      } else if (fileExtension === 'json') {
        // Parse JSON
        const text = await file.text();
        parsedData = JSON.parse(text);
        if (!Array.isArray(parsedData)) {
          throw new Error('JSON file must contain an array of objects');
        }
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // For Excel, we'll use Papa Parse with a workaround or notify user
        setError(
          'Excel files require additional processing. Please convert to CSV or JSON first.'
        );
        setUploading(false);
        return;
      }

      if (!parsedData || parsedData.length === 0) {
        setError('File is empty or contains no valid data');
        setUploading(false);
        return;
      }

      // Analyze data quality
      const analysisResults = analyzeDataQuality(parsedData, file.name);

      // Store in session storage
      sessionStorage.setItem('analysisData', JSON.stringify(analysisResults));
      sessionStorage.setItem('rawData', JSON.stringify(parsedData));

      // Navigate to analysis page
      router.push('/analysis');
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while processing the file';
      setError(errorMessage);
      setUploading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-wrapper">
      <div
        className={`file-upload-zone ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerFileInput();
          }
        }}
        aria-label="File upload area. Press Enter or Space to select a file, or drag and drop a file here."
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          className="file-input"
          accept=".csv,.json,.xlsx,.xls"
          disabled={uploading}
          aria-label="Select a CSV, JSON, or Excel file"
        />

        {uploading ? (
          <div className="upload-progress">
            <div className="progress-spinner"></div>
            <p>Processing {fileName}...</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📤</div>
            <h3>Drag & Drop Your File Here</h3>
            <p className="upload-or">or</p>
            <button className="upload-button" type="button">
              Choose File
            </button>
            <p className="upload-formats">
              Supported formats: <strong>CSV, JSON, Excel</strong>
            </p>
            <p className="upload-limit">Maximum file size: 50MB</p>
          </>
        )}
      </div>

      {error && (
        <div className="upload-error" role="alert">
          <span className="error-icon">⚠️</span>
          <div className="error-content">
            <p className="error-title">Upload Error</p>
            <p className="error-message">{error}</p>
          </div>
          <button
            className="error-close"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {fileName && !error && (
        <div className="upload-success" role="status">
          <span className="success-icon">✓</span>
          <p>
            <strong>{fileName}</strong> uploaded successfully. Analyzing...
          </p>
        </div>
      )}
    </div>
  );
}
