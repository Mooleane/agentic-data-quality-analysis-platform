/**
 * AI Integration Module
 * Integrates with OpenAI API to generate insights and recommendations
 */

/**
 * Generate AI-powered insights about data quality
 * @param {Object} analysisData - Data quality analysis results
 * @returns {Promise<string>} AI-generated insights
 */
export async function generateAIInsights(analysisData) {
  try {
    const response = await fetch('/api/generateInsights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysisData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      throw new Error(error.error || 'Failed to generate insights');
    }

    const data = await response.json();
    return data.insights;
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw error;
  }
}

/**
 * Generate AI-powered recommendations
 * @param {Object} analysisData - Data quality analysis results
 * @returns {Promise<Array>} AI-generated recommendations
 */
export async function generateAIRecommendations(analysisData) {
  try {
    const response = await fetch('/api/generateRecommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysisData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      throw new Error(error.error || 'Failed to generate recommendations');
    }

    const data = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error('AI Recommendations Error:', error);
    throw error;
  }
}
/**
 * Generate SQL cleaning recommendations
 * @param {Object} analysisData - Data quality analysis results
 * @returns {Promise<Array>} SQL recommendations
 */
export async function generateSQLRecommendations(analysisData) {
  const recommendations = [];

  if (!analysisData.columnAnalysis) {
    return recommendations;
  }

  Object.values(analysisData.columnAnalysis).forEach((col) => {
    // Handle null values
    if (col.nullPercentage > 20) {
      recommendations.push({
        type: 'handle_nulls',
        column: col.column,
        sql: `UPDATE table_name SET ${col.column} = 'default_value' WHERE ${col.column} IS NULL;`,
        description: `Replace NULL values in ${col.column}`,
      });
    }

    // Remove duplicates
    if (col.duplicateCount > 0) {
      recommendations.push({
        type: 'remove_duplicates',
        column: col.column,
        sql: `DELETE FROM table_name WHERE id NOT IN (SELECT MIN(id) FROM table_name GROUP BY ${col.column});`,
        description: `Remove duplicate entries`,
      });
    }

    // Validate formats
    if (col.dataType === 'email' && col.issues.some((i) => i.type === 'invalid_emails')) {
      recommendations.push({
        type: 'validate_format',
        column: col.column,
        sql: `SELECT * FROM table_name WHERE ${col.column} NOT LIKE '%@%.%';`,
        description: `Identify invalid email formats in ${col.column}`,
      });
    }
  });

  return recommendations;
}
