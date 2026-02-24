'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import MarketSelector from '@/components/MarketSelector'
import { MARKETS, MarketCode } from '@/lib/markets'

const POPULAR = ['robot vacuum cleaner','dashcam 4K','wifi mesh router','window cleaning robot','cordless vacuum','wireless earbuds','smart plug','portable charger 20000mah']
const GRADE_CONFIG: Record<string,{color:string;bg:string;gradient:string}> = {
  'A+': {color:'#00C48C',bg:'rgba(0,196,140,0.1)',gradient:'linear-gradient(135deg,#00C48C,#38EF7D)'},
  'A':  {color:'#2E6FFF',bg:'rgba(46,111,255,0.1)',gradient:'linear-gradient(135deg,#2E6FFF,#667EEA)'},
  'B':  {color:'#FFB830',bg:'rgba(255,184,48,0.1)',gradient:'linear-gradient(135deg,#FFB830,#FF8C42)'},
  'C':  {color:'#FF8C42',bg:'rgba(255,140,66,0.1)',gradient:'linear-gradient(135deg,#FF8C42,#FF4D6A)'},
  'D':  {color:'#FF4D6A',bg:'rgba(255,77,106,0.1)',gradient:'linear-gradient(135deg,#FF4D6A,#C53030)'},
}

function ScoreBar({label,value,color}:{label:string;value:number;color:string}) {
  return (
    <div style={{marginBottom:12}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
        <span style={{fontSize:13,color:'#6B7280'}}>{label}</span>
        <span style={{fontSize:13,fontWeight:700,color,fontFamily:'DM Mono'}}>{value}</span>
      </div>
      <div style={{height:7,background:'#F0F1F5',borderRadius:4}}>
        <div style={{width:`${value}%`,height:'100%',background:color,borderRadius:4,transition:'width 0.8s ease'}}/>
      </div>
    </div>
  )
}

export default function ScorecardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [market, setMarket] = useState<MarketCode>('US')
  const [product, setProduct] = useState('robot vacuum cleaner')
  const [input, setInput] = useState('robot vacuum cleaner')
  const m = MARKETS[market]

  const analyze = () => setProduct(input)

  useEffect(() => {
    setLoading(true); setData(null)
    fetch(`/api/scorecard?product=${encodeURIComponent(product)}&market=${market}`)
      .then(r=>r.json()).then(j=>{setData(j.data); setLoading(false)})
  }, [product, market])

  const grade = data?.grade || 'B'
  const gc = GRADE_CONFIG[grade] || GRADE_CONFIG['B']

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#F2F3F7'}}>
      <Sidebar/>
      <main style={{flex:1,padding:'28px 32px',overflow:'auto'}}>
        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:24,fontWeight:700,color:'#1A1D2E',letterSpacing:'-0.4px'}}>📋 Product Scorecard</h1>
          <p style={{fontSize:14,color:'#6B7280',marginTop:3}}>Helium 10-style product scoring — demand, competition, profit, ROI</p>
        </div>

        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:600,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:9}}>Market</div>
          <MarketSelector value={market} onChange={setMarket}/>
        </div>

        <div style={{display:'flex',gap:10,marginBottom:14,alignItems:'center'}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&analyze()} placeholder="Enter product to score..." style={{flex:1,maxWidth:400,padding:'10px 16px',borderRadius:10,border:'1.5px solid #E8E9EF',fontSize:14,outline:'none',fontFamily:'DM Sans,sans-serif'}}/>
          <button onClick={analyze} style={{padding:'10px 22px',background:'#2E6FFF',color:'white',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer'}}>Score It</button>
        </div>

        <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
          {POPULAR.map(p=>(
            <button key={p} onClick={()=>{setInput(p);setProduct(p)}} style={{padding:'5px 13px',borderRadius:20,border:`1.5px solid ${product===p?m.color:'#E8E9EF'}`,background:product===p?`${m.color}12`:'white',color:product===p?m.color:'#6B7280',fontSize:12,cursor:'pointer',fontWeight:product===p?700:400}}>{p}</button>
          ))}
        </div>

        {loading && (
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'40px 20px',color:'#9CA3AF',fontSize:14}}>
            <div style={{width:16,height:16,borderRadius:'50%',border:'2px solid #E8E9EF',borderTopColor:m.color,animation:'spin 0.8s linear infinite'}}/>
            Scoring "{product}" in {m.label}...
          </div>
        )}

        {!loading && data && (
          <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:16,alignItems:'start'}}>

            {/* Left: grade + scores */}
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div className="card" style={{padding:'24px',textAlign:'center'}}>
                <div style={{fontSize:12,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:12}}>Overall Grade</div>
                <div style={{width:100,height:100,borderRadius:'50%',background:gc.gradient,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',boxShadow:`0 8px 24px ${gc.color}40`}}>
                  <span style={{fontSize:42,fontWeight:900,color:'white'}}>{grade}</span>
                </div>
                <div style={{fontSize:36,fontWeight:800,color:gc.color,fontFamily:'DM Mono'}}>{data.overallScore}</div>
                <div style={{fontSize:12,color:'#9CA3AF',marginTop:4}}>out of 100</div>
                <div style={{fontSize:13,color:'#6B7280',lineHeight:1.5,marginTop:12,padding:'10px',background:'#F8F9FB',borderRadius:8}}>{data.verdict}</div>
              </div>

              <div className="card" style={{padding:'20px'}}>
                <div style={{fontSize:14,fontWeight:700,color:'#1A1D2E',marginBottom:14}}>Score Breakdown</div>
                {data.scores && Object.entries(data.scores).map(([key,val]:any)=>(
                  <ScoreBar key={key} label={key.replace(/([A-Z])/g,' $1').replace(/^\w/,(c:string)=>c.toUpperCase())} value={val} color={val>=70?'#00C48C':val>=50?'#2E6FFF':'#FF4D6A'}/>
                ))}
              </div>
            </div>

            {/* Right: metrics + keywords + recommendations */}
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {data.metrics && (
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
                  {[
                    {l:'Monthly Sales',  v:data.metrics.estimatedMonthlySales?.toLocaleString(), c:'#2E6FFF'},
                    {l:'Revenue',        v:data.metrics.estimatedRevenue,    c:'#00C48C'},
                    {l:'Est. Profit',    v:data.metrics.estimatedProfit,     c:'#00C48C'},
                    {l:'ROI',            v:data.metrics.roi,                 c:'#FFB830'},
                    {l:'Avg Price',      v:data.metrics.avgSellingPrice,     c:m.color},
                    {l:'COGS',           v:data.metrics.estimatedCOGS,       c:'#FF4D6A'},
                    {l:'Payback Period', v:data.metrics.paybackPeriod,       c:'#8B5CF6'},
                    {l:'Break-Even',     v:`${data.metrics.breakEvenUnits} units`, c:'#6B7280'},
                  ].map((s,i)=>(
                    <div key={i} className="card" style={{padding:'14px 16px'}}>
                      <div style={{fontSize:10,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:5}}>{s.l}</div>
                      <div style={{fontSize:16,fontWeight:800,color:s.c,fontFamily:'DM Mono'}}>{s.v}</div>
                    </div>
                  ))}
                </div>
              )}

              {data.keywords && (
                <div className="card" style={{overflow:'hidden'}}>
                  <div style={{padding:'14px 18px',borderBottom:'1px solid #F0F1F5',fontSize:14,fontWeight:700,color:'#1A1D2E'}}>🔑 Keyword Opportunities</div>
                  <table>
                    <thead><tr><th>Keyword</th><th>Volume</th><th>Difficulty</th><th>Opportunity</th></tr></thead>
                    <tbody>
                      {data.keywords.map((k:any,i:number)=>(
                        <tr key={i}>
                          <td style={{fontWeight:500,color:'#1A1D2E'}}>{k.term}</td>
                          <td style={{fontFamily:'DM Mono',fontSize:13,color:'#6B7280'}}>{k.volume}</td>
                          <td>
                            <div style={{display:'flex',alignItems:'center',gap:6}}>
                              <div style={{width:50,height:5,background:'#F0F1F5',borderRadius:3}}><div style={{width:`${k.difficulty}%`,height:'100%',background:k.difficulty<40?'#00C48C':k.difficulty<70?'#FFB830':'#FF4D6A',borderRadius:3}}/></div>
                              <span style={{fontSize:12,fontFamily:'DM Mono'}}>{k.difficulty}</span>
                            </div>
                          </td>
                          <td>{k.opportunity && <span style={{fontSize:11,padding:'2px 8px',background:'rgba(0,196,140,0.1)',color:'#00C48C',borderRadius:20,fontWeight:700}}>✓ High</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div className="card" style={{padding:'18px 20px'}}>
                  <div style={{fontSize:14,fontWeight:700,color:'#1A1D2E',marginBottom:12}}>✅ Recommendations</div>
                  {(data.recommendations||[]).map((r:string,i:number)=>(
                    <div key={i} style={{display:'flex',gap:8,marginBottom:8,alignItems:'flex-start'}}>
                      <span style={{color:'#00C48C',flexShrink:0,fontWeight:700,marginTop:1}}>›</span>
                      <span style={{fontSize:13,color:'#6B7280',lineHeight:1.5}}>{r}</span>
                    </div>
                  ))}
                </div>
                <div className="card" style={{padding:'18px 20px'}}>
                  <div style={{fontSize:14,fontWeight:700,color:'#1A1D2E',marginBottom:12}}>⚠️ Risks</div>
                  {(data.risks||[]).map((r:string,i:number)=>(
                    <div key={i} style={{display:'flex',gap:8,marginBottom:8,alignItems:'flex-start'}}>
                      <span style={{color:'#FF4D6A',flexShrink:0,fontWeight:700,marginTop:1}}>›</span>
                      <span style={{fontSize:13,color:'#6B7280',lineHeight:1.5}}>{r}</span>
                    </div>
                  ))}
                  {data.suggestedPrice && <div style={{marginTop:10,padding:'8px 12px',background:'rgba(46,111,255,0.08)',borderRadius:8,fontSize:13,color:'#2E6FFF'}}>💰 Suggested price: <b>{data.suggestedPrice}</b> · MOQ: <b>{data.suggestedMOQ} units</b></div>}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
