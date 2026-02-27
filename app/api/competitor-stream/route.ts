import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { withCache } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get('product') || 'robot vacuum cleaner'
  const market = req.nextUrl.searchParams.get('market') || 'US'
  const cacheKey = `competitor:${market}:${product.toLowerCase().replace(/\s+/g,'-')}`

  try {
    const { data, cached, ageMinutes } = await withCache(cacheKey, async () => {
      const result = await askOpenAIJSON<any>(`Competitor analysis for "${product}" in ${market} market.
Return JSON: { "data": { "product": "${product}", "market": "${market}", "topCompetitors": [ { "name": "string", "brand": "string", "price": "string", "rating": 4.5, "reviews": 1000, "monthlyRevenue": "string", "monthlySales": 500, "bsr": 1000, "mainKeywords": ["kw1"], "strengths": ["s1"], "weaknesses": ["w1"], "opportunityGap": "string", "listingScore": 75, "imageCount": 7, "hasVideo": true, "fulfillment": "FBA" } ], "marketSummary": { "avgPrice": "string", "avgRating": 4.3, "totalMonthlyRevenue": "string", "topKeyword": "string", "entryDifficulty": "Medium", "recommendation": "string" }, "keywordGaps": ["kw1","kw2"], "pricingOpportunity": "string" } }
Generate 6 realistic competitors.`)
      return result.data
    }, 60) // cache competitor data for 60 mins

    return NextResponse.json({ success: true, data, _cached: cached, _age: ageMinutes })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
