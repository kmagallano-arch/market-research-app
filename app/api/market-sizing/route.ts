import { NextRequest } from 'next/server'
import { getStaleCache, setCache } from '@/lib/supabase'
import { askOpenAIJSON } from '@/lib/openai'
import { jsonResponse } from '@/lib/api-headers'

export const revalidate = 86400

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') || 'electronics'
  try {
    const data = await askOpenAIJSON(`You are a Statista-style market sizing analyst for ${category} across 7 markets (US/PH/UK/DE/NL/SE/NO).
Return JSON: { "data": { "category": string, "globalTAM": string, "globalGrowthRate": string, "markets": [ { "market": string, "flag": string, "tam": string, "sam": string, "som": string, "growthRate": string, "marketMaturity": "emerging"|"growing"|"mature"|"declining", "ecomPenetration": string, "topPlatform": string, "avgOrderValue": string, "opportunity": "high"|"medium"|"low", "keyDrivers": string[], "barriers": string[] } ], "subcategories": [ { "name": string, "globalSize": string, "growthRate": string, "hotMarkets": string[] } ], "forecast": { "2025": string, "2026": string, "2027": string, "2028": string } } } — Only JSON.`)
    return jsonResponse(data, { short: true })
  } catch (e) {
    return jsonResponse({ error: 'Failed', data: {} }, { status: 500, noCache: true })
  }
}
