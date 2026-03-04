import { NextRequest } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { getStaleCache, setCache } from '@/lib/supabase'
import { jsonResponse } from '@/lib/api-headers'

export const runtime = 'nodejs'
export const maxDuration = 30

const CURRENCY: Record<string, { symbol: string }> = {
  US: { symbol: '$' }, UK: { symbol: '£' }, AU: { symbol: 'A$' },
  DE: { symbol: '€' }, NL: { symbol: '€' }, FR: { symbol: '€' },
  SE: { symbol: 'kr' }, NO: { symbol: 'kr' }, BE: { symbol: '€' }, PH: { symbol: '₱' },
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const keyword = searchParams.get('keyword') || 'robot vacuum'
  const market = searchParams.get('market') || 'US'
  const loc = CURRENCY[market] || CURRENCY.US
  const cacheKey = `keyword-search:${market}:${keyword.toLowerCase().replace(/\s+/g, '-')}`

  try {
    // 1. Try Supabase first - return instantly if cached
    const cached = await getStaleCache(cacheKey)
    if (cached) {
      return jsonResponse({
        success: true,
        hasLiveData: false,
        _cached: true,
        _age: Math.round(cached.ageMinutes),
        ...cached.data
      }, { short: true })
    }

    // 2. Not in cache yet - fetch from Claude and save
    const data = await askOpenAIJSON<any>(`Keyword research for "${keyword}" in ${market} market.
Return JSON: { "keyword": "${keyword}", "market": "${market}", "main": { "searchVolume": "string", "competitionIndex": 50, "competition": "MEDIUM", "cpc": "${loc.symbol}X.XX", "difficulty": 50, "opportunity": "string", "seasonality": "string" }, "trendData": [60,65,70,75,80,85,82,88,90,85,78,72], "trendLabels": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], "related": [ { "keyword": "string", "searchVolume": "string", "searchVolumeRaw": 1000, "competition": "Low"|"Medium"|"High", "competitionIndex": 50, "cpc": "${loc.symbol}X.XX", "intent": "informational"|"commercial"|"transactional", "difficulty": 50 } ], "insights": ["i1","i2","i3","i4"], "bestMarkets": ["${market}"] }
Generate 15 related keywords.`)

    await setCache(cacheKey, data).catch(() => {})

    return jsonResponse({ success: true, hasLiveData: false, _cached: false, ...data }, { short: true })
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) }, { status: 500, noCache: true })
  }
}
