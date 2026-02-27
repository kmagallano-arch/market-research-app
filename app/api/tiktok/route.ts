import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'
import { withCache } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 60

const MARKET_CONTEXT: Record<string, string> = {
  US: 'TikTok Shop USA', PH: 'TikTok Shop Philippines',
  UK: 'TikTok Shop UK', DE: 'TikTok Germany', NL: 'TikTok Netherlands',
  FR: 'TikTok France', SE: 'TikTok Sweden', NO: 'TikTok Norway',
  AU: 'TikTok Australia', BE: 'TikTok Belgium',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || 'electronics'
  const market = searchParams.get('market') || 'US'
  const cacheKey = `tiktok:${market}:${category}`

  try {
    const { data, cached, ageMinutes } = await withCache(cacheKey, async () => {
      const result = await askOpenAIJSON<{ data: any[] }>(`
You are a TikTok viral product analyst for ${MARKET_CONTEXT[market] || market}.
Identify viral products in "${category}" category.

Return JSON: { "data": [ {
  "productName": "Specific product name",
  "brand": "Brand or generic",
  "hashtag": "#hashtag",
  "secondaryHashtags": ["#tag2","#tag3","#tag4"],
  "videoViews": "XXM views",
  "creatorCount": 1500,
  "topCreatorSize": "macro"|"micro"|"nano",
  "salesEstimate": "estimated monthly sales",
  "revenue": "estimated monthly revenue",
  "price": "price with currency",
  "cogs": "estimated sourcing cost",
  "profitMargin": "XX%",
  "trend": "exploding"|"viral"|"trending"|"fading",
  "trendScore": 85,
  "whyViral": "2 sentence explanation",
  "viralHook": "what makes videos go viral",
  "ageGroup": "18-24"|"25-34"|"35-44"|"all",
  "gender": "male"|"female"|"mixed",
  "weeklyGrowth": "+XX%",
  "category": "${category}",
  "subcategory": "specific niche",
  "earlySignal": true,
  "peakTiming": "when to expect peak",
  "competitionLevel": "Low"|"Medium"|"High",
  "contentIdea": "video concept idea for seller",
  "targetAudience": "audience description",
  "seasonality": "year-round"|"seasonal"
} ] }

Generate 20 viral products. Mix trending and emerging. Make data realistic for ${market} market.`)
      return result.data
    }, 15)

    return NextResponse.json({ success: true, data, category, market, _cached: cached, _age: ageMinutes })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
