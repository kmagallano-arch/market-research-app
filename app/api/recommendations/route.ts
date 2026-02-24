import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const market = searchParams.get('market') || 'ALL'

  try {
    const data = await askOpenAIJSON<{ recommendations: any[] }>(`
You are a product sourcing expert for a Shopify business importing electronics from China.
Products already sold: dashcams, window cleaning robots, vacuums, WiFi equipment.

${market === 'ALL'
  ? 'Generate exactly 20 product recommendations, 2 each for: US, UK, DE, NL, FR, SE, NO, AU, BE, PH.'
  : `Generate exactly 12 product recommendations all for ${market} market.`}

Return JSON: { "recommendations": [ {
  "productIdea": "string",
  "category": "string",
  "targetMarket": "${market === 'ALL' ? 'one of: US,UK,DE,NL,FR,SE,NO,AU,BE,PH' : market}",
  "reason": "string (max 20 words)",
  "estimatedDemand": "Very High"|"High"|"Medium"|"Low",
  "competition": "Low"|"Medium"|"High",
  "estimatedProfit": "profit range with local currency symbol",
  "riskLevel": "Low"|"Medium"|"High",
  "score": 0-100
} ] }`)

    const response = NextResponse.json({ success: true, data: data.recommendations, market })
    response.headers.set('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600')
    return response
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
