import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'

export const revalidate = 3600

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') || 'electronics'
  try {
    const data = await askOpenAIJSON(`You are an Exploding Topics-style keyword velocity tracker for ${category}. Find keywords growing fast but not yet saturated.
Return JSON: { "data": [ { "keyword": string, "velocityScore": number, "searchVolume": string, "volumeGrowth": string, "peakEstimate": string, "stage": "pre-peak"|"early"|"growing"|"peaking"|"post-peak", "relatedTopics": string[], "markets": string[], "category": string, "opportunity": "high"|"medium"|"low", "competitionNow": "low"|"medium"|"high", "whyExploding": string, "cpcEstimate": string, "monthlyData": number[] } ] } — return 15 keywords, monthlyData must be exactly 12 numbers. Only JSON.`)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Failed', data: [] }, { status: 500 })
  }
}
