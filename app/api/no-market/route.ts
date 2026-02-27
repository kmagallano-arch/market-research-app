import { NextRequest, NextResponse } from 'next/server'
import { getStaleCache, setCache } from '@/lib/supabase'
import { askOpenAIJSON } from '@/lib/openai'

export const revalidate = 86400

export async function GET(req: NextRequest) {
  try {
    const data = await askOpenAIJSON(`You are a Norway e-commerce market expert. Generate realistic data for Amazon NO, Finn.no, Elkjop.
Return JSON: { "topCategories": [{"name": "string", "growth": "+XX%", "avgPrice": "string"}], "trendingProducts": [{"title": "string", "platform": "string", "price": "string", "soldLastMonth": "string", "rating": 4.5, "trend": "up", "keywords": ["kw1","kw2"]}], "marketInsights": ["insight"], "seasonalTips": ["tip"] }
6 categories, 16 products, focus on electronics, outdoor, home, automotive, prices in kr99-kr1299, Norway consumer context.`)
    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
