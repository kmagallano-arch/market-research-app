'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { useLogo } from './LogoContext'

const Icons: Record<string, JSX.Element> = {
  dashboard: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>,
  star:      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4 4.3 12.4 5 8.3 2 5.4l4.2-.8L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  search:    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="M13 13l-2.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  trending:  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 11l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 4h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  bolt:      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M9 1L3 9h5l-1 6 6-8H8l1-6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  tiktok:    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M11 1c.3 1.5 1.2 2.5 2.5 2.8v2.2c-1-.2-2-.6-2.5-1.2V10a4 4 0 11-4-4v2.2a1.8 1.8 0 101.8 1.8V1H11z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  trophy:    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 10v3M5 14h6M6 1h4v6a2 2 0 01-4 0V1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 3H3v2a2 2 0 002 2M10 3h3v2a2 2 0 01-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  clipboard: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6 2V1h4v1M6 6h4M6 9h4M6 12h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  chart:     <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 14h14M4 10v4M8 6v8M12 2v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  globe:     <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 8h13M8 1.5c-2 2-3 4-3 6.5s1 4.5 3 6.5M8 1.5c2 2 3 4 3 6.5s-1 4.5-3 6.5" stroke="currentColor" strokeWidth="1.3"/></svg>,
  sparkle:   <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.5 3.5l2 2M10.5 10.5l2 2M3.5 12.5l2-2M10.5 5.5l2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  signal:    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 14V8M5 14v-3M2 14v-1M11 14V5M14 14V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
}

const nav = [
  { section: 'Overview' },
  { href: '/',               label: 'Dashboard',           icon: 'dashboard' },
  { section: 'Research' },
  { href: '/bestsellers',    label: 'Bestsellers',          icon: 'star' },
  { href: '/keyword-search', label: 'Keyword Search',       icon: 'search',    badge: 'NEW' },
  { href: '/keywords',       label: 'Keywords',             icon: 'search' },
  { href: '/rising',         label: 'Rising Products',      icon: 'trending' },
  { href: '/exploding',      label: 'Exploding Topics',     icon: 'bolt',      badge: 'NEW' },
  { href: '/tiktok',         label: 'TikTok Viral',         icon: 'tiktok',    badge: 'NEW' },
  { section: 'Intelligence' },
  { href: '/competitor',     label: 'Competitor Analyzer',  icon: 'trophy',    badge: 'NEW' },
  { href: '/scorecard',      label: 'Product Scorecard',    icon: 'clipboard', badge: 'NEW' },
  { href: '/price-history',  label: 'Price History',        icon: 'chart',     badge: 'NEW' },
  { href: '/market-sizing',  label: 'Market Sizing',        icon: 'globe',     badge: 'NEW' },
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
      width: 234,
      background: 'linear-gradient(170deg, #0a0f2e 0%, #1e3a8a 50%, #0f1f5e 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      borderRight: '1px solid rgba(255,255,255,0.08)',
    }}>
      {/* Orbs */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', filter: 'blur(50px)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: 60, left: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(30,58,138,0.2)', filter: 'blur(40px)', pointerEvents: 'none' }}/>

      {/* Logo */}
      <div style={{ padding: '22px 18px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, position: 'relative' }}>
        <div
          onClick={() => fileRef.current?.click()}
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
          style={{
            width: 80, height: 80, borderRadius: '50%',
            margin: '0 auto 12px', cursor: 'pointer',
            position: 'relative', overflow: 'hidden',
            background: 'rgba(255,255,255,0.95)',
            boxShadow: logoHover
              ? '0 0 0 3px rgba(255,255,255,0.5), 0 8px 24px rgba(0,0,0,0.2)'
              : '0 4px 16px rgba(0,0,0,0.2)',
            transition: 'box-shadow 0.2s',
          }}
          title="Click to upload your logo"
        >
          <img src={logoUrl || '/logo-v2.png'} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
          {logoHover && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M4 6l4-4 4 4M2 14h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.2px', fontFamily: 'Geist, sans-serif' }}>Brainy Duck</div>
          <div style={{ fontSize: 12, color: 'rgba(255,240,180,0.4)', fontFamily: 'Geist, sans-serif', marginTop: 2 }}>Market Intelligence</div>
        </div>
        {logoUrl && (
          <button onClick={() => setLogoUrl(null)} style={{ display: 'block', margin: '6px auto 0', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', fontSize: 11, fontFamily: 'Geist, sans-serif' }}>reset</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 10px', flex: 1, position: 'relative' }}>
        {nav.map((item, idx) => {
          if ('section' in item) {
            return (
              <div key={idx} style={{
                fontSize: 11, fontWeight: 600,
                color: 'rgba(255,240,180,0.3)',
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
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '7px 10px',
                borderRadius: 8,
                marginBottom: 1,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                fontFamily: 'Geist, sans-serif',
                transition: 'all 0.12s ease',
                color: active || isHov ? '#ffffff' : 'rgba(255,240,180,0.65)',
                background: active ? 'rgba(255,255,255,0.12)' : isHov ? 'rgba(255,255,255,0.06)' : 'transparent',
                borderLeft: active ? '2px solid rgba(255,255,255,0.7)' : isHov ? '2px solid rgba(255,255,255,0.2)' : '2px solid transparent',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                borderTop: 'none', borderRight: 'none',
              }}
            >
              <span style={{ flexShrink: 0, width: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: active || isHov ? 1 : 0.65 }}>
                {'flag' in item
                  ? <span style={{ fontSize: 14 }}>{(item as any).flag}</span>
                  : Icons[(item as any).icon]}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: 9, padding: '1px 5px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,240,180,0.45)', borderRadius: 4, fontWeight: 700, letterSpacing: '0.3px', fontFamily: 'Geist, sans-serif' }}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#12B76A', boxShadow: '0 0 5px #12B76A' }} />
          <span style={{ fontSize: 12.5, color: 'rgba(255,240,180,0.35)', fontFamily: 'Geist, sans-serif' }}>Live · GPT-4o mini</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,240,180,0.2)', fontFamily: 'Geist, sans-serif' }}>14 tools</div>
      </div>
    </aside>
  )
}
