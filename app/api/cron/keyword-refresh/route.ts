import { NextRequest } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { setCache } from '@/lib/supabase'
import { jsonResponse } from '@/lib/api-headers'

export const runtime = 'nodejs'
export const maxDuration = 60

const KEYWORDS = [
  'robot vacuum', 'dashcam 4K', 'wifi mesh router', 'window cleaning robot',
  'cordless vacuum', 'wireless earbuds', 'smart plug', 'portable charger',
  'air purifier', 'security camera', 'face serum', 'electric toothbrush',
  'yoga mat', 'baby monitor', 'pet camera', 'resistance bands',
  'led desk lamp', 'protein shaker', 'massage gun', 'smart scale',
]

const MARKETS = ['US', 'UK', 'DE', 'NL', 'FR', 'SE', 'NO', 'AU', 'BE', 'PH']

const CURRENCY: Record<string, { symbol: string }> = {
  US: { symbol: '$' }, UK: { symbol: '£' }, AU: { symbol: 'A$' },
  DE: { symbol: '€' }, NL: { symbol: '€' }, FR: { symbol: '€' },
  SE: { symbol: 'kr' }, NO: { symbol: 'kr' }, BE: { symbol: '€' }, PH: { symbol: '₱' },
}

async function refreshKeyword(keyword: string, market: string) {
  const loc = CURRENCY[market] || CURRENCY.US
  const cacheKey = `keyword-search:${market}:${keyword.toLowerCase().replace(/\s+/g, '-')}`
  try {
    const data = await askOpenAIJSON<any>(`Keyword research for "${keyword}" in ${market} market.
Return JSON: { "keyword": "${keyword}", "market": "${market}", "main": { "searchVolume": "string", "competitionIndex": 50, "competition": "MEDIUM", "cpc": "${loc.symbol}X.XX", "difficulty": 50, "opportunity": "string", "seasonality": "string" }, "trendData": [60,65,70,75,80,85,82,88,90,85,78,72], "trendLabels": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], "related": [ { "keyword": "string", "searchVolume": "string", "searchVolumeRaw": 1000, "competition": "Low"|"Medium"|"High", "competitionIndex": 50, "cpc": "${loc.symbol}X.XX", "intent": "informational"|"commercial"|"transactional", "difficulty": 50 } ], "insights": ["i1","i2","i3","i4"], "bestMarkets": ["${market}"] }
Generate 15 related keywords.`)
    await setCache(cacheKey, data)
    return { keyword, market, status: 'ok' }
  } catch (err) {
    return { keyword, market, status: 'error', error: String(err) }
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return jsonResponse({ error: 'Unauthorized' }, { status: 401, noCache: true })
  }

  // Rotate through keywords - 1 keyword × all 10 markets per run
  const minuteIndex = Math.floor(Date.now() / 1000 / 60) % KEYWORDS.length
  const keyword = KEYWORDS[minuteIndex]

  const batch = await Promise.allSettled(
    MARKETS.map(market => refreshKeyword(keyword, market))
  )

  const results = batch.map(r => r.status === 'fulfilled' ? r.value : r.reason)

  return jsonResponse({
    success: true,
    keyword,
    results,
    nextKeyword: KEYWORDS[(minuteIndex + 1) % KEYWORDS.length],
    timestamp: new Date().toISOString(),
  }, { noCache: true })
}
