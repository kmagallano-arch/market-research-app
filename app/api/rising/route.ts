import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON as askGeminiJSON } from '@/lib/openai'

export const runtime = 'nodejs'
export const revalidate = 86400

const MARKET_CONTEXT: Record<string, string> = {
  US: 'US Amazon market',
  PH: 'Philippines Shopee/Lazada/TikTok Shop',
  UK: 'UK Amazon and British retail market',
  DE: 'German Amazon.de and German retail market',
  NL: 'Dutch Bol.com and Amazon Netherlands',
  SE: 'Swedish Amazon SE, CDON and Scandinavian market',
  NO: 'Norwegian market and Nordic retail',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const market = searchParams.get('market') || 'US'
  const context = MARKET_CONTEXT[market] || MARKET_CONTEXT.US

  try {
    const data = await askGeminiJSON<{ products: any[] }>(`
You are a product trend analyst. Identify NEW up-and-coming products for: ${context}
- Recently launched (0-18 months)
- Strong search growth and conversion signals
- Low competition, good for a Shopify seller sourcing from China
- Focus on: electronics, home appliances, cleaning, auto, smart home

Return JSON: { "products": [ {
  "name": "Product name",
  "category": "Category",
  "targetMarket": "${market}",
  "launchAge": "6 months",
  "searchGrowth": "+340% in 90 days",
  "conversionRate": "4.2%",
  "avgPrice": "price with correct currency for ${market}",
  "monthlySales": "~2,400 units",
  "momentum": 87,
  "whyNow": "Why gaining traction now in 1-2 sentences",
  "earlySignals": ["signal1", "signal2", "signal3"],
  "sourcingDifficulty": "Easy",
  "competitionLevel": "Low",
  "topKeywords": ["kw1","kw2","kw3"],
  "trend": "exploding"
} ] }

- momentum: 0-100
- trend: "exploding", "rising", or "emerging"
- sourcingDifficulty: "Easy", "Medium", "Hard"
- competitionLevel: "None", "Low", "Medium"
- Generate 12 products. Include local market context for ${market}.`)

    const response = NextResponse.json({ success: true, data: data.products, market })
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    return response
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
