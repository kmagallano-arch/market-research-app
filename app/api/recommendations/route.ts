import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON as askGeminiJSON } from '@/lib/openai'

export const runtime = 'nodejs'
export const revalidate = 3600

export interface Recommendation {
  productIdea: string
  category: string
  targetMarket: 'US' | 'PH' | 'BOTH'
  reason: string
  estimatedDemand: 'Very High' | 'High' | 'Medium' | 'Low'
  competition: 'Low' | 'Medium' | 'High'
  estimatedProfit: string
  topKeywords: string[]
  sourcingSuggestion: string
  riskLevel: 'Low' | 'Medium' | 'High'
  score: number
}

export async function GET(req: NextRequest) {
  try {
    const data = await askGeminiJSON<{ recommendations: Recommendation[] }>(`
You are a product sourcing expert for a Shopify e-commerce business importing from China.
The seller already sells: dashcams, window cleaning robots, vacuum cleaners, WiFi equipment.
Generate product recommendations for US and Philippines markets based on current trends.
Return JSON: { "recommendations": [ { "productIdea": "Product name", "category": "Category", "targetMarket": "US", "reason": "Why this product sells well", "estimatedDemand": "High", "competition": "Medium", "estimatedProfit": "$XX-XX per unit", "topKeywords": ["keyword1","keyword2","keyword3"], "sourcingSuggestion": "Source from China via...", "riskLevel": "Low", "score": 85 } ] }
Generate 15 recommendations: 6 for US only, 5 for PH only, 4 for BOTH markets.
score: 0-100 opportunity score.`)

    const response = NextResponse.json({ success: true, data: data.recommendations })
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    return response
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
