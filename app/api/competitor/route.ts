import { NextRequest, NextResponse } from 'next/server'
import OpenAI from '@/lib/openai'

export const revalidate = 3600

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get('product') || 'robot vacuum cleaner'
  const market = req.nextUrl.searchParams.get('market') || 'US'
  try {
    const completion = await OpenAI.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 2500,
      messages: [{
        role: 'user',
        content: `You are a competitor analysis tool like Jungle Scout for "${product}" in ${market} market.

Return JSON: { "data": { 
  "product": string,
  "market": string,
  "topCompetitors": [ {
    "name": string,
    "brand": string,
    "price": string,
    "rating": number,
    "reviews": number,
    "monthlyRevenue": string,
    "monthlySales": number,
    "bsr": number,
    "mainKeywords": string[],
    "strengths": string[],
    "weaknesses": string[],
    "opportunityGap": string,
    "listingScore": number 0-100,
    "imageCount": number,
    "hasVideo": boolean,
    "fulfillment": "FBA"|"FBM"|"Shopee"|"Lazada"
  } ],
  "marketSummary": {
    "avgPrice": string,
    "avgRating": number,
    "totalMonthlyRevenue": string,
    "topKeyword": string,
    "entryDifficulty": "Easy"|"Medium"|"Hard",
    "recommendation": string
  },
  "keywordGaps": string[],
  "pricingOpportunity": string
} } — return 6 competitors. Only JSON.`
      }]
    })
    const text = completion.choices[0].message.content?.replace(/```json|```/g, '').trim() || '{}'
    return NextResponse.json(JSON.parse(text))
  } catch (e) {
    return NextResponse.json({ error: 'Failed', data: { topCompetitors: [] } }, { status: 500 })
  }
}
