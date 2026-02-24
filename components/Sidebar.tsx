'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { useLogo } from './LogoContext'

const nav = [
  { href: '/', label: 'Dashboard', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7"/></svg> },
  { href: '/bestsellers', label: 'Bestsellers', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1L10 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H6L8 1Z" fill="currentColor"/></svg> },
  { href: '/keywords', label: 'Keywords', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { href: '/rising', label: 'Rising Products', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><polyline points="1,13 5,8 8,10 12,5 15,7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><polyline points="11,3 15,3 15,7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>, badge: 'NEW' },
  { href: '/ph-market', label: 'PH Market', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1.5C8 1.5 5 5 5 8s3 6.5 3 6.5M8 1.5C8 1.5 11 5 11 8s-3 6.5-3 6.5" stroke="currentColor" strokeWidth="1.2" opacity="0.7"/><path d="M1.5 8h13" stroke="currentColor" strokeWidth="1.2" opacity="0.7"/></svg> },
  { href: '/recommendations', label: 'AI Picks', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10.1l-3.7 2.4 1.4-4.3L2 5.5h4.5L8 1z" fill="currentColor"/></svg> },
  { href: '/trends', label: 'Trends', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><polyline points="1,12 5,7 8,9 12,4 15,6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg> },
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
    <aside style={{ width: 220, background: '#1A1D2E', minHeight: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
      
      {/* Logo area — clickable to upload */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          
          {/* Logo image — click to replace */}
          <div
            onClick={() => fileRef.current?.click()}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, cursor: 'pointer', position: 'relative', overflow: 'hidden', border: hovering ? '2px dashed rgba(255,255,255,0.4)' : '2px solid transparent', transition: 'border 0.15s' }}
            title="Click to upload your logo"
          >
            <img src={logoUrl || '/logo.png'} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
            {/* Hover overlay */}
            {hovering && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v8M4 6l4-4 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            )}
          </div>

          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white', letterSpacing: '-0.3px' }}>Brainy Duck</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3px' }}>Market Intelligence</div>
          </div>

          {/* Remove logo button */}
          {logoUrl && (
            <button onClick={() => setLogoUrl(null)} title="Remove logo" style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', fontSize: 16, lineHeight: 1, padding: 2 }}>×</button>
          )}
        </div>

        {/* Upload hint */}
        {hovering && !logoUrl && (
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 6, textAlign: 'center' }}>Click logo to upload</div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: '14px 10px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.8px', textTransform: 'uppercase', padding: '0 8px', marginBottom: 6 }}>Research</div>
        {nav.map(item => {
          const active = path === item.href
          return (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 9, marginBottom: 2, color: active ? 'white' : 'rgba(255,255,255,0.45)', background: active ? 'rgba(255,255,255,0.1)' : 'transparent', textDecoration: 'none', fontSize: 13, fontWeight: active ? 600 : 400, transition: 'all 0.15s' }}>
              <span style={{ color: active ? '#2E6FFF' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {(item as any).badge && <span style={{ fontSize: 9, padding: '1px 5px', background: 'rgba(255,77,106,0.25)', color: '#FF6B8A', borderRadius: 4, fontWeight: 700 }}>{(item as any).badge}</span>}
            </Link>
          )
        })}

        <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.8px', textTransform: 'uppercase', padding: '14px 8px 6px' }}>Markets</div>
        <div style={{ padding: '10px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[['🇺🇸','US'],['🇵🇭','PH'],['🇬🇧','UK'],['🇩🇪','DE'],['🇳🇱','NL'],['🇸🇪','SE'],['🇳🇴','NO']].map(([flag,code]) => (
            <div key={code} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{flag} {code}</span>
              <span style={{ fontSize: 10, color: '#00C48C', fontWeight: 600 }}>Active</span>
            </div>
          ))}
        </div>
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C48C', boxShadow: '0 0 5px #00C48C' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Live · GPT-4o mini</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Cache: 1hr · Auto-refresh</div>
      </div>
    </aside>
  )
}
