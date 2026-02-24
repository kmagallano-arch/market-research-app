'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import MarketSelector from '@/components/MarketSelector'
import { MARKETS, MarketCode } from '@/lib/markets'

const categories = ['electronics','home-kitchen','automotive','tools-home-improvement','toys-games','health-personal-care']

export default function BestsellersPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('electronics')
  const [market, setMarket] = useState<MarketCode>('US')
  const m = MARKETS[market]

  useEffect(() => {
    setLoading(true)
    fetch(`/api/bestsellers?category=${category}&market=${market}`).then(r=>r.json()).then(j=>{setData(j.data||[]); setLoading(false)})
  }, [category, market])

  const tc = (t:string) => t==='up'?'#00C48C':t==='down'?'#FF4D6A':'#9CA3AF'
  const ti = (t:string) => t==='up'?'↑':t==='down'?'↓':'→'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F2F3F7' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1D2E', letterSpacing: '-0.4px' }}>Bestsellers</h1>
          <p style={{ fontSize: 13, color: '#6B7280', marginTop: 3 }}>Top-ranked products across Amazon, Shopee, Lazada, Bol.com</p>
        </div>

        {/* Market selector */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Market</div>
          <MarketSelector value={market} onChange={setMarket} />
        </div>

        {/* Active market bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: `${m.color}0D`, border: `1.5px solid ${m.color}25`, borderRadius: 12, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>{m.flag}</span>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1D2E' }}>{m.label}</span>
              <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 8 }}>via {m.platform}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select value={category} onChange={e=>setCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
            </select>
            {loading && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9CA3AF' }}><div style={{ width: 12, height: 12, borderRadius: '50%', border: `2px solid #E8E9EF`, borderTopColor: m.color, animation: 'spin 0.8s linear infinite' }} />Loading...</div>}
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <table>
            <thead>
              <tr><th>#</th><th>Product</th><th>Price</th><th>Rating</th><th>Reviews</th><th>Trend</th><th>Est. Revenue/mo</th><th>Keywords</th></tr>
            </thead>
            <tbody>
              {loading ? [...Array(12)].map((_,i) => (
                <tr key={i}>{[...Array(8)].map((_,j) => <td key={j}><div className="skeleton" style={{ height: 14 }} /></td>)}</tr>
              )) : data.map((p:any,i:number) => (
                <tr key={i}>
                  <td><span style={{ fontFamily: 'DM Mono', fontSize: 11, color: '#9CA3AF', background: '#F3F4F6', padding: '2px 7px', borderRadius: 5 }}>#{p.rank}</span></td>
                  <td style={{ maxWidth: 260 }}>
                    <div style={{ fontWeight: 500, color: '#1A1D2E', marginBottom: 2 }}>{p.title}</div>
                  </td>
                  <td style={{ color: '#00C48C', fontWeight: 700, fontFamily: 'DM Mono', whiteSpace: 'nowrap' }}>{p.price}</td>
                  <td style={{ color: '#FFB830', fontFamily: 'DM Mono', fontSize: 12 }}>{p.rating}★</td>
                  <td style={{ color: '#9CA3AF', fontFamily: 'DM Mono', fontSize: 12 }}>{(p.reviews||0).toLocaleString()}</td>
                  <td><span style={{ color: tc(p.trend), fontWeight: 700 }}>{ti(p.trend)} {p.trend}</span></td>
                  <td style={{ color: m.color, fontFamily: 'DM Mono', fontSize: 12, whiteSpace: 'nowrap' }}>{p.estimatedMonthlyRevenue}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(p.keywordTags||[]).slice(0,2).map((t:string,j:number) => (
                        <span key={j} style={{ fontSize: 10, padding: '2px 8px', background: `${m.color}12`, color: m.color, borderRadius: 20 }}>{t}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
