'use client'

export const PLATFORMS: Record<string, { label: string; color: string; markets: string[] }> = {
  all:      { label: 'All Platforms', color: '#6B7280', markets: [] },
  amazon:   { label: 'Amazon',        color: '#FF9900', markets: ['US','UK','DE','NL','SE','NO'] },
  shopee:   { label: 'Shopee',        color: '#EE4D2D', markets: ['PH'] },
  lazada:   { label: 'Lazada',        color: '#0F146D', markets: ['PH'] },
  bol:      { label: 'Bol.com',       color: '#0072EF', markets: ['NL'] },
  tiktok:   { label: 'TikTok Shop',   color: '#010101', markets: ['PH','UK'] },
  cdon:     { label: 'CDON',          color: '#E30613', markets: ['SE','NO'] },
}

export type PlatformKey = keyof typeof PLATFORMS

interface Props {
  value: PlatformKey
  onChange: (p: PlatformKey) => void
  market?: string
}

export default function PlatformFilter({ value, onChange, market }: Props) {
  // Filter platforms relevant to the selected market
  const available = Object.entries(PLATFORMS).filter(([key, p]) =>
    key === 'all' || !market || p.markets.includes(market)
  )

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: 2 }}>Platform</span>
      {available.map(([key, p]) => {
        const active = value === key
        return (
          <button key={key} onClick={() => onChange(key as PlatformKey)} style={{
            padding: '5px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 12,
            fontWeight: active ? 700 : 500, transition: 'all 0.15s',
            border: `1.5px solid ${active ? p.color : '#E8E9EF'}`,
            background: active ? `${p.color}15` : 'white',
            color: active ? p.color : '#6B7280',
            boxShadow: active ? `0 2px 6px ${p.color}20` : 'none',
          }}>
            {p.label}
          </button>
        )
      })}
    </div>
  )
}
