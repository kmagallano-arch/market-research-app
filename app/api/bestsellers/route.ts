import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON as askGeminiJSON } from '@/lib/openai'

export const runtime = 'nodejs'
export const revalidate = 3600

const MARKET_CONTEXT: Record<string, string> = {
  US: 'Amazon.com USA - USD pricing, focus on American consumer preferences',
  PH: 'Shopee Philippines and Lazada Philippines - PHP pricing (₱), Filipino consumer preferences, price-sensitive market',
  UK: 'Amazon UK - GBP (£) pricing, British consumer preferences, CE marked products',
  DE: 'Amazon Germany (amazon.de) - EUR (€) pricing, German consumer preferences, energy efficiency important, CE/GS marked',
  NL: 'Bol.com and Amazon Netherlands - EUR (€) pricing, Dutch consumer preferences, sustainability-conscious buyers',
  SE: 'Amazon Sweden and CDON - SEK (kr) pricing, Swedish consumer preferences, design-conscious, eco-friendly',
  NO: 'Norwegian market via Amazon and local retailers - NOK (kr) pricing, Norwegian consumer preferences, premium quality focus',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || 'electronics'
  const market = searchParams.get('market') || 'US'
  const context = MARKET_CONTEXT[market] || MARKET_CONTEXT.US

  try {
    const data = await askGeminiJSON<{ products: any[] }>(`
You are a market research AI. Generate realistic bestseller data for: ${context}
Category: "${category}"

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
  "keywordTags": ["keyword1","keyword2","keyword3"],
  "estimatedMonthlyRevenue": "XX,XXX with currency"
} ] }

Generate 12 products. Make them realistic current bestsellers for ${market}.
- Use correct currency (${context})
- trend: "up", "down", or "stable"
- Include local brands popular in that market
- For EU markets: include energy ratings, CE compliance where relevant`)

    const response = NextResponse.json({ success: true, data: data.products, category, market })
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    return response
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
