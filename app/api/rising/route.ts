import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { withCache } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 30

const MARKET_CONTEXT: Record<string, string> = {
  US: 'US Amazon market', PH: 'Philippines Shopee/Lazada/TikTok Shop',
  UK: 'UK Amazon and British retail', DE: 'German Amazon.de market',
  NL: 'Dutch Bol.com and Amazon NL', FR: 'French Amazon.fr and Cdiscount',
  SE: 'Swedish Amazon SE and CDON', NO: 'Norwegian market',
  AU: 'Australian Amazon AU and Catch.com', BE: 'Belgian Bol.com and Amazon BE',
}
const MARKET_PLATFORMS: Record<string, string[]> = {
  US: ['Amazon','eBay'], PH: ['Shopee','Lazada','TikTok Shop'],
  UK: ['Amazon','eBay','TikTok Shop'], DE: ['Amazon'],
  NL: ['Bol.com','Amazon'], FR: ['Amazon','Cdiscount','Fnac'],
  SE: ['Amazon','CDON'], NO: ['Amazon','Elkjøp'],
  AU: ['Amazon','eBay','Catch.com'], BE: ['Bol.com','Amazon','Fnac'],
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const market = searchParams.get('market') || 'US'
  const cacheKey = `rising:${market}`

  try {
    const { data, cached, ageMinutes } = await withCache(cacheKey, async () => {
      const context = MARKET_CONTEXT[market] || MARKET_CONTEXT.US
      const platforms = MARKET_PLATFORMS[market] || ['Amazon']
      const result = await askOpenAIJSON<{ products: any[] }>(`
Rising products analyst for: ${context}. Focus on: electronics, home, cleaning, auto, smart home, beauty, health, fitness, pet, baby, outdoor.
Return JSON: { "products": [ { "name": "string", "category": "string", "targetMarket": "${market}", "launchAge": "string", "searchGrowth": "string", "conversionRate": "string", "avgPrice": "string", "monthlySales": "string", "momentum": 87, "whyNow": "string", "earlySignals": ["s1","s2"], "sourcingDifficulty": "Easy"|"Medium"|"Hard", "competitionLevel": "None"|"Low"|"Medium", "topKeywords": ["kw1","kw2"], "platform": "one of: ${platforms.join(', ')}", "trend": "exploding"|"rising"|"emerging" } ] }
Generate 12 products.`)
      return result.products
    })

    return NextResponse.json({ success: true, data, market, _cached: cached, _age: ageMinutes })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
