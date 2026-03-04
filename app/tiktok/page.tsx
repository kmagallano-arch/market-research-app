'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import MarketSelector from '@/components/MarketSelector'
import { MARKETS, MarketCode } from '@/lib/markets'

const TREND_CONFIG: Record<string,{color:string;bg:string;icon:string}> = {
  exploding: {color:'#FF4D6A',bg:'rgba(255,77,106,0.1)',icon:'🔥'},
  viral:     {color:'#FFB830',bg:'rgba(255,184,48,0.1)',icon:'⚡'},
  trending:  {color:'#0EA5E9',bg:'rgba(14,165,233,0.1)',icon:'📈'},
  fading:    {color:'#94A3B8',bg:'rgba(156,163,175,0.1)',icon:'📉'},
}

export default function TikTokPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [market, setMarket] = useState<MarketCode>('PH')
  const [category, setCategory] = useState('electronics')
  const [filter, setFilter] = useState('all')
  const m = MARKETS[market]

  useEffect(() => {
    setLoading(true); setError(null)
    fetch(`/api/tiktok?market=${market}&category=${category}`)
      .then(r=>{ if (!r.ok) throw new Error(`Failed (${r.status})`); return r.json() })
      .then(j=>{setData(j.data||[]); setLoading(false)})
      .catch(e=>{setError(e.message); setLoading(false)})
  }, [market, category, retryCount])

  const filtered = filter==='all' ? data : data.filter(d=>d.trend===filter)

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#F1F5F9'}}>
      <Sidebar/>
      <main style={{flex:1,padding:'28px 32px',overflow:'auto'}}>
        <div style={{marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
            <h1 style={{fontSize:24,fontWeight:700,color:'#0F172A',letterSpacing:'-0.4px'}}>🎵 TikTok Viral Tracker</h1>
            <span style={{fontSize:11,padding:'3px 10px',background:'rgba(254,44,85,0.1)',color:'#FE2C55',borderRadius:20,fontWeight:700}}>LIVE</span>
          </div>
          <p style={{fontSize:14,color:'#64748B',marginTop:3}}>Products going viral on TikTok Shop — spot trends before they hit Amazon</p>
        </div>

        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:600,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:9}}>Market</div>
          <MarketSelector value={market} onChange={setMarket}/>
        </div>

        <div style={{display:'flex',gap:10,marginBottom:20,alignItems:'center',flexWrap:'wrap'}}>
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            {['electronics','home-kitchen','beauty','cleaning-products','gadgets','fashion-accessories'].map(c=>(
              <option key={c} value={c}>{c.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>
            ))}
          </select>
          <div style={{display:'flex',background:'#E2E8F0',borderRadius:10,padding:3}}>
            {['all','exploding','viral','trending','fading'].map(val=>(
              <button key={val} onClick={()=>setFilter(val)} style={{padding:'5px 13px',borderRadius:8,border:'none',cursor:'pointer',fontSize:12,fontWeight:filter===val?700:400,background:filter===val?'white':'transparent',color:filter===val?'#0F172A':'#94A3B8',boxShadow:filter===val?'0 1px 4px rgba(0,0,0,0.1)':'none',textTransform:'capitalize'}}>
                {val==='all'?`All (${data.length})`:val}
              </button>
            ))}
          </div>
          {loading && <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#94A3B8'}}><div style={{width:13,height:13,borderRadius:'50%',border:'2px solid #E2E8F0',borderTopColor:'#FE2C55',animation:'spin 0.8s linear infinite'}}/>Scanning TikTok...</div>}
        </div>

        {/* Summary cards */}
        {!loading && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
            {[
              {label:'🔥 Exploding', value:data.filter(d=>d.trend==='exploding').length, color:'#FF4D6A'},
              {label:'⚡ Viral',     value:data.filter(d=>d.trend==='viral').length,     color:'#FFB830'},
              {label:'🌱 Early Signal', value:data.filter(d=>d.earlySignal).length,      color:'#00C48C'},
              {label:'Total Tracked', value:data.length,                                 color:'#FE2C55'},
            ].map((c,i)=>(
              <div key={i} className="card" style={{padding:'16px 18px'}}>
                <div style={{fontSize:11,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:6}}>{c.label}</div>
                <div style={{fontSize:28,fontWeight:800,color:c.color,fontFamily:'DM Mono'}}>{c.value}</div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div style={{ padding:'12px 18px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, color:'#DC2626' }}>{error}</span>
            <button onClick={()=>setRetryCount(c=>c+1)} style={{ padding:'5px 14px', borderRadius:8, background:'#DC2626', color:'white', fontSize:12, fontWeight:600, border:'none', cursor:'pointer' }}>Retry</button>
          </div>
        )}

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:14}}>
          {loading ? [...Array(8)].map((_,i)=><div key={i} className="card skeleton" style={{height:260}}/>) :
          filtered.map((p:any,i:number)=>{
            const tc = TREND_CONFIG[p.trend]||TREND_CONFIG.trending
            return (
              <div key={i} className="card" style={{padding:'18px 20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    <span style={{fontSize:11,padding:'3px 10px',borderRadius:20,fontWeight:700,background:tc.bg,color:tc.color}}>{tc.icon} {p.trend}</span>
                    {p.earlySignal && <span style={{fontSize:11,padding:'3px 10px',borderRadius:20,fontWeight:700,background:'rgba(0,196,140,0.1)',color:'#00C48C'}}>🌱 Early</span>}
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:22,fontWeight:800,color:tc.color,fontFamily:'DM Mono',lineHeight:1}}>{p.trendScore}</div>
                    <div style={{fontSize:9,color:'#94A3B8',textTransform:'uppercase'}}>Score</div>
                  </div>
                </div>
                <div style={{fontSize:15,fontWeight:700,color:'#0F172A',marginBottom:2}}>{p.productName}</div>
                <div style={{fontSize:13,color:'#FE2C55',fontWeight:600,marginBottom:8}}>{p.hashtag}</div>
                <div style={{fontSize:12,color:'#64748B',lineHeight:1.5,marginBottom:12,padding:'8px 12px',background:'#F1F5F9',borderRadius:8,borderLeft:'3px solid #FE2C55'}}>{p.whyViral}</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:10}}>
                  {[{v:p.videoViews,l:'Views',c:'#FE2C55'},{v:p.weeklyGrowth,l:'Growth',c:'#00C48C'},{v:p.price,l:'Price',c:m.color}].map((s,j)=>(
                    <div key={j} style={{padding:'8px',background:'#F1F5F9',borderRadius:8,textAlign:'center'}}>
                      <div style={{fontSize:12,fontWeight:700,color:s.c,fontFamily:'DM Mono'}}>{s.v}</div>
                      <div style={{fontSize:9,color:'#94A3B8',marginTop:2,textTransform:'uppercase'}}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',justifyContent:'space-between',paddingTop:10,borderTop:'1px solid #E2E8F0',fontSize:12}}>
                  <span style={{color:'#64748B'}}>{p.creatorCount} creators · {p.ageGroup}</span>
                  <span style={{color:'#00C48C',fontWeight:600}}>{p.salesEstimate}</span>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
