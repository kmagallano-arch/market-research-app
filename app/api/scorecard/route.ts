import { NextRequest, NextResponse } from 'next/server'
import OpenAI from '@/lib/openai'

export const revalidate = 3600

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get('product') || 'robot vacuum cleaner'
  const market = req.nextUrl.searchParams.get('market') || 'US'
  try {
    const completion = await OpenAI.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are a Helium 10-style product scorecard analyzer for "${product}" in ${market} market.

Return JSON: { "data": {
  "product": string,
  "market": string,
  "overallScore": number 0-100,
  "grade": "A+"|"A"|"B"|"C"|"D",
  "verdict": string,
  "scores": {
    "demand": number 0-100,
    "competition": number 0-100,
    "profitability": number 0-100,
    "trendMomentum": number 0-100,
    "sourcingEase": number 0-100,
    "marketFit": number 0-100
  },
  "metrics": {
    "estimatedMonthlySales": number,
    "estimatedRevenue": string,
    "avgSellingPrice": string,
    "estimatedCOGS": string,
    "estimatedProfit": string,
    "roi": string,
    "paybackPeriod": string,
    "breakEvenUnits": number
  },
  "keywords": [ { "term": string, "volume": string, "difficulty": number, "opportunity": boolean } ],
  "recommendations": string[],
  "risks": string[],
  "suggestedPrice": string,
  "suggestedMOQ": number
} } — Only JSON.`
      }]
    })
    const text = completion.choices[0].message.content?.replace(/```json|```/g, '').trim() || '{}'
    return NextResponse.json(JSON.parse(text))
  } catch (e) {
    return NextResponse.json({ error: 'Failed', data: {} }, { status: 500 })
  }
}
