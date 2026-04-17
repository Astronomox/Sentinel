import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Stats } from '../../../types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const stats: Stats = body.stats;

    if (!stats) {
      return NextResponse.json({ error: 'Stats missing' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const systemPrompt = "You are SENTINEL, a military-grade cybersecurity AI. Generate a formal structured threat intelligence report. Use plain text with section headers in CAPS followed by colons. Include: EXECUTIVE SUMMARY, THREAT LANDSCAPE, TOP THREATS DETECTED, ATTACK VECTORS, RISK ASSESSMENT, RECOMMENDED ACTIONS, INCIDENT RESPONSE PRIORITY. Be technical, precise, authoritative. Under 300 words.";
    const userPrompt = `Generate a full threat intelligence report. Stats: ${stats.critical} critical, ${stats.high} high, ${stats.medium} medium, ${stats.low} low, ${stats.healthy} healthy. Timestamp: ${new Date().toISOString()}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    });

    // @ts-ignore
    const report = response.content[0].text;

    return NextResponse.json({ report });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
