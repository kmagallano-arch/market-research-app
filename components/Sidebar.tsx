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
  const [logoHover, setLogoHover] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setLogoUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <aside style={{
      width: 234,
      background: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      borderRight: '1px solid #E8E9EF',
      boxShadow: '2px 0 12px rgba(99,102,241,0.06)',
    }}>

      {/* Logo */}
      <div style={{ padding: '20px 18px 14px', borderBottom: '1px solid #F0F1F5', flexShrink: 0 }}>
        <div
          onClick={() => fileRef.current?.click()}
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
          style={{
            width: 80, height: 80, borderRadius: '50%',
            margin: '0 auto 12px', cursor: 'pointer',
            position: 'relative', overflow: 'hidden',
            background: '#F4F5FF',
            boxShadow: logoHover
              ? '0 0 0 3px rgba(99,102,241,0.3), 0 6px 20px rgba(99,102,241,0.2)'
              : '0 2px 12px rgba(99,102,241,0.12)',
            transition: 'box-shadow 0.2s',
          }}
          title="Click to upload your logo"
        >
          <img
            src={logoUrl || '/logo.png'}
            alt="Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', padding: 4 }}
          />
          {logoHover && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M4 6l4-4 4 4" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12h12" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E', letterSpacing: '-0.2px' }}>Brainy Duck</div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Market Intelligence</div>
        </div>
        {logoUrl && (
          <button onClick={() => setLogoUrl(null)} style={{ display: 'block', margin: '6px auto 0', background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E0', fontSize: 11 }}>reset</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 10px', flex: 1 }}>
        {nav.map((item, idx) => {
          if ('section' in item) {
            return (
              <div key={idx} style={{
                fontSize: 10, fontWeight: 700,
                color: '#C4C9D4',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                padding: '14px 8px 4px',
              }}>
                {item.section}
              </div>
            )
          }

          const active = path === item.href
          const isHovered = hovered === item.href

          return (
            <Link
              key={item.href}
              href={item.href!}
              onMouseEnter={() => setHovered(item.href!)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '7px 10px',
                borderRadius: 8,
                marginBottom: 1,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                transition: 'all 0.12s ease',
                // Text color: dark on active, medium-dark on hover, grey at rest
                color: active ? '#4F46E5' : isHovered ? '#1A1D2E' : '#6B7280',
                // Background
                background: active
                  ? 'rgba(99,102,241,0.09)'
                  : isHovered
                    ? 'rgba(99,102,241,0.05)'
                    : 'transparent',
                // Left accent
                borderLeft: active
                  ? '3px solid #6366F1'
                  : isHovered
                    ? '3px solid rgba(99,102,241,0.25)'
                    : '3px solid transparent',
                // Subtle divider
                borderBottom: '1px solid #F3F4F6',
                borderTop: 'none',
                borderRight: 'none',
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0, width: 18, textAlign: 'center' }}>
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: 9, padding: '2px 6px',
                  background: active ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.07)',
                  color: active ? '#4F46E5' : '#818CF8',
                  borderRadius: 4, fontWeight: 700,
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #F0F1F5', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00C48C', boxShadow: '0 0 5px #00C48C' }} />
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>Live · GPT-4o mini</span>
        </div>
        <div style={{ fontSize: 11, color: '#C4C9D4' }}>13 tools · 9 markets</div>
      </div>
    </aside>
  )
}
