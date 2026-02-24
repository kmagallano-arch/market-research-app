import { NextRequest, NextResponse } from 'next/server'
import OpenAI from '@/lib/openai'

export const revalidate = 3600

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') || 'electronics'
  try {
    const completion = await OpenAI.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are an Exploding Topics-style keyword velocity tracker for ${category}. Find keywords that are growing fast but not yet saturated.

Return JSON: { "data": [ {
  "keyword": string,
  "velocityScore": number 0-100,
  "searchVolume": string,
  "volumeGrowth": string (e.g. "+280% in 6mo"),
  "peakEstimate": string (e.g. "3-6 months away"),
  "stage": "pre-peak"|"early"|"growing"|"peaking"|"post-peak",
  "relatedTopics": string[],
  "markets": string[] (subset of US/PH/UK/DE/NL/SE/NO),
  "category": string,
  "opportunity": "high"|"medium"|"low",
  "competitionNow": "low"|"medium"|"high",
  "whyExploding": string,
  "cpcEstimate": string,
  "monthlyData": number[] (12 values 0-100 showing growth curve)
} ] } — return 15 keywords at various stages. Only JSON.`
      }]
    })
    const text = completion.choices[0].message.content?.replace(/```json|```/g, '').trim() || '{}'
    return NextResponse.json(JSON.parse(text))
  } catch (e) {
    return NextResponse.json({ error: 'Failed', data: [] }, { status: 500 })
  }
}
