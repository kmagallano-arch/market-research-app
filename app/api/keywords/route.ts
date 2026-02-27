import { NextRequest, NextResponse } from 'next/server'
import { getStaleCache, setCache } from '@/lib/supabase'
import { askOpenAIJSON as askGeminiJSON } from '@/lib/openai'

export const runtime = 'nodejs'
export const revalidate = 86400

const MARKET_CONTEXT: Record<string, string> = {
  US: 'US consumers searching on Amazon and Google',
  PH: 'Filipino shoppers on Shopee, Lazada, and TikTok Shop Philippines',
  UK: 'UK consumers on Amazon UK and Google UK',
  DE: 'German consumers on Amazon.de and Google Germany - include German language terms',
  NL: 'Dutch consumers on Bol.com, Amazon NL - include Dutch language terms',
  SE: 'Swedish consumers on Amazon SE, CDON, and Google Sweden - include Swedish terms',
  NO: 'Norwegian consumers searching locally - include Norwegian terms',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || 'electronics'
  const market = searchParams.get('market') || 'US'
  const context = MARKET_CONTEXT[market] || MARKET_CONTEXT.US

  try {
    const data = await askGeminiJSON<{ keywords: any[] }>(`
You are a keyword research AI. Generate trending keyword data for "${category}" products targeting: ${context}

Return JSON: { "keywords": [ {
  "keyword": "search term",
  "searchVolume": "XX,XXX/mo",
  "trend": [65,70,72,80,85,90,88,92],
  "competition": "Medium",
  "cpc": "currency + amount",
  "marketScore": 85,
  "usScore": 70,
  "phScore": 60,
  "ukScore": 75,
  "deScore": 65,
  "nlScore": 55,
  "seScore": 50,
  "noScore": 45,
  "category": "${category}",
  "relatedTerms": ["term1","term2","term3"]
} ] }

- All score fields: 0-100 interest score per market
- For ${market}: make marketScore high (60-99)
- Include local language search terms for non-English markets
- CPC should use local currency
- Generate 20 keywords. Mix high-volume and long-tail.`)

    const response = NextResponse.json({ success: true, data: data.keywords, category, market })
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    return response
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
