import { NextRequest } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { withCache } from '@/lib/supabase'
import { jsonResponse } from '@/lib/api-headers'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const market = searchParams.get('market') || 'ALL'
  const cacheKey = `recommendations:${market}`

  try {
    const { data, cached, ageMinutes } = await withCache(cacheKey, async () => {
      const prompt = market === 'ALL'
        ? `Generate 10 product recommendations for a Shopify electronics seller importing from China (dashcams, vacuums, WiFi, window cleaning robots, beauty, fitness, pet supplies). Spread across US, UK, DE, PH, AU (2 each).
Return JSON: { "recommendations": [ { "productIdea": "string", "category": "string", "targetMarket": "US"|"UK"|"DE"|"PH"|"AU", "reason": "string", "estimatedDemand": "Very High"|"High"|"Medium"|"Low", "competition": "Low"|"Medium"|"High", "estimatedProfit": "string", "riskLevel": "Low"|"Medium"|"High", "score": 75 } ] }`
        : `Generate 12 product recommendations for a Shopify seller for ${market} market only. Use local currency.
Return JSON: { "recommendations": [ { "productIdea": "string", "category": "string", "targetMarket": "${market}", "reason": "string", "estimatedDemand": "Very High"|"High"|"Medium"|"Low", "competition": "Low"|"Medium"|"High", "estimatedProfit": "string with ${market} currency", "riskLevel": "Low"|"Medium"|"High", "score": 75 } ] }`
      const result = await askOpenAIJSON<{ recommendations: any[] }>(prompt)
      return result.recommendations
    }, 15)

    return jsonResponse({ success: true, data, market, _cached: cached, _age: ageMinutes })
  } catch (err) {
    return jsonResponse({ success: false, error: String(err), data: [] }, { status: 500, noCache: true })
  }
}
