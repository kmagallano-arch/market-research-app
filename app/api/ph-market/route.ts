import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON as askGeminiJSON } from '@/lib/openai'

export const runtime = 'nodejs'
export const revalidate = 3600

export interface PHMarketData {
  platform: 'Lazada' | 'Shopee'
  topCategories: { name: string; growth: string; avgPrice: string }[]
  trendingProducts: {
    title: string
    platform: 'Lazada' | 'Shopee'
    price: string
    soldLastMonth: string
    rating: number
    trend: 'up' | 'stable' | 'down'
    keywords: string[]
  }[]
  marketInsights: string[]
  seasonalTips: string[]
}

export async function GET(req: NextRequest) {
  try {
    const data = await askGeminiJSON<PHMarketData>(`
You are a Philippines e-commerce market research expert. Generate realistic market data for Lazada and Shopee Philippines.
Return JSON: { "platform": "Lazada", "topCategories": [{"name": "...", "growth": "+XX%", "avgPrice": "₱XXX"}], "trendingProducts": [{"title": "...", "platform": "Lazada", "price": "₱XXX", "soldLastMonth": "X,XXX", "rating": 4.5, "trend": "up", "keywords": ["kw1","kw2","kw3"]}], "marketInsights": ["insight1","insight2","insight3","insight4","insight5"], "seasonalTips": ["tip1","tip2","tip3"] }
- Generate 6 top categories with growth rates
- Generate 16 trending products mix of Lazada and Shopee
- Focus on electronics, home appliances, cleaning products, auto accessories, smart home
- Philippines buyers: price-sensitive, popular price points ₱500-₱3000`)

    const response = NextResponse.json({ success: true, data })
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    return response
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
