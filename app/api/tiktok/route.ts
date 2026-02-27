import { NextRequest, NextResponse } from 'next/server'
import { getStaleCache, setCache } from '@/lib/supabase'
import { askOpenAIJSON } from '@/lib/openai'

export const revalidate = 86400

export async function GET(req: NextRequest) {
  const market = req.nextUrl.searchParams.get('market') || 'PH'
  const category = req.nextUrl.searchParams.get('category') || 'electronics'
  const MARKET_CONTEXT: Record<string,string> = {
    PH: 'Philippines TikTok Shop, Filipino creators, peso prices',
    US: 'US TikTok Shop, American influencers, dollar prices',
    UK: 'UK TikTok Shop, British creators, pound prices',
    DE: 'German TikTok, euro prices',
  }
  try {
    const data = await askOpenAIJSON(`You are a TikTok viral product tracker for ${MARKET_CONTEXT[market]||market}. Generate realistic TikTok trending data for ${category} products.
Return JSON: { "data": [ { "productName": string, "hashtag": string, "videoViews": string, "creatorCount": number, "salesEstimate": string, "price": string, "trend": "exploding"|"viral"|"trending"|"fading", "trendScore": number, "whyViral": string, "ageGroup": string, "weeklyGrowth": string, "category": string, "earlySignal": boolean } ] } — return 12 products. Only JSON.`)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Failed', data: [] }, { status: 500 })
  }
}
