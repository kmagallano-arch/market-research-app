'use client'
import { useEffect, useState, useRef } from 'react'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { MARKETS, MarketCode } from '@/lib/markets'

/* ── tiny donut chart ── */
function Donut({ segments, size = 90 }: { segments: { val: number; color: string; label: string }[]; size?: number }) {
  const r = 32; const cx = 50; const cy = 50; const stroke = 10
  let offset = -90
  const total = segments.reduce((s, x) => s + x.val, 0)
  const arcs = segments.map(seg => {
    const pct = (seg.val / total) * 360
    const start = offset; offset += pct
    const s = toXY(cx, cy, r, start)
    const e = toXY(cx, cy, r, start + pct)
    const large = pct > 180 ? 1 : 0
    return { ...seg, d: `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`, pct: Math.round(seg.val / total * 100) }
  })
  function toXY(cx: number, cy: number, r: number, deg: number) {
    const rad = (deg * Math.PI) / 180
    return { x: +(cx + r * Math.cos(rad)).toFixed(3), y: +(cy + r * Math.sin(rad)).toFixed(3) }
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
      {arcs.map((arc, i) => (
        <path key={i} d={arc.d} fill="none" stroke={arc.color} strokeWidth={stroke} strokeLinecap="round" />
      ))}
    </svg>
  )
}

