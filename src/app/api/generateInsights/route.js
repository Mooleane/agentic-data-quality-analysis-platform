import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const analysisData = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = buildInsightsPrompt(analysisData);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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
    });

    const insights = response.choices[0]?.message?.content || '';

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

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

function getQualityLabel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}
