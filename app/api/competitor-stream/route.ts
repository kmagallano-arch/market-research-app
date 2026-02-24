import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get('product') || 'robot vacuum cleaner'
  const market = req.nextUrl.searchParams.get('market') || 'US'

  try {
    const data = await askOpenAIJSON<any>(`You are a Jungle Scout competitor analyzer for "${product}" in ${market} market.
Return JSON: { "data": { "product": "${product}", "market": "${market}", "topCompetitors": [ { "name": "string", "brand": "string", "price": "string", "rating": 4.5, "reviews": 1000, "monthlyRevenue": "string", "monthlySales": 500, "bsr": 1000, "mainKeywords": ["kw1","kw2"], "strengths": ["s1","s2"], "weaknesses": ["w1"], "opportunityGap": "string", "listingScore": 75, "imageCount": 7, "hasVideo": true, "fulfillment": "FBA" } ], "marketSummary": { "avgPrice": "string", "avgRating": 4.3, "totalMonthlyRevenue": "string", "topKeyword": "string", "entryDifficulty": "Medium", "recommendation": "string" }, "keywordGaps": ["kw1","kw2","kw3"], "pricingOpportunity": "string" } }
Generate 6 realistic competitors. Only JSON, no markdown.`)

    return NextResponse.json({ success: true, ...data })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
