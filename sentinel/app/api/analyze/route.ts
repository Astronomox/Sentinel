import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Threat, HealthyEntry } from '../../../types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const threat: Threat | HealthyEntry = body.threat;

    if (!threat || !threat.name || !threat.sev || !threat.sources || !threat.timestamp) {
      return NextResponse.json({ error: 'Threat data missing required fields (name, sev, sources, timestamp)' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const isEnrichment = body.enrichment === true;
    const isHealthy = threat.sev === 'healthy';

    let systemPrompt = "You are SENTINEL, an elite cybersecurity AI threat analyst. Analyze threats with precision, authority, and technical depth. Respond in short punchy paragraphs. Use technical terminology. Format: start with a threat classification line, then analysis, then recommended actions. Keep it under 180 words. No markdown — plain text only.";
    if (isHealthy) {
      systemPrompt = "You are SENTINEL. Confirm this clean signal is nominal. Provide a brief verification summary. Under 80 words. Plain text only.";
    } else if (isEnrichment) {
      systemPrompt = "Provide 3 bullet points of additional context about this threat indicator. Technical, brief, actionable. Under 60 words total. Plain text only.";
    }

    const userPrompt = `Analyze this threat: ${threat.name} | Severity: ${threat.sev} | Source: ${threat.sources.join(', ')} | Detected: ${threat.timestamp}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    });

    const firstBlock = response.content[0];
    if (!firstBlock || firstBlock.type !== 'text') {
      return NextResponse.json(
        { error: 'Unexpected model response format' },
        { status: 502 }
      );
    }
    const analysis = firstBlock.text;

    return NextResponse.json({ analysis });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
