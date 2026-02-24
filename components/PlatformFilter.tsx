'use client'

export const PLATFORMS: Record<string, { label: string; color: string; markets: string[]; keywords: string[] }> = {
  all:    { label: 'All Platforms', color: '#6B7280', markets: [], keywords: [] },
  amazon: { label: 'Amazon',        color: '#FF9900', markets: ['US','UK','DE','NL','SE','NO'], keywords: ['amazon'] },
  shopee: { label: 'Shopee',        color: '#EE4D2D', markets: ['PH'], keywords: ['shopee'] },
  lazada: { label: 'Lazada',        color: '#0F146D', markets: ['PH'], keywords: ['lazada'] },
  bol:    { label: 'Bol.com',       color: '#0072EF', markets: ['NL'], keywords: ['bol'] },
  tiktok: { label: 'TikTok Shop',   color: '#FE2C55', markets: ['PH','UK'], keywords: ['tiktok','tik tok'] },
  cdon:   { label: 'CDON',          color: '#E30613', markets: ['SE','NO'], keywords: ['cdon'] },
}

export type PlatformKey = keyof typeof PLATFORMS

// Helper: does a product/item match the selected platform?
export function matchesPlatform(item: any, platform: PlatformKey): boolean {
  if (platform === 'all') return true
  const p = PLATFORMS[platform]
  const searchStr = [item.platform, item.source, item.marketplace, item.channel, item.title, item.name]
    .filter(Boolean).join(' ').toLowerCase()
  return p.keywords.some(kw => searchStr.includes(kw)) || p.markets.length === 0
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

  return (
    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: 2 }}>Platform:</span>
      {available.map(([key, p]) => {
        const active = value === key
        return (
          <button key={key} onClick={() => onChange(key as PlatformKey)} style={{
            padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13,
            fontWeight: active ? 700 : 500, transition: 'all 0.15s',
            border: `1.5px solid ${active ? p.color : '#E8E9EF'}`,
            background: active ? `${p.color}15` : 'white',
            color: active ? p.color : '#6B7280',
            boxShadow: active ? `0 2px 6px ${p.color}25` : 'none',
          }}>
            {p.label}
          </button>
        )
      })}
    </div>
  )
}