/* ── mini sparkline ── */
function Sparkline({ data, color, width = 120, height = 36 }: { data: number[]; color: string; width?: number; height?: number }) {
  const min = Math.min(...data); const max = Math.max(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / (max - min || 1)) * height * 0.85 - height * 0.08
    return `${x},${y}`
  }).join(' ')
  const area = `0,${height} ` + pts + ` ${width},${height}`
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── mini bar chart ── */
function BarChart({ data, color }: { data: { label: string; val: number }[]; color?: string }) {
  const max = Math.max(...data.map(d => d.val))
  const COLORS = ['#CBD5E1','#CBD5E1','#CBD5E1','#CBD5E1','#FF6B8A','#CBD5E1','#CBD5E1']
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 70 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 4 }}>
          <div style={{ width: '100%', borderRadius: 4, background: color || COLORS[i % COLORS.length], height: `${(d.val / max) * 60}px`, transition: 'height 0.5s ease' }} />
          <span style={{ fontSize: 9, color: '#94A3B8' }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

const SPARK_US   = [42,55,48,62,70,65,78,85,80,92,88,95]
const SPARK_PH   = [30,38,35,50,58,52,65,70,68,75,80,85]
const SPARK_EU   = [20,28,32,40,38,45,52,58,55,62,68,72]
const BAR_DATA   = [{label:'M',val:40},{label:'T',val:65},{label:'W',val:50},{label:'T',val:80},{label:'F',val:95},{label:'S',val:60},{label:'S',val:45}]

export default function Dashboard() {
  const [bs, setBs]     = useState<any[]>([])
  const [ph, setPh]     = useState<any>(null)
  const [recs, setRecs] = useState<any[]>([])
  const [loading, setLoading] = useState({ bs: true, ph: true, rc: true })
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [activeMarket, setActiveMarket] = useState<MarketCode>('US')

  useEffect(() => {
    setError(null)
    fetch('/api/bestsellers?category=electronics&market=US')
      .then(r=>{ if (!r.ok) throw new Error(`Bestsellers failed (${r.status})`); return r.json() })
      .then(j=>{setBs(j.data?.slice(0,6)||[]); setLoading(l=>({...l,bs:false}))})
      .catch(e=>{setError(e.message); setLoading(l=>({...l,bs:false}))})
    fetch('/api/ph-market')
      .then(r=>{ if (!r.ok) throw new Error(`PH Market failed (${r.status})`); return r.json() })
      .then(j=>{setPh(j.data); setLoading(l=>({...l,ph:false}))})
      .catch(e=>{setError(e.message); setLoading(l=>({...l,ph:false}))})
    fetch('/api/recommendations')
      .then(r=>{ if (!r.ok) throw new Error(`Recommendations failed (${r.status})`); return r.json() })
      .then(j=>{setRecs(j.data?.slice(0,5)||[]); setLoading(l=>({...l,rc:false}))})
      .catch(e=>{setError(e.message); setLoading(l=>({...l,rc:false}))})
  }, [retryCount])

  const tc = (t:string) => t==='up'?'#00C48C':t==='down'?'#FF4D6A':'#94A3B8'
  const ti = (t:string) => t==='up'?'↑':t==='down'?'↓':'→'
  const marketList: MarketCode[] = ['US','PH','UK','DE','NL','SE','NO']

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F172A' }}>
      <Sidebar />

      {/* LIGHT MAIN AREA */}
      <main className="dash-main" style={{ flex: 1, background: '#F1F5F9', color: '#0F172A', overflow: 'auto', minHeight: '100vh' }}>

        {/* ── TOP BAR ── */}
        <div style={{ padding: '20px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.5px' }}>Market Overview</h1>
            <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>Electronics · 7 markets · AI-powered insights</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Market pills */}
            <div style={{ display: 'flex', gap: 4 }}>
              {marketList.map(code => {
                const m = MARKETS[code]
                const active = activeMarket === code
                return (
                  <button key={code} onClick={()=>setActiveMarket(code)} style={{ padding: '5px 10px', borderRadius: 20, border: `1px solid ${active?m.color:'#E2E8F0'}`, background: active?`${m.color}15`:'white', color: active?m.color:'#64748B', fontSize: 11, fontWeight: active?700:400, cursor: 'pointer', transition: 'all 0.15s' }}>
                    {m.flag} {code}
                  </button>
                )
              })}
            </div>
            <Link href="/rising" style={{ padding: '7px 16px', borderRadius: 20, background: '#0EA5E9', color: 'white', fontSize: 12, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 12px rgba(14,165,233,0.35)' }}>+ Rising Products</Link>
          </div>
        </div>

        {error && (
          <div style={{ margin:'0 28px 14px', padding:'12px 18px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, color:'#DC2626' }}>{error}</span>
            <button onClick={()=>setRetryCount(c=>c+1)} style={{ padding:'5px 14px', borderRadius:8, background:'#DC2626', color:'white', fontSize:12, fontWeight:600, border:'none', cursor:'pointer' }}>Retry</button>
          </div>
        )}

        <div style={{ padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* ── ROW 1: 3 hero cards + right column ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 300px', gap: 14 }}>

            {/* Hero card 1 — US Market (teal/cyan) */}
            <div style={{ borderRadius: 18, background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 50%, #7DD3FC 100%)', padding: '22px 22px 18px', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
              <div style={{ position: 'absolute', bottom: -10, left: 30, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase' }}>🇺🇸 US Market</div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1, marginBottom: 4 }}>Amazon</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>Electronics · Top 12 ranked</div>
              <Sparkline data={SPARK_US} color="rgba(255,255,255,0.9)" />
              <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                <div><div style={{ fontSize: 11, opacity: 0.7 }}>Avg Price</div><div style={{ fontSize: 14, fontWeight: 700 }}>$67</div></div>
                <div><div style={{ fontSize: 11, opacity: 0.7 }}>Avg Rating</div><div style={{ fontSize: 14, fontWeight: 700 }}>4.4★</div></div>
                <div><div style={{ fontSize: 11, opacity: 0.7 }}>Est. Revenue</div><div style={{ fontSize: 14, fontWeight: 700 }}>$24k/mo</div></div>
              </div>
            </div>

            {/* Hero card 2 — PH Market (teal accent) */}
            <div style={{ borderRadius: 18, background: 'linear-gradient(135deg, #14B8A6 0%, #5EEAD4 60%, #99F6E4 100%)', padding: '22px 22px 18px', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -15, right: -15, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase' }}>🇵🇭 PH Market</div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1, marginBottom: 4 }}>Shopee</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>Lazada · TikTok Shop</div>
              <Sparkline data={SPARK_PH} color="rgba(255,255,255,0.9)" />
              <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                <div><div style={{ fontSize: 11, opacity: 0.7 }}>Avg Price</div><div style={{ fontSize: 14, fontWeight: 700 }}>₱2,400</div></div>
                <div><div style={{ fontSize: 11, opacity: 0.7 }}>Categories</div><div style={{ fontSize: 14, fontWeight: 700 }}>8 hot</div></div>
                <div><div style={{ fontSize: 11, opacity: 0.7 }}>Growth</div><div style={{ fontSize: 14, fontWeight: 700 }}>+22%</div></div>
              </div>
            </div>

            {/* Hero card 3 — EU Markets (purple accent) */}
            <div style={{ borderRadius: 18, background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 60%, #C4B5FD 100%)', padding: '22px 22px 18px', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase' }}>🌍 EU Markets</div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1, marginBottom: 4 }}>DE·NL·SE·NO</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>Amazon EU · Bol.com · CDON</div>
              <Sparkline data={SPARK_EU} color="rgba(255,255,255,0.9)" />
              <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                <div><div style={{ fontSize: 11, opacity: 0.7 }}>UK Avg</div><div style={{ fontSize: 14, fontWeight: 700 }}>£58</div></div>
                <div><div style={{ fontSize: 11, opacity: 0.7 }}>DE Avg</div><div style={{ fontSize: 14, fontWeight: 700 }}>€62</div></div>
                <div><div style={{ fontSize: 11, opacity: 0.7 }}>Opportunity</div><div style={{ fontSize: 14, fontWeight: 700 }}>High</div></div>
              </div>
            </div>

            {/* Right column — donut + stat */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Donut card */}
              <div className="ld-card" style={{ padding: '18px 20px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Market Split</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>7 Markets</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Active</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Donut segments={[{val:35,color:'#0EA5E9',label:'US'},{val:20,color:'#14B8A6',label:'PH'},{val:45,color:'#8B5CF6',label:'EU'}]} size={80} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[{c:'#0EA5E9',l:'US',v:'35%'},{c:'#14B8A6',l:'PH',v:'20%'},{c:'#8B5CF6',l:'EU',v:'45%'}].map((s,i)=>(
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.c, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: '#64748B' }}>{s.l}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', marginLeft: 'auto' }}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Picks mini stat */}
              <div className="ld-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>AI Picks</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#0F172A' }}>{recs.length || 15}</div>
                  <div style={{ fontSize: 11, color: '#00C48C', fontWeight: 600 }}>↑ Opportunities</div>
                </div>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg, #FFB830, #FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>✦</div>
              </div>
            </div>
          </div>

          {/* ── ROW 2: Post Activity-style table + bar chart + mini stats ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 14 }}>

            {/* Activity table — bestsellers as "post activity" */}
            <div className="ld-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 0 }}>
                  {['Bestsellers','Keywords','AI Picks'].map((tab,i) => (
                    <div key={tab} style={{ padding: '4px 14px', fontSize: 13, fontWeight: i===0?600:400, color: i===0?'#0F172A':'#94A3B8', borderBottom: i===0?'2px solid #0EA5E9':'2px solid transparent', cursor: 'pointer' }}>{tab}</div>
                  ))}
                </div>
                <Link href="/bestsellers" style={{ fontSize: 12, color: '#0EA5E9', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
              </div>
              {loading.bs ? (
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[...Array(5)].map((_,i) => <div key={i} className="ld-skeleton" style={{ height: 36 }} />)}
                </div>
              ) : (
                <div>
                  {/* Table header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 80px 80px 60px', padding: '8px 20px', borderBottom: '1px solid #E2E8F0' }}>
                    {['Product','Category','Price','Rating','Trend'].map(h => (
                      <div key={h} style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
                    ))}
                  </div>
                  {bs.map((p:any,i:number) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 100px 80px 80px 60px', padding: '12px 20px', borderBottom: i<bs.length-1?'1px solid #F1F5F9':'none', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', marginBottom: 1 }}>{p.title?.slice(0,42)}{p.title?.length>42?'...':''}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>#{p.rank} · {p.keywordTags?.[0]}</div>
                      </div>
                      <div><span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#F1F5F9', color: '#64748B', fontWeight: 500 }}>Electronics</span></div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{p.price}</div>
                      <div style={{ fontSize: 13, color: '#FFB830', fontWeight: 600 }}>{p.rating}★</div>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: tc(p.trend) }}>{ti(p.trend)} {p.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right column: bar chart + quick stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Bar chart card */}
              <div className="ld-card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Keyword Trends</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>This week</div>
                  </div>
                </div>
                <BarChart data={BAR_DATA} />
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF6B8A' }} /><span style={{ fontSize: 11, color: '#64748B' }}>High intent</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#CBD5E1' }} /><span style={{ fontSize: 11, color: '#64748B' }}>Others</span></div>
                </div>
              </div>

              {/* Mini stat cards */}
              <div className="ld-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #FF6B8A, #FF4D6A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16 }}>🚀</div>
                <div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>Rising Products</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>12</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <div style={{ width: 50, height: 4, background: '#F1F5F9', borderRadius: 2 }}><div style={{ width: '75%', height: '100%', background: '#FF6B8A', borderRadius: 2 }} /></div>
                </div>
              </div>

              <div className="ld-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16 }}>🔍</div>
                <div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>Keywords Tracked</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>140+</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#00C48C' }}>↑ 18%</div>
              </div>
            </div>
          </div>

          {/* ── ROW 3: AI picks cards + market pulse ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            {/* AI Picks */}
            <div className="ld-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>✦ AI Product Picks</div>
                <Link href="/recommendations" style={{ fontSize: 12, color: '#0EA5E9', textDecoration: 'none' }}>View all →</Link>
              </div>
              {loading.rc ? (
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[...Array(4)].map((_,i) => <div key={i} className="ld-skeleton" style={{ height: 48 }} />)}
                </div>
              ) : (
                <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {recs.map((r:any,i:number) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 10px', background: i%2===0?'#F8FAFC':'white', borderRadius: 10, alignItems: 'center' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: r.score>=80?'linear-gradient(135deg,#00C48C,#38EF7D)':'linear-gradient(135deg,#FFB830,#FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white', flexShrink: 0 }}>{r.score}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 1 }}>{r.productIdea}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>{r.category} · {r.estimatedDemand} demand</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#00C48C' }}>{r.estimatedProfit}</div>
                        <span style={{ fontSize: 10, padding: '2px 7px', background: r.targetMarket==='US'?'#F0F9FF':r.targetMarket==='PH'?'#FFF0F3':'#F0FDF9', color: r.targetMarket==='US'?'#0EA5E9':r.targetMarket==='PH'?'#FF4D6A':'#00C48C', borderRadius: 20, fontWeight: 600 }}>{r.targetMarket}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Market Pulse */}
            <div className="ld-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>📡 Keyword Pulse</div>
                <Link href="/trends" style={{ fontSize: 12, color: '#0EA5E9', textDecoration: 'none' }}>Trends →</Link>
              </div>
              <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { kw: 'robot vacuum cleaner', us: 92, ph: 85, change: '+24%' },
                  { kw: 'wireless earbuds', us: 95, ph: 88, change: '+8%' },
                  { kw: 'dashcam 4K', us: 88, ph: 72, change: '+12%' },
                  { kw: 'wifi mesh extender', us: 76, ph: 90, change: '+18%' },
                  { kw: 'smart plug wifi', us: 79, ph: 68, change: '+15%' },
                ].map((k,i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 130, fontSize: 12, color: '#334155', fontWeight: 500 }}>{k.kw}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, marginBottom: 3 }}>
                        <div style={{ width: `${k.us}%`, height: '100%', background: 'linear-gradient(90deg, #0EA5E9, #38BDF8)', borderRadius: 3 }} />
                      </div>
                      <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3 }}>
                        <div style={{ width: `${k.ph}%`, height: '100%', background: 'linear-gradient(90deg, #FF6B8A, #FF4D6A)', borderRadius: 3 }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#00C48C', width: 40, textAlign: 'right' }}>{k.change}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 4, borderRadius: 2, background: '#0EA5E9' }} /><span style={{ fontSize: 10, color: '#94A3B8' }}>🇺🇸 US</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 4, borderRadius: 2, background: '#FF6B8A' }} /><span style={{ fontSize: 10, color: '#94A3B8' }}>🇵🇭 PH</span></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
