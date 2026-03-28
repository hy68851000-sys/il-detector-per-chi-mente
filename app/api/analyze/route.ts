import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [{
          role: 'system',
          content: 'You are a lie detection expert. Analyze the text and provide: 1) credibility score (0-100), 2) key indicators (contradictions, emotional patterns, vague language), 3) follow-up questions. You MUST respond with valid JSON only, no extra text. Use this exact format: {"credibility_score": 75, "indicators": ["indicator1", "indicator2"], "questions": ["question1", "question2"]}'
        }, {
          role: 'user',
          content: text
        }],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Zhipu API error:', response.status, errText);
      return NextResponse.json({ error: `Zhipu API error: ${response.status}`, details: errText }, { status: 500 });
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;

    let analysis;
    try {
      // 提取 JSON（GLM 有时会在 JSON 外加 markdown 代码块）
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
    } catch {
      analysis = { credibility_score: 50, indicators: [rawContent], questions: [] };
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error('Analyze error:', error);
    return NextResponse.json({ error: 'Analysis failed', details: error.message }, { status: 500 });
  }
}
