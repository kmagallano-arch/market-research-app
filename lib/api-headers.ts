import { NextResponse } from 'next/server'

const CACHE_LONG = 'public, s-maxage=900, stale-while-revalidate=1800'
const CACHE_SHORT = 'public, s-maxage=300, stale-while-revalidate=600'
const CACHE_NONE = 'no-cache, no-store'

export function jsonResponse(
  data: any,
  opts: { status?: number; noCache?: boolean; short?: boolean } = {}
) {
  const { status = 200, noCache = false, short = false } = opts
  const cc = noCache ? CACHE_NONE : short ? CACHE_SHORT : CACHE_LONG
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': cc },
  })
}
