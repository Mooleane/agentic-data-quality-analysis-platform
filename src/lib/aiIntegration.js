/**
 * AI Integration Module
 * Integrates with OpenAI API to generate insights and recommendations
 */

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-3.5-turbo';

/**
 * Generate AI-powered insights about data quality
 * @param {Object} analysisData - Data quality analysis results
 * @returns {Promise<string>} AI-generated insights
 */
export async function generateAIInsights(analysisData) {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    return generateFallbackInsights(analysisData);
  }

  try {
    const prompt = buildInsightsPrompt(analysisData);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a data quality expert. Analyze the data quality metrics and provide clear, actionable insights for non-technical users. Focus on: 1) What the metrics mean, 2) What issues exist, 3) How to improve. Keep response under 300 words.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      return generateFallbackInsights(analysisData);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || generateFallbackInsights(analysisData);
  } catch (error) {
    console.error('AI Generation Error:', error);
    return generateFallbackInsights(analysisData);
  }
}

/**
 * Generate AI-powered recommendations
 * @param {Object} analysisData - Data quality analysis results
 * @returns {Promise<Array>} AI-generated recommendations
 */
export async function generateAIRecommendations(analysisData) {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    return generateFallbackRecommendations(analysisData);
  }

  try {
    const prompt = buildRecommendationsPrompt(analysisData);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a data quality expert. Provide 3-5 specific, actionable recommendations to improve the dataset. Format as a JSON array with objects containing 'priority' (high/medium/low), 'action', and 'benefit' fields.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      return generateFallbackRecommendations(analysisData);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '[]';

    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return generateFallbackRecommendations(analysisData);
  } catch (error) {
    console.error('AI Recommendations Error:', error);
    return generateFallbackRecommendations(analysisData);
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

/**
 * Build prompt for insights generation
 * @param {Object} analysisData - Data quality analysis
 * @returns {string} Formatted prompt
 */
function buildInsightsPrompt(analysisData) {
  const metrics = analysisData.metrics || {};
  const colCount = Object.keys(analysisData.columnAnalysis || {}).length;
  const issueCount = Object.values(analysisData.columnAnalysis || {}).reduce(
    (sum, col) => sum + (col.issues?.length || 0),
    0
  );

  return `
Dataset: ${analysisData.fileName}
Rows: ${analysisData.rowCount}
Columns: ${colCount}

Quality Metrics:
- Overall Quality Score: ${metrics.overallQuality}/100 (${getQualityLabel(metrics.overallQuality)})
- Completeness: ${metrics.completeness}/100
- Consistency: ${metrics.consistency}/100
- Accuracy: ${metrics.accuracy}/100
- Validity: ${metrics.validity}/100

Issues Found: ${issueCount}

Top Issues:
${Object.values(analysisData.columnAnalysis || {})
  .flatMap((col) => col.issues.slice(0, 2).map((issue) => `- ${col.column}: ${issue.message}`))
  .join('\n')
  .slice(0, 200)}

Please provide a brief analysis explaining these metrics and suggest top 3 improvements.
  `;
}

/**
 * Build prompt for recommendations
 * @param {Object} analysisData - Data quality analysis
 * @returns {string} Formatted prompt
 */
function buildRecommendationsPrompt(analysisData) {
  const metrics = analysisData.metrics || {};
  const issues = Object.values(analysisData.columnAnalysis || {})
    .flatMap((col) => col.issues)
    .slice(0, 5);

  return `
Dataset Issues Summary:
- Quality Score: ${metrics.overallQuality}/100
- Primary Issues: ${issues.map((i) => i.message).join('; ')}

Based on these data quality issues, provide 3-5 specific, actionable recommendations in JSON format:
[
  {"priority": "high", "action": "...", "benefit": "..."},
  ...
]
  `;
}

/**
 * Get quality label based on score
 * @param {number} score - Quality score
 * @returns {string} Quality label
 */
function getQualityLabel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

/**
 * Fallback insights when API is unavailable
 * @param {Object} analysisData - Data quality analysis
 * @returns {string} Fallback insights
 */
function generateFallbackInsights(analysisData) {
  const metrics = analysisData.metrics || {};
  const quality = metrics.overallQuality || 0;

  let insight = `Your dataset has an overall quality score of ${quality.toFixed(0)}/100.\n\n`;

  if (quality >= 90) {
    insight += 'Your data quality is excellent! The dataset is well-maintained with minimal issues.';
  } else if (quality >= 70) {
    insight += 'Your data quality is good, but there are some areas for improvement. Consider addressing the identified issues to enhance reliability.';
  } else if (quality >= 50) {
    insight +=
      'Your data quality needs attention. There are several issues that should be addressed before using this data for critical decisions.';
  } else {
    insight += 'Your data quality is poor. Significant data cleaning and validation work is recommended.';
  }

  insight += '\n\nKey Findings:\n';
  insight += `• Completeness: ${metrics.completeness?.toFixed(0) || 0}% - How much data is present\n`;
  insight += `• Consistency: ${metrics.consistency?.toFixed(0) || 0}% - Data uniformity\n`;
  insight += `• Accuracy: ${metrics.accuracy?.toFixed(0) || 0}% - Data correctness\n`;
  insight += `• Validity: ${metrics.validity?.toFixed(0) || 0}% - Data format validity`;

  return insight;
}

/**
 * Fallback recommendations when API is unavailable
 * @param {Object} analysisData - Data quality analysis
 * @returns {Array} Fallback recommendations
 */
function generateFallbackRecommendations(analysisData) {
  const recommendations = [];

  if (analysisData.recommendations && analysisData.recommendations.length > 0) {
    analysisData.recommendations.forEach((rec) => {
      recommendations.push({
        priority: rec.priority || 'medium',
        action: rec.suggestion,
        benefit: `Improve ${rec.category || 'data quality'}`,
      });
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'high',
      action: 'Review columns with high null values and decide on a handling strategy',
      benefit: 'Improve data completeness',
    });

    recommendations.push({
      priority: 'medium',
      action: 'Standardize data formats across all columns',
      benefit: 'Enhance data consistency',
    });

    recommendations.push({
      priority: 'medium',
      action: 'Validate data against business rules',
      benefit: 'Ensure data accuracy',
    });
  }

  return recommendations;
}
