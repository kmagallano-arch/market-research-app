'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import MarketSelector from '@/components/MarketSelector'
import { MARKETS, MarketCode } from '@/lib/markets'

export default function RisingPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [market, setMarket] = useState<MarketCode>('US')
  const [filter, setFilter] = useState<'all'|'exploding'|'rising'|'emerging'>('all')
  const m = MARKETS[market]

  useEffect(() => {
    setLoading(true)
    fetch(`/api/rising?market=${market}`).then(r=>r.json()).then(j=>{setData(j.data||[]); setLoading(false)})
  }, [market])

  const filtered = filter==='all' ? data : data.filter(p=>p.trend===filter)
  const trendConfig: Record<string,{color:string;bg:string;icon:string;label:string}> = {
    exploding: { color:'#FF4D6A', bg:'rgba(255,77,106,0.1)',  icon:'🔥', label:'Exploding' },
    rising:    { color:'#FFB830', bg:'rgba(255,184,48,0.1)',  icon:'📈', label:'Rising'    },
    emerging:  { color:'#00C48C', bg:'rgba(0,196,140,0.1)',   icon:'🌱', label:'Emerging'  },
  }
  const diffColor = (d:string) => ({Easy:'#00C48C',Medium:'#FFB830',Hard:'#FF4D6A'}[d]||'#9CA3AF')
  const compColor = (c:string) => ({None:'#00C48C',Low:'#2E6FFF',Medium:'#FFB830'}[c]||'#9CA3AF')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F2F3F7' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1D2E', letterSpacing: '-0.4px' }}>🚀 Rising Products</h1>
            <span style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(255,77,106,0.1)', color: '#FF4D6A', borderRadius: 20, fontWeight: 700 }}>NEW</span>
          </div>
          <p style={{ fontSize: 13, color: '#6B7280' }}>New-to-market products with strong search growth and conversion signals</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Market</div>
          <MarketSelector value={market} onChange={m=>{setMarket(m);setFilter('all')}} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ padding: '7px 14px', background: `${m.color}0D`, border: `1.5px solid ${m.color}25`, borderRadius: 10, fontSize: 12, color: m.color, fontWeight: 600 }}>
            {m.flag} {m.label} · {m.platform}
          </div>
          <div style={{ display: 'flex', background: '#EBEBEF', borderRadius: 10, padding: 3 }}>
            {([['all','All'],['exploding','🔥'],['rising','📈'],['emerging','🌱']] as const).map(([val,label])=>(
              <button key={val} onClick={()=>setFilter(val)} style={{ padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: filter===val?700:400, background: filter===val?'white':'transparent', color: filter===val?'#1A1D2E':'#9CA3AF', boxShadow: filter===val?'0 1px 4px rgba(0,0,0,0.1)':'none' }}>{label} {val==='all'&&`(${data.length})`}</button>
            ))}
          </div>
          {loading && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9CA3AF' }}><div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #E8E9EF', borderTopColor: m.color, animation: 'spin 0.8s linear infinite' }} />Scanning {m.label}...</div>}
        </div>

        {/* Summary row */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Total Found',  value: data.length,                                color: m.color },
              { label: '🔥 Exploding', value: data.filter(p=>p.trend==='exploding').length, color: '#FF4D6A' },
              { label: '📈 Rising',    value: data.filter(p=>p.trend==='rising').length,    color: '#FFB830' },
              { label: '🌱 Emerging',  value: data.filter(p=>p.trend==='emerging').length,  color: '#00C48C' },
            ].map((c,i)=>(
              <div key={i} className="card" style={{ padding: '16px 18px' }}>
                <div style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{c.label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: c.color, fontFamily: 'DM Mono' }}>{c.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: 14 }}>
          {loading ? [...Array(6)].map((_,i)=>(
            <div key={i} className="card skeleton" style={{ height: 280 }} />
          )) : filtered.map((p:any,i:number)=>{
            const tc = trendConfig[p.trend]||trendConfig.emerging
            return (
              <div key={i} className="card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700, background: tc.bg, color: tc.color }}>{tc.icon} {tc.label}</span>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: `${m.color}12`, color: m.color }}>{m.flag} {market}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: p.momentum>=80?'#FF4D6A':p.momentum>=60?'#FFB830':'#00C48C', fontFamily: 'DM Mono', lineHeight: 1 }}>{p.momentum}</div>
                    <div style={{ fontSize: 9, color: '#9CA3AF', textTransform: 'uppercase' }}>Momentum</div>
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E', marginBottom: 3 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 10 }}>{p.category} · {p.launchAge} old</div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, marginBottom: 12, padding: '8px 12px', background: '#F8F9FB', borderRadius: 8, borderLeft: `3px solid ${tc.color}` }}>{p.whyNow}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 12 }}>
                  {[
                    { v: p.searchGrowth, l: 'Search', c: '#00C48C' },
                    { v: p.conversionRate, l: 'Conv.', c: '#2E6FFF' },
                    { v: p.avgPrice, l: 'Price', c: '#FFB830' },
                  ].map((s,j)=>(
                    <div key={j} style={{ padding: '8px', background: '#F8F9FB', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: s.c, fontFamily: 'DM Mono' }}>{s.v}</div>
                      <div style={{ fontSize: 9, color: '#9CA3AF', marginTop: 2, textTransform: 'uppercase' }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 10 }}>
                  {(p.earlySignals||[]).slice(0,3).map((s:string,j:number)=>(
                    <div key={j} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                      <span style={{ color: tc.color, fontSize: 10, flexShrink: 0, marginTop: 1 }}>▸</span>
                      <span style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #F0F1F5' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 11, color: diffColor(p.sourcingDifficulty) }}>Sourcing: <b>{p.sourcingDifficulty}</b></span>
                    <span style={{ color: '#E8E9EF' }}>·</span>
                    <span style={{ fontSize: 11, color: compColor(p.competitionLevel) }}>Comp: <b>{p.competitionLevel}</b></span>
                  </div>
                  <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'DM Mono' }}>{p.monthlySales}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                  {(p.topKeywords||[]).map((kw:string,j:number)=>(
                    <span key={j} style={{ fontSize: 10, padding: '2px 8px', background: `${m.color}10`, color: m.color, borderRadius: 20 }}>{kw}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
