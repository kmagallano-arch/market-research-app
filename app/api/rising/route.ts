import { NextRequest } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { withCache } from '@/lib/supabase'
import { jsonResponse } from '@/lib/api-headers'

export const runtime = 'nodejs'
export const maxDuration = 60

const MARKET_CONTEXT: Record<string, string> = {
  US: 'US Amazon & DTC market', PH: 'Philippines Shopee/Lazada/TikTok Shop',
  UK: 'UK Amazon & British retail', DE: 'German Amazon.de & Otto',
  NL: 'Dutch Bol.com & Amazon NL', FR: 'French Amazon.fr & Cdiscount',
  SE: 'Swedish Amazon SE & CDON', NO: 'Norwegian market & Elkjøp',
  AU: 'Australian Amazon AU & Catch.com', BE: 'Belgian Bol.com & Amazon BE',
}
const MARKET_PLATFORMS: Record<string, string[]> = {
  US: ['Amazon','eBay','DTC'], PH: ['Shopee','Lazada','TikTok Shop'],
  UK: ['Amazon','eBay','TikTok Shop'], DE: ['Amazon','Otto'],
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
You are a product trend analyst specializing in emerging e-commerce opportunities.
Identify rising products for: ${context}
Categories: electronics, home, cleaning, auto, smart home, beauty, health, fitness, pet, baby, outdoor, kitchen, office.

Return JSON: { "products": [ {
  "name": "Specific product name",
  "brand": "Brand or generic",
  "category": "Main category",
  "subcategory": "Specific niche",
  "targetMarket": "${market}",
  "launchAge": "X months ago",
  "searchGrowth": "+XXX% in 90 days",
  "searchVolume": "XX,XXX/mo",
  "conversionRate": "X.X%",
  "avgPrice": "price with currency",
  "cogs": "estimated China sourcing cost",
  "profitMargin": "XX%",
  "monthlySales": "~X,XXX units",
  "monthlyRevenue": "revenue estimate",
  "momentum": 87,
  "whyNow": "2-3 sentence explanation of why gaining traction now",
  "earlySignals": ["signal1","signal2","signal3","signal4"],
  "sourcingDifficulty": "Easy"|"Medium"|"Hard",
  "competitionLevel": "None"|"Low"|"Medium",
  "topKeywords": ["kw1","kw2","kw3","kw4","kw5"],
  "platform": "one of: ${platforms.join(', ')}",
  "trend": "exploding"|"rising"|"emerging",
  "riskLevel": "Low"|"Medium"|"High",
  "timeToMarket": "X-X weeks from China",
  "minOrderQuantity": "XXX units",
  "similarProducts": ["product1","product2"],
  "targetAudience": "description of buyer"
} ] }

Generate 20 products. Mix of categories. momentum 0-100. Make data specific and realistic.`)
      return result.products
    }, 30)

    return jsonResponse({ success: true, data, market, _cached: cached, _age: ageMinutes })
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) }, { status: 500, noCache: true })
  }
}
