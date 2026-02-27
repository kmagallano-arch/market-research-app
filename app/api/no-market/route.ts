import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { withCache } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || 'electronics'
  const cacheKey = `no-market:${category}`

  try {
    const { data, cached, ageMinutes } = await withCache(cacheKey, async () => {
      const result = await askOpenAIJSON<any>(`
You are a Norway e-commerce market research expert.
Market context: Norwegian e-commerce. Premium quality focus, outdoor lifestyle. Highest purchasing power in Nordics.
Category: "${category}"
Platforms: Amazon, Elkjøp, Finn.no, Komplett

Return JSON: {
  "topCategories": [{
    "name": "string", "growth": "+XX%", "avgPrice": "krXXX",
    "topProduct": "string", "competition": "Low"|"Medium"|"High",
    "opportunity": "string"
  }],
  "trendingProducts": [{
    "title": "Full product name with brand",
    "brand": "Brand name",
    "platform": "one of: Amazon, Elkjøp, Finn.no, Komplett",
    "price": "krXXX",
    "originalPrice": "krXXX",
    "soldLastMonth": "X,XXX",
    "estimatedRevenue": "krXX,XXX/mo",
    "profitMargin": "XX%",
    "rating": 4.5,
    "reviews": 1500,
    "trend": "up"|"stable"|"down",
    "trendPercent": "+XX%",
    "category": "string",
    "subcategory": "string",
    "keywords": ["kw1","kw2","kw3","kw4","kw5"],
    "competition": "Low"|"Medium"|"High",
    "opportunity": "Brief opportunity note",
    "sourcingCost": "estimated China cost",
    "targetAudience": "buyer description",
    "isSponsored": false,
    "fulfillment": "Platform"|"Seller"
  }],
  "marketInsights": ["insight1","insight2","insight3","insight4","insight5","insight6","insight7","insight8"],
  "seasonalTips": ["tip1","tip2","tip3","tip4","tip5"],
  "topKeywords": ["kw1","kw2","kw3","kw4","kw5","kw6","kw7","kw8","kw9","kw10"],
  "marketStats": {
    "totalMarketSize": "string",
    "yoyGrowth": "+XX%",
    "avgOrderValue": "krXXX",
    "mobileShare": "XX%",
    "topPaymentMethod": "string",
    "returnRate": "XX%"
  }
}

Generate 8 top categories, 30 trending products in price range kr130-kr2,000.
Mix platforms naturally. Be specific with Norway market context. Include local brands.`)
      return result
    }, 60)

    return NextResponse.json({ success: true, data, _cached: cached, _age: ageMinutes })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
