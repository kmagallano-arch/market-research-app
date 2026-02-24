import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'

export const runtime = 'nodejs'
export const revalidate = 0

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const market = searchParams.get('market') || 'ALL'

  const marketContext = market === 'ALL'
    ? 'US, UK, DE, NL, FR, SE, NO, AU, BE, PH markets'
    : `${market} market`

  try {
    const data = await askOpenAIJSON<{ recommendations: any[] }>(`
You are a product sourcing expert for a Shopify e-commerce business importing from China.
The seller sells: dashcams, window cleaning robots, vacuum cleaners, WiFi equipment.
Generate product recommendations for ${marketContext}.

Return JSON: { "recommendations": [ {
  "productIdea": "string",
  "category": "string",
  "targetMarket": "${market === 'ALL' ? 'one of: US,UK,DE,NL,FR,SE,NO,AU,BE,PH' : market}",
  "reason": "string",
  "estimatedDemand": "Very High"|"High"|"Medium"|"Low",
  "competition": "Low"|"Medium"|"High",
  "estimatedProfit": "currency + range per unit",
  "topKeywords": ["kw1","kw2","kw3"],
  "sourcingSuggestion": "string",
  "riskLevel": "Low"|"Medium"|"High",
  "score": 85
} ] }

${market === 'ALL'
  ? 'Generate 30 recommendations. IMPORTANT: spread evenly - 3 each for US, UK, DE, NL, FR, SE, NO, AU, BE, PH. Each item targetMarket must be exactly one of those codes.'
  : `Generate 15 recommendations. ALL must have targetMarket exactly "${market}". Use correct local currency.`}
score: 0-100 opportunity score.`)

    const response = NextResponse.json({ success: true, data: data.recommendations, market })
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
