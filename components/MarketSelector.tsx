'use client'
import { MARKETS, MarketCode, MARKET_CODES } from '@/lib/markets'

export default function MarketSelector({ value, onChange }: { value: MarketCode; onChange: (m: MarketCode) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {MARKET_CODES.map(code => {
        const m = MARKETS[code]
        const active = value === code
        return (
          <button key={code} onClick={() => onChange(code)} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 13px', borderRadius: 20,
            border: `1.5px solid ${active ? m.color : '#E8E9EF'}`,
            background: active ? `${m.color}12` : 'white',
            color: active ? m.color : '#6B7280',
            fontSize: 12, fontWeight: active ? 700 : 500,
            cursor: 'pointer', transition: 'all 0.15s',
            boxShadow: active ? `0 2px 8px ${m.color}25` : 'none',
          }}>
            {m.flag} {code}
          </button>
        )
      })}
    </div>
  )
}
