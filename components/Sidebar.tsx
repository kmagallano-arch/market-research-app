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
  { href: '/keyword-search', label: 'Keyword Search',      icon: '🔍', badge: 'NEW' },
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
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .nav-link { transition: all 0.15s ease !important; }
        .nav-link:hover { background: rgba(255,255,255,0.12) !important; color: #ffffff !important; border-left-color: rgba(255,255,255,0.5) !important; }
      `}</style>
      <aside style={{
        width: 234,
        background: 'linear-gradient(160deg, #1a0a1e 0%, #2d0f3d 45%, #1a0a2e 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '4px 0 24px rgba(100,0,80,0.3)',
      }}>

        {/* Glass overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.06) 100%)',
          backdropFilter: 'blur(0px)',
        }}/>

        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(192,38,211,0.2)', filter: 'blur(40px)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', bottom: 80, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(147,51,234,0.18)', filter: 'blur(35px)', pointerEvents: 'none' }}/>

        {/* Logo */}
        <div style={{ padding: '22px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.12)', flexShrink: 0, position: 'relative' }}>
          <div
            onClick={() => fileRef.current?.click()}
            onMouseEnter={() => setLogoHover(true)}
            onMouseLeave={() => setLogoHover(false)}
            style={{
              width: 80, height: 80, borderRadius: '50%',
              margin: '0 auto 12px', cursor: 'pointer',
              position: 'relative', overflow: 'hidden',
              background: 'transparent',
              boxShadow: logoHover
                ? '0 0 0 3px rgba(255,255,255,0.6), 0 8px 28px rgba(0,0,0,0.2)'
                : '0 4px 20px rgba(0,0,0,0.15), 0 0 0 2px rgba(255,255,255,0.2)',
              transition: 'box-shadow 0.2s',
            }}
            title="Click to upload your logo"
          >
            <img
              src={logoUrl || '/logo-v2.png'}
              alt="Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }}
            />
            {logoHover && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,145,178,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v8M4 6l4-4 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.2px', textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>Brainy Duck</div>
            <div style={{ fontSize: 11, color: 'rgba(186,230,253,0.7)', marginTop: 2 }}>Market Intelligence</div>
          </div>
          {logoUrl && (
            <button onClick={() => setLogoUrl(null)} style={{ display: 'block', margin: '6px auto 0', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>reset</button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ padding: '8px 10px', flex: 1, position: 'relative' }}>
          {nav.map((item, idx) => {
            if ('section' in item) {
              return (
                <div key={idx} style={{
                  fontSize: 10, fontWeight: 700,
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.9px',
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
                  transition: 'all 0.15s ease',
                  color: active ? '#ffffff' : isHovered ? '#ffffff' : 'rgba(255,255,255,0.90)',
                  background: active
                    ? 'rgba(255,255,255,0.18)'
                    : isHovered
                      ? 'rgba(255,255,255,0.1)'
                      : 'transparent',
                  borderLeft: active
                    ? '3px solid rgba(255,255,255,0.9)'
                    : isHovered
                      ? '3px solid rgba(255,255,255,0.35)'
                      : '3px solid transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  borderTop: 'none',
                  borderRight: 'none',
                  boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <span style={{ fontSize: 14, flexShrink: 0, width: 18, textAlign: 'center', opacity: active || isHovered ? 1 : 0.8 }}>
                  {item.icon}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: 9, padding: '2px 6px',
                    background: 'rgba(255,255,255,0.15)',
                    color: '#e0f7fa',
                    borderRadius: 4, fontWeight: 700,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Live · GPT-4o mini</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>13 tools · 9 markets</div>
        </div>
      </aside>
    </>
  )
}
