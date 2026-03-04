import { NextRequest } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { withCache } from '@/lib/supabase'
import { jsonResponse } from '@/lib/api-headers'

export const runtime = 'nodejs'
export const maxDuration = 60

const MARKET_CONTEXT: Record<string, { desc: string; platforms: string[]; currency: string; priceRange: string }> = {
  US: { desc: 'Amazon.com USA',           platforms: ['Amazon','eBay'],                  currency: 'USD', priceRange: '$15-$150' },
  PH: { desc: 'Shopee & Lazada PH',       platforms: ['Shopee','Lazada','TikTok Shop'],  currency: 'PHP', priceRange: '₱300-₱5000' },
  UK: { desc: 'Amazon UK',                platforms: ['Amazon','eBay','TikTok Shop'],    currency: 'GBP', priceRange: '£10-£120' },
  DE: { desc: 'Amazon Germany',           platforms: ['Amazon','Otto'],                  currency: 'EUR', priceRange: '€12-€130' },
  NL: { desc: 'Bol.com & Amazon NL',      platforms: ['Bol.com','Amazon'],               currency: 'EUR', priceRange: '€12-€130' },
  FR: { desc: 'Amazon FR & Cdiscount',    platforms: ['Amazon','Cdiscount','Fnac'],      currency: 'EUR', priceRange: '€12-€130' },
  SE: { desc: 'Amazon SE & CDON',         platforms: ['Amazon','CDON'],                  currency: 'SEK', priceRange: 'kr150-kr1500' },
  NO: { desc: 'Amazon NO & Elkjøp',       platforms: ['Amazon','Elkjøp'],                currency: 'NOK', priceRange: 'kr150-kr1500' },
  AU: { desc: 'Amazon AU & Catch.com',    platforms: ['Amazon','eBay','Catch.com'],      currency: 'AUD', priceRange: 'A$20-A$160' },
  BE: { desc: 'Bol.com & Amazon BE',      platforms: ['Bol.com','Amazon','Fnac'],        currency: 'EUR', priceRange: '€12-€130' },
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || 'electronics'
  const market = searchParams.get('market') || 'US'
  const ctx = MARKET_CONTEXT[market] || MARKET_CONTEXT.US
  const cacheKey = `bestsellers:${market}:${category}`

  try {
    const { data, cached, ageMinutes } = await withCache(cacheKey, async () => {
      const result = await askOpenAIJSON<{ products: any[] }>(`
You are a senior e-commerce market analyst. Generate comprehensive bestseller data for ${ctx.desc} in the "${category}" category.

Return JSON: { "products": [ {
  "rank": 1,
  "title": "Full realistic product name with brand",
  "brand": "Brand name",
  "category": "${category}",
  "subcategory": "specific subcategory",
  "price": "price with ${ctx.currency} symbol",
  "originalPrice": "original price if discounted",
  "rating": 4.5,
  "reviews": 12500,
  "asin": "B0XXXXXXXXX",
  "trend": "up"|"down"|"stable",
  "trendPercent": "+12% this month",
  "market": "${market}",
  "platform": "one of: ${ctx.platforms.join(', ')}",
  "fulfillment": "FBA"|"FBM"|"Seller",
  "estimatedMonthlySales": 1200,
  "estimatedMonthlyRevenue": "revenue with currency",
  "estimatedProfit": "profit with currency",
  "profitMargin": "XX%",
  "bsr": 1500,
  "bsrCategory": "category BSR",
  "keywordTags": ["keyword1","keyword2","keyword3","keyword4","keyword5"],
  "listingAge": "X months",
  "variations": 3,
  "isPrime": true,
  "hasVideo": true,
  "imageCount": 7,
  "sellerType": "Brand"|"Reseller"|"Chinese Seller",
  "competition": "Low"|"Medium"|"High",
  "opportunity": "Brief opportunity description",
  "sourcingEstimate": "estimated COGS from China"
} ] }

Generate 25 realistic products for ${market} market in price range ${ctx.priceRange}.
Include mix of: established brands, emerging brands, generic sellers.
Vary BSR from top 100 to top 5000. Include all platforms naturally.
Make data specific and realistic for ${ctx.desc} market.`)
      return result.products
    }, 30)

    return jsonResponse({ success: true, data, category, market, _cached: cached, _age: ageMinutes })
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) }, { status: 500, noCache: true })
  }
}
