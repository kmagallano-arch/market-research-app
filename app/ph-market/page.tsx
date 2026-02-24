'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function PHMarketPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ph-market').then(r=>r.json()).then(j=>{setData(j.data); setLoading(false)})
  }, [])

  const tc = (t:string) => t==='up'?'#00C48C':t==='down'?'#FF4D6A':'#9CA3AF'
  const ti = (t:string) => t==='up'?'↑':t==='down'?'↓':'→'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F2F3F7' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1D2E', letterSpacing: '-0.4px' }}>🇵🇭 Philippines Market</h1>
          <p style={{ fontSize: 13, color: '#6B7280', marginTop: 3 }}>Lazada & Shopee — trending products, categories, and market intelligence</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '32px 20px', color: '#9CA3AF' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #E8E9EF', borderTopColor: '#FF4D6A', animation: 'spin 0.8s linear infinite' }} />
            Scanning Philippines market...
          </div>
        ) : data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Category cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 10 }}>
              {(data.topCategories||[]).map((c:any,i:number) => (
                <div key={i} className="card" style={{ padding: '16px 18px' }}>
                  <div style={{ fontSize: 13, color: '#1A1D2E', fontWeight: 600, marginBottom: 8 }}>{c.name}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#00C48C', fontFamily: 'DM Mono' }}>{c.growth}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>avg {c.avgPrice}</div>
                </div>
              ))}
            </div>

            {/* Trending products */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F1F5' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1D2E' }}>Trending Products</div>
              </div>
              <table>
                <thead>
                  <tr><th>Product</th><th>Platform</th><th>Price</th><th>Sold/mo</th><th>Rating</th><th>Trend</th><th>Keywords</th></tr>
                </thead>
                <tbody>
                  {(data.trendingProducts||[]).map((p:any,i:number)=>(
                    <tr key={i}>
                      <td style={{ fontWeight: 500, color: '#1A1D2E', maxWidth: 240 }}>{p.title}</td>
                      <td><span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, fontWeight: 600, background: p.platform==='Lazada'?'rgba(255,77,106,0.1)':'rgba(255,184,48,0.1)', color: p.platform==='Lazada'?'#FF4D6A':'#FFB830' }}>{p.platform}</span></td>
                      <td style={{ color: '#FF4D6A', fontWeight: 700, fontFamily: 'DM Mono' }}>{p.price}</td>
                      <td style={{ color: '#6B7280', fontFamily: 'DM Mono', fontSize: 12 }}>{p.soldLastMonth}</td>
                      <td style={{ color: '#FFB830', fontFamily: 'DM Mono', fontSize: 12 }}>{p.rating}★</td>
                      <td><span style={{ color: tc(p.trend), fontWeight: 700, fontSize: 14 }}>{ti(p.trend)}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {(p.keywords||[]).slice(0,2).map((kw:string,j:number)=>(
                            <span key={j} style={{ fontSize: 10, padding: '2px 8px', background: '#F3F4F6', color: '#6B7280', borderRadius: 20 }}>{kw}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Insights + Seasonal */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="card" style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1D2E', marginBottom: 14 }}>Market Insights</div>
                {(data.marketInsights||[]).map((ins:string,i:number)=>(
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #F0F1F5', alignItems: 'flex-start' }}>
                    <span style={{ color: '#FF4D6A', flexShrink: 0, fontWeight: 700 }}>›</span>
                    <span style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{ins}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1D2E', marginBottom: 14 }}>Seasonal Opportunities</div>
                {(data.seasonalTips||[]).map((tip:string,i:number)=>(
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #F0F1F5', alignItems: 'flex-start' }}>
                    <span style={{ color: '#FFB830', flexShrink: 0, fontWeight: 700 }}>◆</span>
                    <span style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
