import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { withCache } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 30

const LOCATION_MAP: Record<string, { currency: string; symbol: string }> = {
  US: { currency: 'USD', symbol: '$' }, UK: { currency: 'GBP', symbol: '£' },
  AU: { currency: 'AUD', symbol: 'A$' }, DE: { currency: 'EUR', symbol: '€' },
  NL: { currency: 'EUR', symbol: '€' }, FR: { currency: 'EUR', symbol: '€' },
  SE: { currency: 'SEK', symbol: 'kr' }, NO: { currency: 'NOK', symbol: 'kr' },
  BE: { currency: 'EUR', symbol: '€' }, PH: { currency: 'PHP', symbol: '₱' },
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const keyword = searchParams.get('keyword') || 'robot vacuum'
  const market = searchParams.get('market') || 'US'
  const loc = LOCATION_MAP[market] || LOCATION_MAP.US
  const cacheKey = `keyword-search:${market}:${keyword.toLowerCase().replace(/\s+/g,'-')}`

  try {
    const { data, cached, ageMinutes } = await withCache(cacheKey, async () => {
      const result = await askOpenAIJSON<any>(`Keyword research for "${keyword}" in ${market} market (${loc.currency}).
Return JSON: { "keyword": "${keyword}", "market": "${market}", "main": { "searchVolume": "string", "competitionIndex": 50, "competition": "MEDIUM", "cpc": "${loc.symbol}X.XX", "difficulty": 50, "opportunity": "string", "seasonality": "string" }, "trendData": [60,65,70,75,80,85,82,88,90,85,78,72], "trendLabels": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], "related": [ { "keyword": "string", "searchVolume": "string", "searchVolumeRaw": 1000, "competition": "Low"|"Medium"|"High", "competitionIndex": 50, "cpc": "${loc.symbol}X.XX", "intent": "informational"|"commercial"|"transactional", "difficulty": 50, "source": "ai" } ], "insights": ["insight1","insight2","insight3","insight4"], "bestMarkets": ["${market}"] }
Generate 20 related keywords. Use realistic data.`)
      return result
    }, 30)

    return NextResponse.json({ success: true, hasLiveData: false, _cached: cached, _age: ageMinutes, ...data })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
