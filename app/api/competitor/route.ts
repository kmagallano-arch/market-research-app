import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'

export const revalidate = 3600

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get('product') || 'robot vacuum cleaner'
  const market = req.nextUrl.searchParams.get('market') || 'US'
  try {
    const data = await askOpenAIJSON(`You are a Jungle Scout competitor analyzer for "${product}" in ${market}.
Return JSON: { "data": { "product": string, "market": string, "topCompetitors": [ { "name": string, "brand": string, "price": string, "rating": number, "reviews": number, "monthlyRevenue": string, "monthlySales": number, "bsr": number, "mainKeywords": string[], "strengths": string[], "weaknesses": string[], "opportunityGap": string, "listingScore": number, "imageCount": number, "hasVideo": boolean, "fulfillment": string } ], "marketSummary": { "avgPrice": string, "avgRating": number, "totalMonthlyRevenue": string, "topKeyword": string, "entryDifficulty": "Easy"|"Medium"|"Hard", "recommendation": string }, "keywordGaps": string[], "pricingOpportunity": string } } — 6 competitors. Only JSON.`)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Failed', data: { topCompetitors: [] } }, { status: 500 })
  }
}
