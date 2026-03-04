'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { MARKETS } from '@/lib/markets'

const MAT_CONFIG: Record<string,{color:string;bg:string}> = {
  emerging:  {color:'#00C48C',bg:'rgba(0,196,140,0.1)'},
  growing:   {color:'#0EA5E9',bg:'rgba(14,165,233,0.1)'},
  mature:    {color:'#FFB830',bg:'rgba(255,184,48,0.1)'},
  declining: {color:'#FF4D6A',bg:'rgba(255,77,106,0.1)'},
}

export default function MarketSizingPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [category, setCategory] = useState('electronics')

  useEffect(() => {
    setLoading(true); setError(null)
    fetch(`/api/market-sizing?category=${category}`)
      .then(r=>{ if (!r.ok) throw new Error(`Failed (${r.status})`); return r.json() })
      .then(j=>{setData(j.data); setLoading(false)})
      .catch(e=>{setError(e.message); setLoading(false)})
  }, [category, retryCount])

  const oppColor = (o:string) => o==='high'?'#00C48C':o==='medium'?'#FFB830':'#94A3B8'

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#F1F5F9'}}>
      <Sidebar/>
      <main style={{flex:1,padding:'28px 32px',overflow:'auto'}}>
        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:24,fontWeight:700,color:'#0F172A',letterSpacing:'-0.4px'}}>🌍 Market Sizing</h1>
          <p style={{fontSize:14,color:'#64748B',marginTop:3}}>Statista-style TAM/SAM/SOM analysis across all 7 markets</p>
        </div>

        <div style={{display:'flex',gap:10,marginBottom:20,alignItems:'center'}}>
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            {['electronics','home-kitchen','cleaning-products','smart-home','automotive','gadgets','health-wellness'].map(c=>(
              <option key={c} value={c}>{c.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>
            ))}
          </select>
          {loading && <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#94A3B8'}}><div style={{width:13,height:13,borderRadius:'50%',border:'2px solid #E2E8F0',borderTopColor:'#0EA5E9',animation:'spin 0.8s linear infinite'}}/>Loading market data...</div>}
        </div>

        {error && (
          <div style={{ padding:'12px 18px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, color:'#DC2626' }}>{error}</span>
            <button onClick={()=>setRetryCount(c=>c+1)} style={{ padding:'5px 14px', borderRadius:8, background:'#DC2626', color:'white', fontSize:12, fontWeight:600, border:'none', cursor:'pointer' }}>Retry</button>
          </div>
        )}

        {!loading && data && (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>

            {/* Global summary */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
              <div className="card" style={{padding:'20px 22px',gridColumn:'1/2'}}>
                <div style={{fontSize:12,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8}}>Global TAM</div>
                <div style={{fontSize:32,fontWeight:800,color:'#0EA5E9',fontFamily:'DM Mono'}}>{data.globalTAM}</div>
                <div style={{fontSize:13,color:'#00C48C',fontWeight:600,marginTop:4}}>{data.globalGrowthRate} CAGR</div>
              </div>
              {data.forecast && (
                <div className="card" style={{padding:'20px 22px',gridColumn:'2/4'}}>
                  <div style={{fontSize:12,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:14}}>Market Forecast</div>
                  <div style={{display:'flex',gap:0,alignItems:'flex-end',height:60}}>
                    {Object.entries(data.forecast).map(([yr,val]:any,i,arr)=>{
                      const vals = arr.map(([,v]:any)=>parseFloat(v.replace(/[^0-9.]/g,'')))
                      const max = Math.max(...vals)
                      const h = (parseFloat(val.replace(/[^0-9.]/g,''))/max)*50+10
                      return (
                        <div key={yr} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                          <div style={{fontSize:11,color:'#0EA5E9',fontWeight:700}}>{val}</div>
                          <div style={{width:'70%',height:`${h}px`,background:'linear-gradient(180deg,#0EA5E9,#38BDF8)',borderRadius:'4px 4px 0 0'}}/>
                          <div style={{fontSize:11,color:'#94A3B8'}}>{yr}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Per-market cards */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:12}}>
              {(data.markets||[]).map((mkt:any,i:number)=>{
                const mc = MARKETS[mkt.market as keyof typeof MARKETS]
                const matConf = MAT_CONFIG[mkt.marketMaturity]||MAT_CONFIG.growing
                return (
                  <div key={i} className="card" style={{padding:'18px 20px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <span style={{fontSize:22}}>{mkt.flag}</span>
                        <div>
                          <div style={{fontSize:15,fontWeight:700,color:'#0F172A'}}>{mkt.market}</div>
                          <div style={{fontSize:12,color:'#94A3B8'}}>{mkt.topPlatform}</div>
                        </div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'flex-end'}}>
                        <span style={{fontSize:11,padding:'2px 9px',borderRadius:20,fontWeight:700,background:matConf.bg,color:matConf.color,textTransform:'capitalize'}}>{mkt.marketMaturity}</span>
                        <span style={{fontSize:11,fontWeight:700,color:oppColor(mkt.opportunity),textTransform:'capitalize'}}>⭐ {mkt.opportunity} opp.</span>
                      </div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:12}}>
                      {[{l:'TAM',v:mkt.tam,c:'#0EA5E9'},{l:'SAM',v:mkt.sam,c:'#8B5CF6'},{l:'SOM',v:mkt.som,c:'#00C48C'}].map((s,j)=>(
                        <div key={j} style={{textAlign:'center',padding:'8px',background:'#F1F5F9',borderRadius:8}}>
                          <div style={{fontSize:12,fontWeight:700,color:s.c,fontFamily:'DM Mono'}}>{s.v}</div>
                          <div style={{fontSize:9,color:'#94A3B8',textTransform:'uppercase',marginTop:2}}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:10}}>
                      <span style={{color:'#64748B'}}>Growth: <b style={{color:'#00C48C'}}>{mkt.growthRate}</b></span>
                      <span style={{color:'#64748B'}}>eComm: <b style={{color:'#0EA5E9'}}>{mkt.ecomPenetration}</b></span>
                      <span style={{color:'#64748B'}}>AOV: <b>{mkt.avgOrderValue}</b></span>
                    </div>
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                      {(mkt.keyDrivers||[]).slice(0,2).map((d:string,j:number)=>(
                        <span key={j} style={{fontSize:10,padding:'2px 8px',background:'rgba(14,165,233,0.08)',color:'#0EA5E9',borderRadius:20}}>{d}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Subcategories */}
            {data.subcategories && (
              <div className="card" style={{overflow:'hidden'}}>
                <div style={{padding:'16px 20px',borderBottom:'1px solid #E2E8F0'}}>
                  <div style={{fontSize:15,fontWeight:700,color:'#0F172A'}}>Subcategory Breakdown</div>
                </div>
                <table>
                  <thead><tr><th>Subcategory</th><th>Global Size</th><th>Growth Rate</th><th>Hot Markets</th></tr></thead>
                  <tbody>
                    {data.subcategories.map((s:any,i:number)=>(
                      <tr key={i}>
                        <td style={{fontWeight:600,color:'#0F172A'}}>{s.name}</td>
                        <td style={{fontFamily:'DM Mono',color:'#0EA5E9',fontWeight:700}}>{s.globalSize}</td>
                        <td style={{fontFamily:'DM Mono',color:'#00C48C',fontWeight:700}}>{s.growthRate}</td>
                        <td><div style={{display:'flex',gap:4}}>{(s.hotMarkets||[]).map((mkt:string,j:number)=><span key={j} style={{fontSize:11,padding:'2px 8px',background:'rgba(255,184,48,0.1)',color:'#FFB830',borderRadius:20,fontWeight:600}}>{mkt}</span>)}</div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
