import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { withCache } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || 'electronics'
  const market = searchParams.get('market') || 'US'
  const cacheKey = `exploding:${market}:${category}`

  try {
    const { data, cached, ageMinutes } = await withCache(cacheKey, async () => {
      const result = await askOpenAIJSON<{ data: any[] }>(`
You are a trend intelligence analyst. Identify exploding search topics for "${category}" in ${market} market.

Return JSON: { "data": [ {
  "keyword": "trend keyword",
  "relatedProduct": "specific product to sell",
  "velocityScore": 85,
  "searchVolume": "XX,XXX/mo",
  "volumeGrowth": "+XXX% in 60 days",
  "peakEstimate": "when it will peak",
  "stage": "pre-peak"|"early"|"growing"|"peaking"|"post-peak",
  "relatedTopics": ["topic1","topic2","topic3","topic4"],
  "markets": ["${market}","US"],
  "category": "${category}",
  "opportunity": "high"|"medium"|"low",
  "competitionNow": "low"|"medium"|"high",
  "whyExploding": "2 sentence explanation",
  "cpcEstimate": "currency + amount",
  "monthlyData": [20,25,30,40,55,70,85,90,88,82,78,72],
  "socialSignals": ["TikTok viral","Reddit trending"],
  "estimatedRevenue": "revenue opportunity",
  "actionableInsight": "what seller should do now",
  "timeWindow": "X weeks before saturation",
  "sourcingTip": "how to source this"
} ] }

Generate 20 trending topics. monthlyData must be exactly 12 numbers 0-100. Make insights actionable.`)
      return result.data
    }, 30)

    return NextResponse.json({ success: true, data, category, market, _cached: cached, _age: ageMinutes })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
