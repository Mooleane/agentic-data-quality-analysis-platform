/**
 * Data Analysis Module
 * Provides functions for analyzing data quality, calculating metrics, and generating insights
 */

/**
 * Analyze overall data quality
 * @param {Array} data - Array of objects representing the dataset
 * @param {string} fileName - Name of the file being analyzed
 * @returns {Object} Analysis results including metrics and quality scores
 */
export function analyzeDataQuality(data, fileName) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      error: 'Invalid or empty dataset',
      fileName,
      rowCount: 0,
      columnCount: 0,
    };
  }

  const rowCount = data.length;
  const columns = Object.keys(data[0]);
  const columnCount = columns.length;

  // Analyze each column
  const columnAnalysis = analyzeColumns(data, columns);

  // Calculate quality metrics
  const metrics = calculateQualityMetrics(data, columnAnalysis);

  // Generate recommendations
  const recommendations = generateRecommendations(columnAnalysis, metrics);

  return {
    fileName,
    rowCount,
    columnCount,
    columns,
    data: data.slice(0, 100), // Store first 100 rows for preview
    columnAnalysis,
    metrics,
    recommendations,
    qualityScore: Math.round(metrics.overallQuality),
    dataTypes: identifyDataTypes(data, columns),
  };
}

/**
 * Analyze individual columns
 * @param {Array} data - Dataset
 * @param {Array} columns - Column names
 * @returns {Object} Column statistics
 */
function analyzeColumns(data, columns) {
  const analysis = {};

  columns.forEach((column) => {
    const values = data.map((row) => row[column]);

    const nullCount = values.filter(
      (v) => v === null || v === undefined || v === '' || v === 'null' || v === 'undefined'
    ).length;

    const uniqueCount = new Set(
      values.filter((v) => v !== null && v !== undefined && v !== '')
    ).size;

    const stats = {
      column,
      totalCount: data.length,
      nullCount,
      nullPercentage: ((nullCount / data.length) * 100).toFixed(2),
      uniqueCount,
      uniquePercentage: ((uniqueCount / data.length) * 100).toFixed(2),
      duplicateCount: data.length - uniqueCount,
      dataType: inferDataType(values),
      sampleValues: values
        .filter((v) => v !== null && v !== undefined && v !== '')
        .slice(0, 5),
      issues: [],
    };

    // Detect specific issues
    if (stats.nullPercentage > 20) {
      stats.issues.push({
        type: 'high_null_values',
        severity: 'warning',
        message: `${stats.nullPercentage}% of values are missing`,
      });
    }

    if (stats.dataType === 'numeric') {
      const numValues = values
        .filter((v) => v !== null && v !== undefined && v !== '')
        .map(Number);
      const outliers = detectOutliers(numValues);
      if (outliers.count > 0) {
        stats.issues.push({
          type: 'outliers_detected',
          severity: 'info',
          message: `${outliers.count} potential outliers detected`,
          outlierCount: outliers.count,
        });
      }
      stats.min = Math.min(...numValues);
      stats.max = Math.max(...numValues);
      stats.mean = (numValues.reduce((a, b) => a + b, 0) / numValues.length).toFixed(2);
      stats.median = calculateMedian(numValues).toFixed(2);
    }

    if (stats.dataType === 'email') {
      const invalidEmails = values.filter(
        (v) => v && !isValidEmail(v)
      ).length;
      if (invalidEmails > 0) {
        stats.issues.push({
          type: 'invalid_emails',
          severity: 'error',
          message: `${invalidEmails} invalid email addresses detected`,
          invalidCount: invalidEmails,
        });
      }
    }

    analysis[column] = stats;
  });

  return analysis;
}

/**
 * Calculate overall quality metrics
 * @param {Array} data - Dataset
 * @param {Object} columnAnalysis - Column analysis results
 * @returns {Object} Quality metrics
 */
function calculateQualityMetrics(data, columnAnalysis) {
  const columns = Object.keys(columnAnalysis);
  let completenessScore = 0;
  let consistencyScore = 0;
  let accuracyScore = 0;
  let validityScore = 0;

  columns.forEach((col) => {
    const analysis = columnAnalysis[col];

    // Completeness: percentage of non-null values
    completenessScore += (1 - analysis.nullCount / analysis.totalCount) * 100;

    // Consistency: based on data type consistency
    consistencyScore += 100 - Math.abs(analysis.duplicateCount / analysis.totalCount) * 50;

    // Accuracy: based on data validation
    const issueCount = analysis.issues.filter((i) => i.severity === 'error').length;
    accuracyScore += Math.max(0, 100 - issueCount * 20);

    // Validity: based on data type and format
    validityScore += 100 - analysis.issues.filter((i) => i.severity === 'error').length * 25;
  });

  completenessScore = (completenessScore / columns.length).toFixed(2);
  consistencyScore = Math.min(100, (consistencyScore / columns.length).toFixed(2));
  accuracyScore = (accuracyScore / columns.length).toFixed(2);
  validityScore = Math.min(100, (validityScore / columns.length).toFixed(2));

  const overallQuality = (
    (parseFloat(completenessScore) +
      parseFloat(consistencyScore) +
      parseFloat(accuracyScore) +
      parseFloat(validityScore)) /
    4
  ).toFixed(2);

  return {
    completeness: parseFloat(completenessScore),
    consistency: parseFloat(consistencyScore),
    accuracy: parseFloat(accuracyScore),
    validity: parseFloat(validityScore),
    overallQuality: parseFloat(overallQuality),
  };
}

