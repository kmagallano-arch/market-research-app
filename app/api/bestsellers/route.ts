import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { withCache } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 30

const MARKET_CONTEXT: Record<string, { desc: string; platforms: string[] }> = {
  US: { desc: 'Amazon.com USA - USD pricing',                           platforms: ['Amazon','eBay'] },
  PH: { desc: 'Shopee Philippines and Lazada Philippines - PHP pricing', platforms: ['Shopee','Lazada','TikTok Shop'] },
  UK: { desc: 'Amazon UK - GBP pricing',                                platforms: ['Amazon','eBay','TikTok Shop'] },
  DE: { desc: 'Amazon Germany - EUR pricing',                           platforms: ['Amazon'] },
  NL: { desc: 'Bol.com and Amazon Netherlands - EUR pricing',           platforms: ['Bol.com','Amazon'] },
  FR: { desc: 'Amazon France and Cdiscount - EUR pricing',              platforms: ['Amazon','Cdiscount','Fnac'] },
  SE: { desc: 'Amazon Sweden and CDON - SEK pricing',                   platforms: ['Amazon','CDON'] },
  NO: { desc: 'Amazon Norway and Elkjøp - NOK pricing',                 platforms: ['Amazon','Elkjøp'] },
  AU: { desc: 'Amazon Australia and Catch.com - AUD pricing',           platforms: ['Amazon','eBay','Catch.com'] },
  BE: { desc: 'Bol.com and Amazon Belgium - EUR pricing',               platforms: ['Bol.com','Amazon','Fnac'] },
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
You are a market research AI. Generate realistic bestseller data for: ${ctx.desc}
Category: "${category}". Available platforms: ${ctx.platforms.join(', ')}
Return JSON: { "products": [ { "rank": 1, "title": "string", "category": "${category}", "price": "string", "rating": 4.5, "reviews": 12500, "asin": "string", "trend": "up"|"down"|"stable", "market": "${market}", "platform": "one of: ${ctx.platforms.join(', ')}", "keywordTags": ["kw1","kw2"], "estimatedMonthlyRevenue": "string" } ] }
Generate 12 realistic products. Distribute across platforms naturally.`)
      return result.products
    })

    return NextResponse.json({ success: true, data, category, market, _cached: cached, _age: ageMinutes })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
