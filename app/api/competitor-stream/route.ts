import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get('product') || 'robot vacuum cleaner'
  const market = req.nextUrl.searchParams.get('market') || 'US'

  const prompt = `You are a Jungle Scout competitor analyzer for "${product}" in ${market} market.
Return JSON: { "data": { "product": "${product}", "market": "${market}", "topCompetitors": [ { "name": string, "brand": string, "price": string, "rating": number, "reviews": number, "monthlyRevenue": string, "monthlySales": number, "bsr": number, "mainKeywords": string[], "strengths": string[], "weaknesses": string[], "opportunityGap": string, "listingScore": number, "imageCount": number, "hasVideo": boolean, "fulfillment": string } ], "marketSummary": { "avgPrice": string, "avgRating": number, "totalMonthlyRevenue": string, "topKeyword": string, "entryDifficulty": "Easy"|"Medium"|"Hard", "recommendation": string }, "keywordGaps": string[], "pricingOpportunity": string } } — 6 competitors. Only JSON.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        { role: 'system', content: 'You are a market research AI. Always respond with valid JSON only, no markdown.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    })
  })

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'API error' }), { status: 500 })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') { controller.close(); return }
          try {
            const text = JSON.parse(data).choices?.[0]?.delta?.content || ''
            if (text) controller.enqueue(new TextEncoder().encode(text))
          } catch {}
        }
      }
      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    }
  })
}
