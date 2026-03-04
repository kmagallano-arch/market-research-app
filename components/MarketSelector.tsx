'use client'
import { useState, useRef, useEffect } from 'react'
import { MARKETS, MarketCode, MARKET_CODES } from '@/lib/markets'

export default function MarketSelector({ value, onChange }: { value: MarketCode; onChange: (m: MarketCode) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const m = MARKETS[value]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 12px', borderRadius: 8,
          border: '1px solid #E2E8F0',
          background: 'white',
          cursor: 'pointer',
          fontSize: 13.5, fontWeight: 500, color: '#0F172A',
          fontFamily: 'Geist, sans-serif',
          boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
          transition: 'all 0.12s',
          minWidth: 160,
          justifyContent: 'space-between',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 16 }}>{m.flag}</span>
          <span>{m.label}</span>
        </span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', color: '#94A3B8', flexShrink: 0 }}>
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 50,
          background: 'white', border: '1px solid #E2E8F0',
          borderRadius: 10, boxShadow: '0 8px 24px rgba(16,24,40,0.12)',
          minWidth: 200, overflow: 'hidden',
          animation: 'fadeUp 0.12s ease',
        }}>
          {MARKET_CODES.map(code => {
            const mk = MARKETS[code]
            const active = value === code
            return (
              <button
                key={code}
                onClick={() => { onChange(code); setOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '9px 14px',
                  background: active ? '#F1F5F9' : 'white',
                  border: 'none', cursor: 'pointer',
                  fontSize: 13.5, color: active ? '#0F172A' : '#64748B',
                  fontFamily: 'Geist, sans-serif',
                  fontWeight: active ? 600 : 400,
                  textAlign: 'left',
                  transition: 'background 0.1s',
                  borderBottom: '1px solid #E2E8F0',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F1F5F9')}
                onMouseLeave={e => (e.currentTarget.style.background = active ? '#F1F5F9' : 'white')}
              >
                <span style={{ fontSize: 16 }}>{mk.flag}</span>
                <span style={{ flex: 1 }}>{mk.label}</span>
                <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Geist Mono, monospace' }}>{code}</span>
                {active && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l4 4 6-6" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