/**
 * Generate recommendations for data improvement
 * @param {Object} columnAnalysis - Column analysis
 * @param {Object} metrics - Quality metrics
 * @returns {Array} Array of recommendations
 */
function generateRecommendations(columnAnalysis, metrics) {
  const recommendations = [];

  // Check for columns with high null values
  Object.values(columnAnalysis).forEach((col) => {
    if (col.nullPercentage > 20) {
      recommendations.push({
        priority: 'high',
        category: 'missing_data',
        column: col.column,
        suggestion: `Address missing values in "${col.column}" (${col.nullPercentage}% missing). Consider: removing rows, imputation, or validation.`,
        sqlHint: `SELECT COUNT(*) FROM table WHERE ${col.column} IS NULL;`,
      });
    }

    if (col.issues.length > 0) {
      col.issues.forEach((issue) => {
        recommendations.push({
          priority: issue.severity === 'error' ? 'high' : 'medium',
          category: issue.type,
          column: col.column,
          suggestion: issue.message,
        });
      });
    }
  });

  // Overall recommendations
  if (metrics.overallQuality < 70) {
    recommendations.push({
      priority: 'high',
      category: 'overall_quality',
      suggestion:
        'Overall data quality is below acceptable levels. Consider: data validation, cleansing, and standardization.',
    });
  }

  return recommendations.slice(0, 10); // Limit to 10 recommendations
}

/**
 * Infer data type of a column
 * @param {Array} values - Column values
 * @returns {string} Inferred data type
 */
function inferDataType(values) {
  const nonNullValues = values.filter(
    (v) => v !== null && v !== undefined && v !== ''
  );

  if (nonNullValues.length === 0) return 'unknown';

  // Check for email
  if (nonNullValues.every((v) => isValidEmail(v))) {
    return 'email';
  }

  // Check for boolean
  if (
    nonNullValues.every((v) =>
      ['true', 'false', '1', '0', 'yes', 'no'].includes(String(v).toLowerCase())
    )
  ) {
    return 'boolean';
  }

  // Check for date
  if (nonNullValues.every((v) => isValidDate(v))) {
    return 'date';
  }

  // Check for numeric
  if (nonNullValues.every((v) => !isNaN(Number(v)) && Number(v).toString() === v.toString())) {
    return 'numeric';
  }

  // Check for URL
  if (nonNullValues.every((v) => isValidURL(v))) {
    return 'url';
  }

  return 'text';
}

/**
 * Identify all data types in the dataset
 * @param {Array} data - Dataset
 * @param {Array} columns - Column names
 * @returns {Object} Data types by column
 */
function identifyDataTypes(data, columns) {
  const types = {};
  columns.forEach((col) => {
    const values = data.map((row) => row[col]);
    types[col] = inferDataType(values);
  });
  return types;
}

/**
 * Check if a value is a valid email
 * @param {*} value - Value to check
 * @returns {boolean}
 */
function isValidEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(value));
}

/**
 * Check if a value is a valid date
 * @param {*} value - Value to check
 * @returns {boolean}
 */
function isValidDate(value) {
  if (!value) return false;
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
}

/**
 * Check if a value is a valid URL
 * @param {*} value - Value to check
 * @returns {boolean}
 */
function isValidURL(value) {
  try {
    new URL(String(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Detect outliers in numeric data using IQR method
 * @param {Array} values - Numeric values
 * @returns {Object} Outlier information
 */
function detectOutliers(values) {
  if (values.length < 4) return { count: 0, values: [] };

  const sorted = values.sort((a, b) => a - b);
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const outliers = values.filter((v) => v < lowerBound || v > upperBound);

  return {
    count: outliers.length,
    values: outliers,
    bounds: { lower: lowerBound, upper: upperBound },
  };
}

/**
 * Calculate median of numeric values
 * @param {Array} values - Numeric values
 * @returns {number} Median
 */
function calculateMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

/**
 * Generate data type distribution
 * @param {Object} dataTypes - Data types by column
 * @returns {Object} Distribution counts
 */
export function generateDataTypeDistribution(dataTypes) {
  const distribution = {};
  Object.values(dataTypes).forEach((type) => {
    distribution[type] = (distribution[type] || 0) + 1;
  });
  return distribution;
}

/**
 * Calculate data quality trend
 * @param {Object} previousMetrics - Previous metrics
 * @param {Object} currentMetrics - Current metrics
 * @returns {Object} Trend analysis
 */
export function calculateQualityTrend(previousMetrics, currentMetrics) {
  if (!previousMetrics) {
    return { trend: 'initial', change: 0 };
  }

  const change = currentMetrics.overallQuality - previousMetrics.overallQuality;
  const trend = change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable';

  return {
    trend,
    change: change.toFixed(2),
    percentChange: ((change / previousMetrics.overallQuality) * 100).toFixed(2),
  };
}
