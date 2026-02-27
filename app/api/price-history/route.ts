import { NextRequest, NextResponse } from 'next/server'
import { getStaleCache, setCache } from '@/lib/supabase'
import { askOpenAIJSON } from '@/lib/openai'

export const revalidate = 86400

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') || 'electronics'
  const market = req.nextUrl.searchParams.get('market') || 'US'
  try {
    const data = await askOpenAIJSON(`You are a Keepa-style price tracker for ${category} in ${market}. Generate realistic price history.
Return JSON: { "data": [ { "productName": string, "category": string, "currentPrice": number, "currency": string, "allTimeLow": number, "allTimeHigh": number, "avgPrice90d": number, "priceChange30d": string, "trend": "dropping"|"stable"|"rising"|"volatile", "buySignal": "strong-buy"|"buy"|"wait"|"overpriced", "priceHistory": number[], "seasonalPattern": string, "nextDipEstimate": string, "competitorCount": number, "stockSignal": string } ] } — 10 products, priceHistory must be exactly 24 numbers. Only JSON.`)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Failed', data: [] }, { status: 500 })
  }
}
