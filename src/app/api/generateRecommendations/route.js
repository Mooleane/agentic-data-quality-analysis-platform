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

    const prompt = buildRecommendationsPrompt(analysisData);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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
    });

    const content = response.choices[0]?.message?.content || '[]';

    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

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
