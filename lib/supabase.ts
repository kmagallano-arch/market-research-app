import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_supabase) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) throw new Error('Supabase env vars not configured')
      _supabase = createClient(url, key, {
        global: { fetch: (u, init) => fetch(u, { ...init, cache: 'no-store' }) },
      })
    }
    return (_supabase as any)[prop]
  },
})

const CACHE_TTL_MINUTES = 15

export interface CacheEntry {
  id?: number
  cache_key: string
  data: any
  created_at?: string
  updated_at?: string
}

/**
 * Get cached data from Supabase.
 * Returns null if not found or older than TTL.
 */
export async function getCache(key: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('cache')
    .select('data, updated_at')
    .eq('cache_key', key)
    .single()

  if (error || !data) return null

  const updatedAt = new Date(data.updated_at)
  const ageMinutes = (Date.now() - updatedAt.getTime()) / 1000 / 60

  if (ageMinutes > CACHE_TTL_MINUTES) return null

  return data.data
}

/**
 * Get stale cached data regardless of age (for background refresh pattern).
 */
export async function getStaleCache(key: string): Promise<{ data: any; ageMinutes: number } | null> {
  const { data, error } = await supabase
    .from('cache')
    .select('data, updated_at')
    .eq('cache_key', key)
    .single()

  if (error || !data) return null

  const ageMinutes = (Date.now() - new Date(data.updated_at).getTime()) / 1000 / 60
  return { data: data.data, ageMinutes }
}

/**
 * Save data to Supabase cache (upsert by key).
 */
export async function setCache(key: string, data: any): Promise<void> {
  await supabase
    .from('cache')
    .upsert({
      cache_key: key,
      data,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'cache_key' })
}

/**
 * Wrap an API handler with Supabase stale-while-revalidate caching.
 * - Serves cached data instantly if < 15 mins old
 * - If stale, returns old data immediately AND refreshes in background
 * - If no cache, fetches fresh and caches it
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMinutes = 15
): Promise<{ data: T; cached: boolean; ageMinutes?: number }> {
  const cached = await getStaleCache(key)

  // Fresh cache — return immediately
  if (cached && cached.ageMinutes < ttlMinutes) {
    return { data: cached.data as T, cached: true, ageMinutes: Math.round(cached.ageMinutes) }
  }

  // Stale or empty — fetch fresh
  const fresh = await fetcher()
  await setCache(key, fresh as any).catch(() => {})
  return { data: fresh, cached: false }
}
