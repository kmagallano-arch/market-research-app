import { NextRequest, NextResponse } from 'next/server'
import OpenAI from '@/lib/openai'

export const revalidate = 3600

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') || 'electronics'
  const market = req.nextUrl.searchParams.get('market') || 'US'
  try {
    const completion = await OpenAI.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are a Keepa-style price tracker for ${category} products in ${market} market. Generate realistic price history data.

Return JSON: { "data": [ {
  "productName": string,
  "category": string,
  "currentPrice": number,
  "currency": string,
  "allTimeLow": number,
  "allTimeHigh": number,
  "avgPrice90d": number,
  "priceChange30d": string (e.g. "-12%" or "+8%"),
  "trend": "dropping"|"stable"|"rising"|"volatile",
  "buySignal": "strong-buy"|"buy"|"wait"|"overpriced",
  "priceHistory": number[] (24 values = last 24 months),
  "bsrHistory": number[] (24 values, BSR rank),
  "seasonalPattern": string,
  "nextDipEstimate": string,
  "competitorCount": number,
  "stockSignal": "low-stock"|"normal"|"overstocked"
} ] } — return 10 products. Only JSON.`
      }]
    })
    const text = completion.choices[0].message.content?.replace(/```json|```/g, '').trim() || '{}'
    return NextResponse.json(JSON.parse(text))
  } catch (e) {
    return NextResponse.json({ error: 'Failed', data: [] }, { status: 500 })
  }
}
