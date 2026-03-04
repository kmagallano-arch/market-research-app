import { NextRequest } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { withCache } from '@/lib/supabase'
import { jsonResponse } from '@/lib/api-headers'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get('product') || 'robot vacuum cleaner'
  const market = req.nextUrl.searchParams.get('market') || 'US'
  const cacheKey = `scorecard:${market}:${product.toLowerCase().replace(/\s+/g,'-')}`

  try {
    const { data, cached, ageMinutes } = await withCache(cacheKey, async () => {
      const result = await askOpenAIJSON<any>(`Product scorecard for "${product}" in ${market}.
Return JSON: { "data": { "product": "string", "market": "string", "overallScore": 75, "grade": "B", "verdict": "string", "scores": { "demand": 80, "competition": 60, "profitability": 70, "trendMomentum": 75, "sourcingEase": 65, "marketFit": 72 }, "metrics": { "estimatedMonthlySales": 500, "estimatedRevenue": "string", "avgSellingPrice": "string", "estimatedCOGS": "string", "estimatedProfit": "string", "roi": "string", "paybackPeriod": "string", "breakEvenUnits": 100 }, "keywords": [ { "term": "string", "volume": "string", "difficulty": 50, "opportunity": true } ], "recommendations": ["r1","r2"], "risks": ["risk1"], "suggestedPrice": "string", "suggestedMOQ": 100 } }`)
      return result.data
    }, 60)

    return jsonResponse({ success: true, data, _cached: cached, _age: ageMinutes })
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) }, { status: 500, noCache: true })
  }
}
