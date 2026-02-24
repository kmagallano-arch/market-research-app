'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { useLogo } from './LogoContext'

const nav = [
  { href: '/', label: 'Dashboard', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7"/></svg> },
  { href: '/bestsellers', label: 'Bestsellers', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L10 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H6L8 1Z" fill="currentColor"/></svg> },
  { href: '/keywords', label: 'Keywords', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { href: '/rising', label: 'Rising Products', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polyline points="1,13 5,8 8,10 12,5 15,7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><polyline points="11,3 15,3 15,7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>, badge: 'NEW' },
  { href: '/ph-market', label: 'PH Market', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1.5C8 1.5 5 5 5 8s3 6.5 3 6.5M8 1.5C8 1.5 11 5 11 8s-3 6.5-3 6.5" stroke="currentColor" strokeWidth="1.2" opacity="0.7"/><path d="M1.5 8h13" stroke="currentColor" strokeWidth="1.2" opacity="0.7"/></svg> },
  { href: '/recommendations', label: 'AI Picks', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10.1l-3.7 2.4 1.4-4.3L2 5.5h4.5L8 1z" fill="currentColor"/></svg> },
  { href: '/trends', label: 'Trends', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polyline points="1,12 5,7 8,9 12,4 15,6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg> },
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
    <aside style={{ width: 230, background: '#1A1D2E', minHeight: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>

      {/* Logo */}
      <div style={{ padding: '20px 18px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Big logo image */}
        <div
          onClick={() => fileRef.current?.click()}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          style={{ width: 72, height: 72, borderRadius: 18, margin: '0 auto 12px', cursor: 'pointer', position: 'relative', overflow: 'hidden', border: hovering ? '2px dashed rgba(255,255,255,0.4)' : '2px solid rgba(255,255,255,0.08)', transition: 'border 0.15s', background: 'rgba(255,255,255,0.05)' }}
          title="Click to upload your logo"
        >
          <img src={logoUrl || '/logo.png'} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
          {hovering && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M4 6l4-4 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        {/* Name centered below logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'white', letterSpacing: '-0.3px' }}>Brainy Duck</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Market Intelligence</div>
        </div>
        {logoUrl && (
          <button onClick={() => setLogoUrl(null)} style={{ display: 'block', margin: '6px auto 0', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>reset logo</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 10px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '1px', textTransform: 'uppercase', padding: '0 10px', marginBottom: 8 }}>Navigation</div>
        {nav.map(item => {
          const active = path === item.href
          return (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, marginBottom: 2, color: active ? 'white' : 'rgba(255,255,255,0.45)', background: active ? 'rgba(255,255,255,0.1)' : 'transparent', textDecoration: 'none', fontSize: 14, fontWeight: active ? 600 : 400, transition: 'all 0.15s' }}>
              <span style={{ color: active ? '#2E6FFF' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {(item as any).badge && <span style={{ fontSize: 9, padding: '2px 6px', background: 'rgba(255,77,106,0.25)', color: '#FF6B8A', borderRadius: 4, fontWeight: 700 }}>{(item as any).badge}</span>}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00C48C', boxShadow: '0 0 5px #00C48C' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Live · GPT-4o mini</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Cache: 1hr · 7 markets</div>
      </div>
    </aside>
  )
}
