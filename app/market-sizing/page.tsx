'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { MARKETS } from '@/lib/markets'

const MAT_CONFIG: Record<string,{color:string;bg:string}> = {
  emerging:  {color:'#00C48C',bg:'rgba(0,196,140,0.1)'},
  growing:   {color:'#2E6FFF',bg:'rgba(46,111,255,0.1)'},
  mature:    {color:'#FFB830',bg:'rgba(255,184,48,0.1)'},
  declining: {color:'#FF4D6A',bg:'rgba(255,77,106,0.1)'},
}

export default function MarketSizingPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('electronics')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/market-sizing?category=${category}`)
      .then(r=>r.json()).then(j=>{setData(j.data); setLoading(false)})
  }, [category])

  const oppColor = (o:string) => o==='high'?'#00C48C':o==='medium'?'#FFB830':'#9CA3AF'

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#F2F3F7'}}>
      <Sidebar/>
      <main style={{flex:1,padding:'28px 32px',overflow:'auto'}}>
        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:24,fontWeight:700,color:'#1A1D2E',letterSpacing:'-0.4px'}}>🌍 Market Sizing</h1>
          <p style={{fontSize:14,color:'#6B7280',marginTop:3}}>Statista-style TAM/SAM/SOM analysis across all 7 markets</p>
        </div>

        <div style={{display:'flex',gap:10,marginBottom:20,alignItems:'center'}}>
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            {['electronics','home-kitchen','cleaning-products','smart-home','automotive','gadgets','health-wellness'].map(c=>(
              <option key={c} value={c}>{c.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>
            ))}
          </select>
          {loading && <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#9CA3AF'}}><div style={{width:13,height:13,borderRadius:'50%',border:'2px solid #E8E9EF',borderTopColor:'#2E6FFF',animation:'spin 0.8s linear infinite'}}/>Loading market data...</div>}
        </div>

        {!loading && data && (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>

            {/* Global summary */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
              <div className="card" style={{padding:'20px 22px',gridColumn:'1/2'}}>
                <div style={{fontSize:12,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8}}>Global TAM</div>
                <div style={{fontSize:32,fontWeight:800,color:'#2E6FFF',fontFamily:'DM Mono'}}>{data.globalTAM}</div>
                <div style={{fontSize:13,color:'#00C48C',fontWeight:600,marginTop:4}}>{data.globalGrowthRate} CAGR</div>
              </div>
              {data.forecast && (
                <div className="card" style={{padding:'20px 22px',gridColumn:'2/4'}}>
                  <div style={{fontSize:12,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:14}}>Market Forecast</div>
                  <div style={{display:'flex',gap:0,alignItems:'flex-end',height:60}}>
                    {Object.entries(data.forecast).map(([yr,val]:any,i,arr)=>{
                      const vals = arr.map(([,v]:any)=>parseFloat(v.replace(/[^0-9.]/g,'')))
                      const max = Math.max(...vals)
                      const h = (parseFloat(val.replace(/[^0-9.]/g,''))/max)*50+10
                      return (
                        <div key={yr} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                          <div style={{fontSize:11,color:'#2E6FFF',fontWeight:700}}>{val}</div>
                          <div style={{width:'70%',height:`${h}px`,background:'linear-gradient(180deg,#2E6FFF,#667EEA)',borderRadius:'4px 4px 0 0'}}/>
                          <div style={{fontSize:11,color:'#9CA3AF'}}>{yr}</div>
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
                          <div style={{fontSize:15,fontWeight:700,color:'#1A1D2E'}}>{mkt.market}</div>
                          <div style={{fontSize:12,color:'#9CA3AF'}}>{mkt.topPlatform}</div>
                        </div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'flex-end'}}>
                        <span style={{fontSize:11,padding:'2px 9px',borderRadius:20,fontWeight:700,background:matConf.bg,color:matConf.color,textTransform:'capitalize'}}>{mkt.marketMaturity}</span>
                        <span style={{fontSize:11,fontWeight:700,color:oppColor(mkt.opportunity),textTransform:'capitalize'}}>⭐ {mkt.opportunity} opp.</span>
                      </div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:12}}>
                      {[{l:'TAM',v:mkt.tam,c:'#2E6FFF'},{l:'SAM',v:mkt.sam,c:'#8B5CF6'},{l:'SOM',v:mkt.som,c:'#00C48C'}].map((s,j)=>(
                        <div key={j} style={{textAlign:'center',padding:'8px',background:'#F8F9FB',borderRadius:8}}>
                          <div style={{fontSize:12,fontWeight:700,color:s.c,fontFamily:'DM Mono'}}>{s.v}</div>
                          <div style={{fontSize:9,color:'#9CA3AF',textTransform:'uppercase',marginTop:2}}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:10}}>
                      <span style={{color:'#6B7280'}}>Growth: <b style={{color:'#00C48C'}}>{mkt.growthRate}</b></span>
                      <span style={{color:'#6B7280'}}>eComm: <b style={{color:'#2E6FFF'}}>{mkt.ecomPenetration}</b></span>
                      <span style={{color:'#6B7280'}}>AOV: <b>{mkt.avgOrderValue}</b></span>
                    </div>
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                      {(mkt.keyDrivers||[]).slice(0,2).map((d:string,j:number)=>(
                        <span key={j} style={{fontSize:10,padding:'2px 8px',background:'rgba(46,111,255,0.08)',color:'#2E6FFF',borderRadius:20}}>{d}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Subcategories */}
            {data.subcategories && (
              <div className="card" style={{overflow:'hidden'}}>
                <div style={{padding:'16px 20px',borderBottom:'1px solid #F0F1F5'}}>
                  <div style={{fontSize:15,fontWeight:700,color:'#1A1D2E'}}>Subcategory Breakdown</div>
                </div>
                <table>
                  <thead><tr><th>Subcategory</th><th>Global Size</th><th>Growth Rate</th><th>Hot Markets</th></tr></thead>
                  <tbody>
                    {data.subcategories.map((s:any,i:number)=>(
                      <tr key={i}>
                        <td style={{fontWeight:600,color:'#1A1D2E'}}>{s.name}</td>
                        <td style={{fontFamily:'DM Mono',color:'#2E6FFF',fontWeight:700}}>{s.globalSize}</td>
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
