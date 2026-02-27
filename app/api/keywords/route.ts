import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { withCache } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 60

const MARKET_CONTEXT: Record<string, string> = {
  US: 'US consumers on Amazon and Google',
  PH: 'Filipino shoppers on Shopee, Lazada, TikTok Shop Philippines',
  UK: 'UK consumers on Amazon UK and Google UK',
  DE: 'German consumers on Amazon.de - include German language terms',
  NL: 'Dutch consumers on Bol.com, Amazon NL - include Dutch terms',
  FR: 'French consumers on Amazon.fr, Cdiscount - include French terms',
  SE: 'Swedish consumers on Amazon SE, CDON - include Swedish terms',
  NO: 'Norwegian consumers - include Norwegian terms',
  AU: 'Australian consumers on Amazon AU, Catch.com',
  BE: 'Belgian consumers on Bol.com, Amazon BE - include French/Dutch terms',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || 'electronics'
  const market = searchParams.get('market') || 'US'
  const context = MARKET_CONTEXT[market] || MARKET_CONTEXT.US
  const cacheKey = `keywords:${market}:${category}`

  try {
    const { data, cached, ageMinutes } = await withCache(cacheKey, async () => {
      const result = await askOpenAIJSON<{ keywords: any[] }>(`
You are a senior keyword research analyst for e-commerce sellers.
Generate comprehensive keyword data for "${category}" products targeting: ${context}

Return JSON: { "keywords": [ {
  "keyword": "search term",
  "localKeyword": "local language version if non-English market",
  "searchVolume": "XX,XXX/mo",
  "searchVolumeRaw": 45000,
  "trend": [65,70,72,80,85,90,88,92,89,85,82,78],
  "trendDirection": "up"|"down"|"stable",
  "trendPercent": "+XX% YoY",
  "competition": "Low"|"Medium"|"High",
  "competitionScore": 45,
  "cpc": "currency + amount",
  "cpcRaw": 1.45,
  "difficulty": 55,
  "opportunity": 75,
  "intent": "informational"|"commercial"|"transactional"|"navigational",
  "avgPosition": "top product rank",
  "topASIN": "B0XXXXXXXXX",
  "relatedKeywords": ["related1","related2","related3"],
  "longTailVariants": ["long tail 1","long tail 2","long tail 3"],
  "seasonalPeak": "month or season",
  "marketScore": 78,
  "ppcRecommended": true,
  "organicDifficulty": "Easy"|"Medium"|"Hard",
  "estimatedClicks": "X,XXX/mo",
  "conversionRate": "X.X%"
} ] }

Generate 30 keywords. Include:
- 8 high-volume head terms
- 12 mid-tail keywords  
- 10 long-tail low-competition gems
trend array must be exactly 12 numbers (monthly data).
Make data specific and realistic for ${market} market.`)
      return result.keywords
    }, 30)

    return NextResponse.json({ success: true, data, category, market, _cached: cached, _age: ageMinutes })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
