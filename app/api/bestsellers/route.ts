import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON as askGeminiJSON } from '@/lib/openai'

export const runtime = 'nodejs'
export const revalidate = 86400

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

  try {
    const data = await askGeminiJSON<{ products: any[] }>(`
You are a market research AI. Generate realistic bestseller data for: ${ctx.desc}
Category: "${category}"
Available platforms for this market: ${ctx.platforms.join(', ')}

Return JSON: { "products": [ {
  "rank": 1,
  "title": "Product name",
  "category": "${category}",
  "price": "XX.XX with correct currency symbol",
  "rating": 4.5,
  "reviews": 12500,
  "asin": "B0XXXXXXXXX",
  "trend": "up",
  "market": "${market}",
  "platform": "one of: ${ctx.platforms.join(', ')}",
  "keywordTags": ["keyword1","keyword2","keyword3"],
  "estimatedMonthlyRevenue": "XX,XXX with currency"
} ] }

Generate 12 products. Distribute across available platforms naturally.
- trend: "up", "down", or "stable"
- platform: must be exactly one of the available platforms listed above`)

    const response = NextResponse.json({ success: true, data: data.products, category, market })
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    return response
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
