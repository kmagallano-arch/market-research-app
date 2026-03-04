import { NextRequest } from 'next/server'
import { jsonResponse } from '@/lib/api-headers'

export const runtime = 'nodejs'
export const maxDuration = 60

const MARKETS = ['US','UK','DE','NL','FR','SE','NO','AU','BE','PH']

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return jsonResponse({ error: 'Unauthorized' }, { status: 401, noCache: true })
  }

  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://brainy-duck.vercel.app'
  const headers = { 'x-internal': 'cron' }

  // Fire all in parallel - just needs to hit the endpoints to trigger cache fill
  const calls = [
    ...MARKETS.map(m => fetch(`${base}/api/bestsellers?market=${m}&category=electronics`, { headers, cache: 'no-store' })),
    ...MARKETS.map(m => fetch(`${base}/api/rising?market=${m}`, { headers, cache: 'no-store' })),
    ...MARKETS.map(m => fetch(`${base}/api/${m.toLowerCase()}-market`, { headers, cache: 'no-store' })),
    fetch(`${base}/api/recommendations?market=ALL`, { headers, cache: 'no-store' }),
  ]

  const results = await Promise.allSettled(calls)
  const ok = results.filter(r => r.status === 'fulfilled').length

  return jsonResponse({ success: true, warmed: ok, total: calls.length, timestamp: new Date().toISOString() }, { noCache: true })
}
