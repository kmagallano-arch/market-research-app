import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'

export const revalidate = 3600

export async function GET(req: NextRequest) {
  try {
    const data = await askOpenAIJSON(`You are a Sweden e-commerce market expert. Generate realistic data for Amazon SE, CDON, Elgiganten.
Return JSON: { "topCategories": [{"name": "string", "growth": "+XX%", "avgPrice": "string"}], "trendingProducts": [{"title": "string", "platform": "string", "price": "string", "soldLastMonth": "string", "rating": 4.5, "trend": "up", "keywords": ["kw1","kw2"]}], "marketInsights": ["insight"], "seasonalTips": ["tip"] }
6 categories, 16 products, focus on electronics, outdoor, home, sustainability products, prices in kr99-kr999, Sweden consumer context.`)
    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
