import { NextRequest, NextResponse } from 'next/server'
import OpenAI from '@/lib/openai'

export const revalidate = 3600

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') || 'electronics'
  try {
    const completion = await OpenAI.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 2500,
      messages: [{
        role: 'user',
        content: `You are a Statista-style market sizing analyst for ${category}. Generate realistic market sizing data across all 7 markets.

Return JSON: { "data": {
  "category": string,
  "globalTAM": string,
  "globalGrowthRate": string,
  "markets": [ {
    "market": string (US/PH/UK/DE/NL/SE/NO),
    "flag": string,
    "tam": string,
    "sam": string,
    "som": string,
    "growthRate": string,
    "marketMaturity": "emerging"|"growing"|"mature"|"declining",
    "ecomPenetration": string,
    "topPlatform": string,
    "avgOrderValue": string,
    "opportunity": "high"|"medium"|"low",
    "keyDrivers": string[],
    "barriers": string[]
  } ],
  "subcategories": [ {
    "name": string,
    "globalSize": string,
    "growthRate": string,
    "hotMarkets": string[]
  } ],
  "forecast": { "2025": string, "2026": string, "2027": string, "2028": string }
} } — Only JSON.`
      }]
    })
    const text = completion.choices[0].message.content?.replace(/```json|```/g, '').trim() || '{}'
    return NextResponse.json(JSON.parse(text))
  } catch (e) {
    return NextResponse.json({ error: 'Failed', data: {} }, { status: 500 })
  }
}
