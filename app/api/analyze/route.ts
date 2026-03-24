import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'system',
          content: 'You are a lie detection expert. Analyze the text and provide: 1) credibility score (0-100), 2) key indicators (contradictions, emotional patterns, vague language), 3) follow-up questions. Respond in JSON format with keys: credibility_score, indicators (array), questions (array).'
        }, {
          role: 'user',
          content: text
        }],
        temperature: 0.3
      })
    });

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);
    
    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    return NextResponse.json({ error: 'Analysis failed', details: error.message }, { status: 500 });
  }
}
