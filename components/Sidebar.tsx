'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { useLogo } from './LogoContext'

// Clean SVG icons - minimalist line style
const Icons: Record<string, JSX.Element> = {
  dashboard: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>,
  star:      <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4 4.3 12.4 5 8.3 2 5.4l4.2-.8L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  search:    <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="M13 13l-2.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  trending:  <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M1 11l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 4h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  bolt:      <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M9 1L3 9h5l-1 6 6-8H8l1-6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  tiktok:    <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M11 1c.3 1.5 1.2 2.5 2.5 2.8v2.2c-1-.2-2-.6-2.5-1.2V10a4 4 0 11-4-4v2.2a1.8 1.8 0 101.8 1.8V1H11z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  trophy:    <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 10v3M5 14h6M6 1h4v6a2 2 0 01-4 0V1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 3H3v2a2 2 0 002 2M10 3h3v2a2 2 0 01-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  clipboard: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6 2V1h4v1M6 6h4M6 9h4M6 12h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  chart:     <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M1 14h14M4 10v4M8 6v8M12 2v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  globe:     <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 8h13M8 1.5c-2 2-3 4-3 6.5s1 4.5 3 6.5M8 1.5c2 2 3 4 3 6.5s-1 4.5-3 6.5" stroke="currentColor" strokeWidth="1.3"/></svg>,
  map:       <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M1 3l5-2 4 2 5-2v10l-5 2-4-2-5 2V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6 1v10M10 3v10" stroke="currentColor" strokeWidth="1.3"/></svg>,
  sparkle:   <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.5 3.5l2 2M10.5 10.5l2 2M3.5 12.5l2-2M10.5 5.5l2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  signal:    <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 14V8M5 14v-3M2 14v-1M11 14V5M14 14V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
}

const nav = [
  { section: 'Overview' },
  { href: '/',               label: 'Dashboard',          icon: 'dashboard' },
  { section: 'Research' },
  { href: '/bestsellers',    label: 'Bestsellers',         icon: 'star' },
  { href: '/keyword-search', label: 'Keyword Search',      icon: 'search',    badge: 'NEW' },
  { href: '/keywords',       label: 'Keywords',            icon: 'search' },
  { href: '/rising',         label: 'Rising Products',     icon: 'trending' },
  { href: '/exploding',      label: 'Exploding Topics',    icon: 'bolt',      badge: 'NEW' },
  { href: '/tiktok',         label: 'TikTok Viral',        icon: 'tiktok',    badge: 'NEW' },
  { section: 'Intelligence' },
  { href: '/competitor',     label: 'Competitor Analyzer', icon: 'trophy',    badge: 'NEW' },
  { href: '/scorecard',      label: 'Product Scorecard',   icon: 'clipboard', badge: 'NEW' },
  { href: '/price-history',  label: 'Price History',       icon: 'chart',     badge: 'NEW' },
  { href: '/market-sizing',  label: 'Market Sizing',       icon: 'globe',     badge: 'NEW' },
  { section: 'Markets' },
  { href: '/ph-market',      label: 'Philippines',    icon: 'map', flag: '🇵🇭' },
  { href: '/uk-market',      label: 'United Kingdom', icon: 'map', flag: '🇬🇧' },
  { href: '/de-market',      label: 'Germany',        icon: 'map', flag: '🇩🇪' },
  { href: '/nl-market',      label: 'Netherlands',    icon: 'map', flag: '🇳🇱' },
  { href: '/fr-market',      label: 'France',         icon: 'map', flag: '🇫🇷' },
  { href: '/se-market',      label: 'Sweden',         icon: 'map', flag: '🇸🇪' },
  { href: '/no-market',      label: 'Norway',         icon: 'map', flag: '🇳🇴' },
  { href: '/au-market',      label: 'Australia',      icon: 'map', flag: '🇦🇺' },
  { href: '/be-market',      label: 'Belgium',        icon: 'map', flag: '🇧🇪' },
  { section: 'Tools' },
  { href: '/recommendations',label: 'AI Picks',       icon: 'sparkle' },
  { href: '/trends',         label: 'Trends',         icon: 'signal' },
]

export default function Sidebar() {
  const path = usePathname()
  const { logoUrl, setLogoUrl } = useLogo()
  const fileRef = useRef<HTMLInputElement>(null)
  const [logoHover, setLogoHover] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setLogoUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <aside style={{
      width: 220,
      background: 'linear-gradient(170deg, #1a0a1e 0%, #2d0f3d 50%, #1a0a2e 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      borderRight: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* Subtle orbs */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(180,60,220,0.12)', filter: 'blur(50px)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: 60, left: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(100,20,180,0.1)', filter: 'blur(40px)', pointerEvents: 'none' }}/>

      {/* Logo */}
      <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            onClick={() => fileRef.current?.click()}
            onMouseEnter={() => setLogoHover(true)}
            onMouseLeave={() => setLogoHover(false)}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(255,255,255,0.95)',
              cursor: 'pointer', flexShrink: 0,
              position: 'relative', overflow: 'hidden',
              boxShadow: logoHover ? '0 0 0 2px rgba(255,255,255,0.5)' : '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'box-shadow 0.2s',
            }}
          >
            <img src={logoUrl || '/logo-v2.png'} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 2 }} />
            {logoHover && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M4 6l4-4 4 4M2 14h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', letterSpacing: '-0.2px', fontFamily: 'Geist, sans-serif' }}>Brainy Duck</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'Geist, sans-serif' }}>Market Intelligence</div>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        {logoUrl && (
          <button onClick={() => setLogoUrl(null)} style={{ display: 'block', marginTop: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', fontSize: 11, fontFamily: 'Geist, sans-serif' }}>reset logo</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: '6px 8px', flex: 1, position: 'relative' }}>
        {nav.map((item, idx) => {
          if ('section' in item) {
            return (
              <div key={idx} style={{
                fontSize: 10, fontWeight: 600,
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.8px', textTransform: 'uppercase',
                padding: '14px 8px 4px',
                fontFamily: 'Geist, sans-serif',
              }}>
                {item.section}
              </div>
            )
          }

          const active = path === item.href
          const isHov = hovered === item.href

          return (
            <Link
              key={item.href}
              href={item.href!}
              onMouseEnter={() => setHovered(item.href!)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 8px',
                borderRadius: 7,
                marginBottom: 1,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                fontFamily: 'Geist, sans-serif',
                transition: 'all 0.1s ease',
                color: active ? '#ffffff' : isHov ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
                background: active ? 'rgba(255,255,255,0.12)' : isHov ? 'rgba(255,255,255,0.06)' : 'transparent',
                borderLeft: active ? '2px solid rgba(255,255,255,0.7)' : '2px solid transparent',
                paddingLeft: active || isHov ? '10px' : '8px',
              }}
            >
              <span style={{ flexShrink: 0, width: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: active ? 1 : 0.7 }}>
                {'flag' in item ? <span style={{ fontSize: 13 }}>{(item as any).flag}</span> : Icons[item.icon as string]}
              </span>
              <span style={{ flex: 1, lineHeight: 1.3 }}>{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: 9, padding: '1px 5px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', borderRadius: 4, fontWeight: 700, letterSpacing: '0.3px', fontFamily: 'Geist, sans-serif' }}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#12B76A', boxShadow: '0 0 5px #12B76A' }} />
          <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.28)', fontFamily: 'Geist, sans-serif' }}>Live · GPT-4o mini · 14 tools</span>
        </div>
      </div>
    </aside>
  )
}
