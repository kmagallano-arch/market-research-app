import { NextRequest } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { jsonResponse } from '@/lib/api-headers'

export const revalidate = 3600

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get('product') || 'robot vacuum cleaner'
  const market = req.nextUrl.searchParams.get('market') || 'US'
  try {
    const data = await askOpenAIJSON(`You are a Helium 10-style product scorecard for "${product}" in ${market}.
Return JSON: { "data": { "product": string, "market": string, "overallScore": number, "grade": "A+"|"A"|"B"|"C"|"D", "verdict": string, "scores": { "demand": number, "competition": number, "profitability": number, "trendMomentum": number, "sourcingEase": number, "marketFit": number }, "metrics": { "estimatedMonthlySales": number, "estimatedRevenue": string, "avgSellingPrice": string, "estimatedCOGS": string, "estimatedProfit": string, "roi": string, "paybackPeriod": string, "breakEvenUnits": number }, "keywords": [ { "term": string, "volume": string, "difficulty": number, "opportunity": boolean } ], "recommendations": string[], "risks": string[], "suggestedPrice": string, "suggestedMOQ": number } } — Only JSON.`)
    return jsonResponse(data, { short: true })
  } catch (e) {
    return jsonResponse({ error: 'Failed', data: {} }, { status: 500, noCache: true })
  }
}
