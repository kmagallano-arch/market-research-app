import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'

export const revalidate = 86400

export async function GET(req: NextRequest) {
  try {
    const data = await askOpenAIJSON(`You are a UK e-commerce market expert. Generate realistic data for Amazon UK, eBay UK, Argos.
Return JSON: { "topCategories": [{"name": "string", "growth": "+XX%", "avgPrice": "string"}], "trendingProducts": [{"title": "string", "platform": "string", "price": "string", "soldLastMonth": "string", "rating": 4.5, "trend": "up", "keywords": ["kw1","kw2"]}], "marketInsights": ["insight"], "seasonalTips": ["tip"] }
6 categories, 16 products, focus on electronics, home, automotive, health tech, prices in £8-£100, UK consumer context.`)
    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
