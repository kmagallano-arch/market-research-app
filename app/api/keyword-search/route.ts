import { NextRequest, NextResponse } from 'next/server'
import { askOpenAIJSON } from '@/lib/openai'

export const runtime = 'nodejs'

async function fetchDataForSEO(keyword: string, locationCode: number, languageCode: string) {
  const apiLogin = process.env.DATAFORSEO_LOGIN
  const apiPassword = process.env.DATAFORSEO_PASSWORD

  if (!apiLogin || !apiPassword) return null

  const auth = Buffer.from(`${apiLogin}:${apiPassword}`).toString('base64')

  try {
    const res = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([{
        keywords: [keyword],
        location_code: locationCode,
        language_code: languageCode,
        include_adult_keywords: false,
      }])
    })
    const data = await res.json()
    const result = data?.tasks?.[0]?.result?.[0]
    if (!result) return null
    return {
      searchVolume: result.search_volume,
      competition: result.competition,
      competitionIndex: result.competition_index,
      cpc: result.cpc,
      monthlySearches: result.monthly_searches?.slice(-12) || [],
    }
  } catch {
    return null
  }
}

async function fetchRelatedKeywords(keyword: string, locationCode: number, languageCode: string) {
  const apiLogin = process.env.DATAFORSEO_LOGIN
  const apiPassword = process.env.DATAFORSEO_PASSWORD
  if (!apiLogin || !apiPassword) return null

  const auth = Buffer.from(`${apiLogin}:${apiPassword}`).toString('base64')

  try {
    const res = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_keywords/live', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([{
        keywords: [keyword],
        location_code: locationCode,
        language_code: languageCode,
        limit: 20,
      }])
    })
    const data = await res.json()
    return data?.tasks?.[0]?.result || null
  } catch {
    return null
  }
}

const LOCATION_MAP: Record<string, { code: number; lang: string; currency: string; symbol: string }> = {
  US: { code: 2840, lang: 'en',  currency: 'USD', symbol: '$'  },
  UK: { code: 2826, lang: 'en',  currency: 'GBP', symbol: '£'  },
  AU: { code: 2036, lang: 'en',  currency: 'AUD', symbol: 'A$' },
  DE: { code: 2276, lang: 'de',  currency: 'EUR', symbol: '€'  },
  NL: { code: 2528, lang: 'nl',  currency: 'EUR', symbol: '€'  },
  FR: { code: 2250, lang: 'fr',  currency: 'EUR', symbol: '€'  },
  SE: { code: 2752, lang: 'sv',  currency: 'SEK', symbol: 'kr' },
  NO: { code: 2578, lang: 'no',  currency: 'NOK', symbol: 'kr' },
  BE: { code: 2056, lang: 'nl',  currency: 'EUR', symbol: '€'  },
  PH: { code: 2608, lang: 'en',  currency: 'PHP', symbol: '₱'  },
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const keyword = searchParams.get('keyword') || 'robot vacuum'
  const market = searchParams.get('market') || 'US'
  const loc = LOCATION_MAP[market] || LOCATION_MAP.US

  try {
    // Try DataForSEO first
    const [liveData, relatedRaw] = await Promise.all([
      fetchDataForSEO(keyword, loc.code, loc.lang),
      fetchRelatedKeywords(keyword, loc.code, loc.lang),
    ])

    const hasLiveData = !!liveData

    // Build related keywords list from DataForSEO or fall back to AI
    let relatedKeywords: any[] = []
    if (relatedRaw && relatedRaw.length > 0) {
      relatedKeywords = relatedRaw.slice(0, 20).map((k: any) => ({
        keyword: k.keyword,
        searchVolume: k.search_volume?.toLocaleString() || '—',
        searchVolumeRaw: k.search_volume || 0,
        competition: k.competition === 'HIGH' ? 'High' : k.competition === 'LOW' ? 'Low' : 'Medium',
        competitionIndex: k.competition_index || 50,
        cpc: k.cpc ? `${loc.symbol}${k.cpc.toFixed(2)}` : '—',
        source: 'live',
      }))
    }

    // AI enrichment — fill gaps, add insights, trend data
    const aiPrompt = hasLiveData
      ? `Keyword research enrichment for "${keyword}" in ${market} market.
Live data: search volume ${liveData!.searchVolume?.toLocaleString()}, competition index ${liveData!.competitionIndex}, CPC $${liveData!.cpc}.
${relatedKeywords.length > 0 ? `Related keywords from live data: ${relatedKeywords.slice(0,5).map(k=>k.keyword).join(', ')}` : ''}
Return JSON: { "insights": string[], "trendData": [number x 12], "difficulty": number, "opportunity": string, "bestMarkets": string[], "seasonality": string, "aiRelated": [{"keyword":string,"searchVolume":string,"competition":"Low"|"Medium"|"High","competitionIndex":number,"cpc":string,"intent":"informational"|"commercial"|"transactional","difficulty":number}] }
- trendData: 12 monthly values 0-100 showing search interest trend
- difficulty: 0-100 SEO difficulty score
- opportunity: one sentence opportunity assessment
- aiRelated: 10 additional related keywords not already in the live list
- insights: 4 actionable insights for sellers`
      : `You are a keyword research expert for "${keyword}" in ${market} market.
Return JSON: { "mainKeyword": {"searchVolume":string,"competitionIndex":number,"cpc":string}, "insights": string[], "trendData": [number x 12], "difficulty": number, "opportunity": string, "bestMarkets": string[], "seasonality": string, "aiRelated": [{"keyword":string,"searchVolume":string,"competition":"Low"|"Medium"|"High","competitionIndex":number,"cpc":string,"intent":"informational"|"commercial"|"transactional","difficulty":number}] }
- Generate 20 related keywords in aiRelated
- Use realistic data for ${market} with ${loc.currency} currency
- trendData: 12 monthly interest values 0-100
- insights: 4 actionable insights for e-commerce sellers`

    const aiData = await askOpenAIJSON<any>(aiPrompt)

    // Merge live + AI related keywords
    const allRelated = [
      ...relatedKeywords,
      ...(aiData.aiRelated || []).map((k: any) => ({ ...k, source: 'ai' }))
    ]

    // Build monthly trend from DataForSEO or AI
    let trendData = aiData.trendData || []
    if (liveData?.monthlySearches && liveData.monthlySearches.length > 0) {
      const max = Math.max(...liveData.monthlySearches.map((m: any) => m.search_volume || 0))
      trendData = liveData.monthlySearches.map((m: any) => max > 0 ? Math.round((m.search_volume / max) * 100) : 50)
    }

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    return NextResponse.json({
      success: true,
      keyword,
      market,
      hasLiveData,
      main: {
        keyword,
        searchVolume: liveData?.searchVolume?.toLocaleString() || aiData.mainKeyword?.searchVolume || '—',
        competitionIndex: liveData?.competitionIndex ?? aiData.mainKeyword?.competitionIndex ?? 50,
        competition: liveData?.competition || (liveData?.competitionIndex > 66 ? 'HIGH' : liveData?.competitionIndex > 33 ? 'MEDIUM' : 'LOW') || 'MEDIUM',
        cpc: liveData?.cpc ? `${loc.symbol}${liveData.cpc.toFixed(2)}` : aiData.mainKeyword?.cpc || '—',
        difficulty: aiData.difficulty || 50,
        opportunity: aiData.opportunity || '',
        seasonality: aiData.seasonality || '',
      },
      trendData: trendData.slice(0, 12),
      trendLabels: months,
      related: allRelated,
      insights: aiData.insights || [],
      bestMarkets: aiData.bestMarkets || [],
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
