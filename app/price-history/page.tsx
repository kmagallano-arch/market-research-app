'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import MarketSelector from '@/components/MarketSelector'
import { MARKETS, MarketCode } from '@/lib/markets'

const SIGNAL_CONFIG: Record<string,{color:string;bg:string;label:string}> = {
  'strong-buy': {color:'#00C48C',bg:'rgba(0,196,140,0.1)',label:'🟢 Strong Buy'},
  'buy':        {color:'#0EA5E9',bg:'rgba(14,165,233,0.1)',label:'🔵 Buy'},
  'wait':       {color:'#FFB830',bg:'rgba(255,184,48,0.1)',label:'🟡 Wait'},
  'overpriced': {color:'#FF4D6A',bg:'rgba(255,77,106,0.1)',label:'🔴 Overpriced'},
}

function MiniChart({data,color,current}:{data:number[];color:string;current:number}) {
  const min=Math.min(...data), max=Math.max(...data)
  const w=140, h=40
  const pts=data.map((v,i)=>{
    const x=(i/(data.length-1))*w
    const y=h-((v-min)/(max-min||1))*h*0.8-h*0.1
    return `${x},${y}`
  }).join(' ')
  const area=`0,${h} `+pts+` ${w},${h}`
  return (
    <svg width={w} height={h} style={{overflow:'visible'}}>
      <defs><linearGradient id={`cg${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.2"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <polygon points={area} fill={`url(#cg${color.replace('#','')})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function PriceHistoryPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [market, setMarket] = useState<MarketCode>('US')
  const [category, setCategory] = useState('electronics')
  const [filter, setFilter] = useState('all')
  const m = MARKETS[market]

  useEffect(() => {
    setLoading(true); setError(null)
    fetch(`/api/price-history?market=${market}&category=${category}`)
      .then(r=>{ if (!r.ok) throw new Error(`Failed (${r.status})`); return r.json() })
      .then(j=>{setData(j.data||[]); setLoading(false)})
      .catch(e=>{setError(e.message); setLoading(false)})
  }, [market, category, retryCount])

  const filtered = filter==='all' ? data : data.filter(d=>d.buySignal===filter||d.trend===filter)
  const trendColor = (t:string) => t==='dropping'?'#00C48C':t==='rising'?'#FF4D6A':t==='volatile'?'#FFB830':'#64748B'

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#F1F5F9'}}>
      <Sidebar/>
      <main style={{flex:1,padding:'28px 32px',overflow:'auto'}}>
        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:24,fontWeight:700,color:'#0F172A',letterSpacing:'-0.4px'}}>📊 Price History Tracker</h1>
          <p style={{fontSize:14,color:'#64748B',marginTop:3}}>Keepa-style price tracking — find the best time to source or sell</p>
        </div>

        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:600,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:9}}>Market</div>
          <MarketSelector value={market} onChange={setMarket}/>
        </div>

        <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            {['electronics','home-kitchen','automotive','cleaning-products','smart-home','gadgets'].map(c=>(
              <option key={c} value={c}>{c.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>
            ))}
          </select>
          <div style={{display:'flex',background:'#E2E8F0',borderRadius:10,padding:3}}>
            {[['all','All'],['strong-buy','🟢 Buy Now'],['wait','🟡 Wait'],['dropping','📉 Dropping']].map(([val,label])=>(
              <button key={val} onClick={()=>setFilter(val)} style={{padding:'5px 12px',borderRadius:8,border:'none',cursor:'pointer',fontSize:12,fontWeight:filter===val?700:400,background:filter===val?'white':'transparent',color:filter===val?'#0F172A':'#94A3B8',boxShadow:filter===val?'0 1px 4px rgba(0,0,0,0.1)':'none'}}>
                {val==='all'?`All (${data.length})`:label}
              </button>
            ))}
          </div>
          {loading && <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#94A3B8'}}><div style={{width:13,height:13,borderRadius:'50%',border:'2px solid #E2E8F0',borderTopColor:m.color,animation:'spin 0.8s linear infinite'}}/>Loading price data...</div>}
        </div>

        {error && (
          <div style={{ padding:'12px 18px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, color:'#DC2626' }}>{error}</span>
            <button onClick={()=>setRetryCount(c=>c+1)} style={{ padding:'5px 14px', borderRadius:8, background:'#DC2626', color:'white', fontSize:12, fontWeight:600, border:'none', cursor:'pointer' }}>Retry</button>
          </div>
        )}

        <div className="card" style={{overflow:'hidden'}}>
          <table>
            <thead><tr><th>Product</th><th>Current</th><th>24-Month Chart</th><th>30d Change</th><th>All-Time Low</th><th>Avg 90d</th><th>Trend</th><th>Signal</th><th>Next Dip</th></tr></thead>
            <tbody>
              {loading ? [...Array(10)].map((_,i)=>(
                <tr key={i}>{[...Array(9)].map((_,j)=><td key={j}><div className="skeleton" style={{height:16}}/></td>)}</tr>
              )) : filtered.map((p:any,i:number)=>{
                const sig = SIGNAL_CONFIG[p.buySignal]||SIGNAL_CONFIG['wait']
                const chgPositive = p.priceChange30d?.startsWith('+')
                return (
                  <tr key={i}>
                    <td style={{maxWidth:180}}>
                      <div style={{fontWeight:600,color:'#0F172A',marginBottom:2}}>{p.productName}</div>
                      <div style={{fontSize:11,color:'#94A3B8'}}>{p.category}</div>
                    </td>
                    <td style={{fontFamily:'DM Mono',fontWeight:700,color:'#0F172A',fontSize:14,whiteSpace:'nowrap'}}>{p.currency} {p.currentPrice}</td>
                    <td><MiniChart data={p.priceHistory||[]} color={m.color} current={p.currentPrice}/></td>
                    <td style={{fontFamily:'DM Mono',fontWeight:700,color:chgPositive?'#FF4D6A':'#00C48C',fontSize:13}}>{p.priceChange30d}</td>
                    <td style={{fontFamily:'DM Mono',color:'#00C48C',fontWeight:600,fontSize:13,whiteSpace:'nowrap'}}>{p.currency} {p.allTimeLow}</td>
                    <td style={{fontFamily:'DM Mono',color:'#64748B',fontSize:13,whiteSpace:'nowrap'}}>{p.currency} {p.avgPrice90d}</td>
                    <td><span style={{fontSize:13,fontWeight:600,color:trendColor(p.trend),textTransform:'capitalize'}}>{p.trend}</span></td>
                    <td><span style={{fontSize:11,padding:'3px 10px',borderRadius:20,fontWeight:700,background:sig.bg,color:sig.color,whiteSpace:'nowrap'}}>{sig.label}</span></td>
                    <td style={{fontSize:12,color:'#64748B'}}>{p.nextDipEstimate}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
