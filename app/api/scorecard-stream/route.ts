import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get('product') || 'robot vacuum cleaner'
  const market = req.nextUrl.searchParams.get('market') || 'US'

  try {
    const data = await askOpenAIJSON<any>(`You are a Helium 10-style product scorecard for "${product}" in ${market}.
Return JSON: { "data": { "product": "string", "market": "string", "overallScore": 75, "grade": "B", "verdict": "string", "scores": { "demand": 80, "competition": 60, "profitability": 70, "trendMomentum": 75, "sourcingEase": 65, "marketFit": 72 }, "metrics": { "estimatedMonthlySales": 500, "estimatedRevenue": "string", "avgSellingPrice": "string", "estimatedCOGS": "string", "estimatedProfit": "string", "roi": "string", "paybackPeriod": "string", "breakEvenUnits": 100 }, "keywords": [ { "term": "string", "volume": "string", "difficulty": 50, "opportunity": true } ], "recommendations": ["r1","r2","r3"], "risks": ["risk1","risk2"], "suggestedPrice": "string", "suggestedMOQ": 100 } }
Only JSON, no markdown.`)

    return NextResponse.json({ success: true, ...data })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
