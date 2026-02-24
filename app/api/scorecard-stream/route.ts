import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get('product') || 'robot vacuum cleaner'
  const market = req.nextUrl.searchParams.get('market') || 'US'

  const prompt = `You are a Helium 10-style product scorecard for "${product}" in ${market}.
Return JSON: { "data": { "product": string, "market": string, "overallScore": number, "grade": "A+"|"A"|"B"|"C"|"D", "verdict": string, "scores": { "demand": number, "competition": number, "profitability": number, "trendMomentum": number, "sourcingEase": number, "marketFit": number }, "metrics": { "estimatedMonthlySales": number, "estimatedRevenue": string, "avgSellingPrice": string, "estimatedCOGS": string, "estimatedProfit": string, "roi": string, "paybackPeriod": string, "breakEvenUnits": number }, "keywords": [ { "term": string, "volume": string, "difficulty": number, "opportunity": boolean } ], "recommendations": string[], "risks": string[], "suggestedPrice": string, "suggestedMOQ": number } } — Only JSON.`

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
      max_tokens: 2500,
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
