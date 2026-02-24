'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { useLogo } from './LogoContext'

const nav = [
  { section: 'Overview' },
  { href: '/', label: 'Dashboard', icon: '◼' },
  { section: 'Research' },
  { href: '/bestsellers',    label: 'Bestsellers',        icon: '★' },
  { href: '/keywords',       label: 'Keywords',            icon: '⌕' },
  { href: '/rising',         label: 'Rising Products',     icon: '↗', badge: 'NEW' },
  { href: '/exploding',      label: 'Exploding Topics',    icon: '💥', badge: 'NEW' },
  { href: '/tiktok',         label: 'TikTok Viral',        icon: '🎵', badge: 'NEW' },
  { section: 'Intelligence' },
  { href: '/competitor',     label: 'Competitor Analyzer', icon: '🏆', badge: 'NEW' },
  { href: '/scorecard',      label: 'Product Scorecard',   icon: '📋', badge: 'NEW' },
  { href: '/price-history',  label: 'Price History',       icon: '📊', badge: 'NEW' },
  { href: '/market-sizing',  label: 'Market Sizing',       icon: '🌍', badge: 'NEW' },
  { section: 'Markets' },
  { href: '/ph-market',      label: 'Philippines',    icon: '🇵🇭' },
  { href: '/uk-market',      label: 'United Kingdom', icon: '🇬🇧' },
  { href: '/de-market',      label: 'Germany',        icon: '🇩🇪' },
  { href: '/nl-market',      label: 'Netherlands',    icon: '🇳🇱' },
  { href: '/fr-market',      label: 'France',         icon: '🇫🇷' },
  { href: '/se-market',      label: 'Sweden',         icon: '🇸🇪' },
  { href: '/no-market',      label: 'Norway',         icon: '🇳🇴' },
  { href: '/au-market',      label: 'Australia',      icon: '🇦🇺' },
  { href: '/be-market',      label: 'Belgium',        icon: '🇧🇪' },
  { section: 'Tools' },
  { href: '/recommendations',label: 'AI Picks',       icon: '✦' },
  { href: '/trends',         label: 'Trends',         icon: '📡' },
]

export default function Sidebar() {
  const path = usePathname()
  const { logoUrl, setLogoUrl } = useLogo()
  const fileRef = useRef<HTMLInputElement>(null)
  const [hovering, setHovering] = useState(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setLogoUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <aside style={{
      width: 230,
      background: 'linear-gradient(175deg, #0c1445 0%, #1a1065 45%, #2a1760 100%)',
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      borderRight: '1px solid rgba(99,102,241,0.15)'
    }}>

      {/* Logo */}
      <div style={{ padding: '24px 18px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        {/* Circular logo — no border box */}
        <div
          onClick={() => fileRef.current?.click()}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          style={{
            width: 80, height: 80, borderRadius: '50%',
            margin: '0 auto 14px', cursor: 'pointer',
            position: 'relative', overflow: 'hidden',
            background: 'white',
            boxShadow: hovering
              ? '0 0 0 3px rgba(139,92,246,0.6), 0 8px 32px rgba(99,102,241,0.5)'
              : '0 4px 24px rgba(99,102,241,0.4)',
            transition: 'box-shadow 0.2s',
          }}
          title="Click to upload your logo"
        >
          <img
            src={logoUrl || '/logo.png'}
            alt="Logo"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />
          {hovering && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M4 6l4-4 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'white', letterSpacing: '-0.2px' }}>Brainy Duck</div>
          <div style={{ fontSize: 11, color: 'rgba(180,170,255,0.5)', marginTop: 3 }}>Market Intelligence</div>
        </div>
        {logoUrl && (
          <button onClick={() => setLogoUrl(null)} style={{ display: 'block', margin: '8px auto 0', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>reset</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: '10px 10px', flex: 1 }}>
        {nav.map((item, idx) => {
          if ('section' in item) {
            return (
              <div key={idx} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(180,170,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase', padding: '12px 10px 4px' }}>
                {item.section}
              </div>
            )
          }
          const active = path === item.href
          return (
            <Link
              key={item.href}
              href={item.href!}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '8px 10px', borderRadius: 9, marginBottom: 1,
                color: active ? 'white' : 'rgba(200,190,255,0.5)',
                background: active ? 'rgba(139,92,246,0.22)' : 'transparent',
                textDecoration: 'none', fontSize: 13,
                fontWeight: active ? 600 : 400, transition: 'all 0.15s',
                borderLeft: active ? '3px solid #a78bfa' : '3px solid transparent',
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0, width: 18, textAlign: 'center' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: 9, padding: '1px 5px', background: 'rgba(167,139,250,0.2)', color: '#c4b5fd', borderRadius: 4, fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00C48C', boxShadow: '0 0 6px #00C48C' }} />
          <span style={{ fontSize: 12, color: 'rgba(180,170,255,0.4)' }}>Live · GPT-4o mini</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(180,170,255,0.25)' }}>13 tools · 9 markets</div>
      </div>
    </aside>
  )
}
