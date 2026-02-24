import { NextRequest, NextResponse } from 'next/server'
import OpenAI from '@/lib/openai'

export const revalidate = 3600

export async function GET(req: NextRequest) {
  const market = req.nextUrl.searchParams.get('market') || 'PH'
  const category = req.nextUrl.searchParams.get('category') || 'electronics'

  const MARKET_CONTEXT: Record<string, string> = {
    PH: 'Philippines TikTok Shop, Filipino creators, peso prices, Shopee cross-posting',
    US: 'US TikTok Shop, American influencers, dollar prices, Amazon cross-posting',
    UK: 'UK TikTok Shop, British creators, pound prices',
    DE: 'German TikTok, euro prices, German consumer preferences',
  }

  try {
    const completion = await OpenAI.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are a TikTok viral product tracker for ${MARKET_CONTEXT[market] || market}. Generate realistic TikTok trending data for ${category} products.

Return JSON: { "data": [ { 
  "productName": string,
  "hashtag": string (e.g. #CleanTok),
  "videoViews": string (e.g. "24.5M views"),
  "creatorCount": number,
  "salesEstimate": string,
  "price": string (local currency),
  "trend": "exploding"|"viral"|"trending"|"fading",
  "trendScore": number 0-100,
  "topVideo": string (description of viral video),
  "whyViral": string,
  "ageGroup": string,
  "buyLink": "amazon"|"shopee"|"lazada"|"tiktok-shop",
  "weeklyGrowth": string (e.g. "+340%"),
  "category": string,
  "earlySignal": boolean
} ] } — return 12 products, mix of trends. Only JSON, no markdown.`
      }]
    })
    const text = completion.choices[0].message.content?.replace(/```json|```/g, '').trim() || '{}'
    return NextResponse.json(JSON.parse(text))
  } catch (e) {
    return NextResponse.json({ error: 'Failed', data: [] }, { status: 500 })
  }
}
