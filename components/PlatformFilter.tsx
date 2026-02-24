'use client'

export const PLATFORMS: Record<string, { label: string; color: string; markets: string[] }> = {
  all:      { label: 'All',         color: '#6B7280', markets: [] },
  amazon:   { label: 'Amazon',      color: '#FF9900', markets: ['US','UK','DE','NL','FR','SE','NO','AU','BE'] },
  shopee:   { label: 'Shopee',      color: '#EE4D2D', markets: ['PH'] },
  lazada:   { label: 'Lazada',      color: '#0F146D', markets: ['PH'] },
  bol:      { label: 'Bol.com',     color: '#0072EF', markets: ['NL','BE'] },
  cdiscount:{ label: 'Cdiscount',   color: '#E30613', markets: ['FR'] },
  fnac:     { label: 'Fnac',        color: '#F7A600', markets: ['FR','BE'] },
  cdon:     { label: 'CDON',        color: '#E30613', markets: ['SE','NO'] },
  elkjop:   { label: 'Elkjøp',      color: '#003087', markets: ['NO'] },
  catch:    { label: 'Catch.com',   color: '#00A650', markets: ['AU'] },
  ebay:     { label: 'eBay',        color: '#E53238', markets: ['US','UK','AU'] },
  tiktok:   { label: 'TikTok Shop', color: '#FE2C55', markets: ['PH','UK','US'] },
}

export type PlatformKey = keyof typeof PLATFORMS

// Match by platform field on item
export function matchesPlatform(item: any, platform: PlatformKey): boolean {
  if (platform === 'all') return true
  const itemPlatform = (item.platform || item.source || item.marketplace || '').toLowerCase()
  return itemPlatform.includes(platform) || itemPlatform.includes(PLATFORMS[platform]?.label?.toLowerCase() || '')
}

interface Props {
  value: PlatformKey
  onChange: (p: PlatformKey) => void
  market?: string
}

export default function PlatformFilter({ value, onChange, market }: Props) {
  const available = Object.entries(PLATFORMS).filter(([key, p]) =>
    key === 'all' || !market || p.markets.includes(market)
  )

  if (available.length <= 1) return null

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: 2, fontFamily: 'Geist, sans-serif' }}>Platform</span>
      {available.map(([key, p]) => {
        const active = value === key
        return (
          <button key={key} onClick={() => onChange(key as PlatformKey)} style={{
            padding: '5px 12px', borderRadius: 99, cursor: 'pointer', fontSize: 12.5,
            fontWeight: active ? 600 : 400, transition: 'all 0.12s',
            border: `1px solid ${active ? p.color : '#EAECF0'}`,
            background: active ? `${p.color}12` : 'white',
            color: active ? p.color : '#475467',
            fontFamily: 'Geist, sans-serif',
          }}>
            {p.label}
          </button>
        )
      })}
    </div>
  )
}
