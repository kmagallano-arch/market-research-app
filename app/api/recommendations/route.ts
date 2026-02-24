import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const market = searchParams.get('market') || 'ALL'

  try {
    // For ALL: fetch just 10 items across markets to stay fast
    // For specific market: fetch 12 for that market
    const prompt = market === 'ALL'
      ? `Generate 10 product recommendations for an electronics Shopify seller (dashcams, vacuums, WiFi, window cleaning robots) importing from China. Spread across US, UK, DE, PH, AU markets (2 each).
Return JSON: { "recommendations": [ { "productIdea": "string", "category": "string", "targetMarket": "US"|"UK"|"DE"|"PH"|"AU", "reason": "string", "estimatedDemand": "Very High"|"High"|"Medium"|"Low", "competition": "Low"|"Medium"|"High", "estimatedProfit": "string", "riskLevel": "Low"|"Medium"|"High", "score": 75 } ] }`
      : `Generate 12 product recommendations for an electronics Shopify seller for the ${market} market only. Use local currency.
Return JSON: { "recommendations": [ { "productIdea": "string", "category": "string", "targetMarket": "${market}", "reason": "string", "estimatedDemand": "Very High"|"High"|"Medium"|"Low", "competition": "Low"|"Medium"|"High", "estimatedProfit": "string with ${market} currency", "riskLevel": "Low"|"Medium"|"High", "score": 75 } ] }`

    const data = await askOpenAIJSON<{ recommendations: any[] }>(prompt)

    if (!data?.recommendations?.length) {
      return NextResponse.json({ success: false, error: 'No recommendations returned', data: [] }, { status: 500 })
    }

    const response = NextResponse.json({ success: true, data: data.recommendations, market })
    response.headers.set('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600')
    return response
  } catch (err) {
    console.error('Recommendations error:', err)
    return NextResponse.json({ success: false, error: String(err), data: [] }, { status: 500 })
  }
}
