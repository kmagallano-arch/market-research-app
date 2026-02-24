'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import MarketSelector from '@/components/MarketSelector'
import { MARKETS, MarketCode } from '@/lib/markets'

const POPULAR = ['robot vacuum cleaner','dashcam 4K','wifi mesh router','window cleaning robot','cordless vacuum','wireless earbuds','smart plug','portable charger']

type StreamState = 'idle' | 'streaming' | 'done' | 'error'

export default function CompetitorPage() {
  const [data, setData] = useState<any>(null)
  const [state, setState] = useState<StreamState>('idle')
  const [streamText, setStreamText] = useState('')
  const [market, setMarket] = useState<MarketCode>('US')
  const [product, setProduct] = useState('')
  const [input, setInput] = useState('robot vacuum cleaner')
  const m = MARKETS[market]

  const analyze = async (p?: string) => {
    const query = p || input
    setProduct(query)
    setData(null)
    setStreamText('')
    setState('streaming')

    try {
      const res = await fetch(`/api/competitor-stream?product=${encodeURIComponent(query)}&market=${market}`)
      if (!res.body) throw new Error('No stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        full += chunk
        setStreamText(full)
      }

      const cleaned = full.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(cleaned)
      setData(parsed.data)
      setState('done')
    } catch (e) {
      setState('error')
    }
  }

  const diffColor = (d:string) => ({Easy:'#00C48C',Medium:'#FFB830',Hard:'#FF4D6A'}[d]||'#9CA3AF')
  const diffBg   = (d:string) => ({Easy:'rgba(0,196,140,0.1)',Medium:'rgba(255,184,48,0.1)',Hard:'rgba(255,77,106,0.1)'}[d]||'#F3F4F6')

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#F2F3F7'}}>
      <Sidebar/>
      <main style={{flex:1,padding:'28px 32px',overflow:'auto'}}>
        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:24,fontWeight:700,color:'#1A1D2E',letterSpacing:'-0.4px'}}>🏆 Competitor Analyzer</h1>
          <p style={{fontSize:14,color:'#6B7280',marginTop:3}}>Jungle Scout-style competitor intelligence — see who you're up against</p>
        </div>

        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:600,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:9}}>Market</div>
          <MarketSelector value={market} onChange={setMarket}/>
        </div>

        <div style={{display:'flex',gap:10,marginBottom:14,alignItems:'center'}}>
          <input
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&analyze()}
            placeholder="Enter product to analyze..."
            style={{flex:1,maxWidth:400,padding:'10px 16px',borderRadius:10,border:'1.5px solid #E8E9EF',fontSize:14,outline:'none',fontFamily:'DM Sans,sans-serif'}}
          />
          <button
            onClick={()=>analyze()}
            disabled={state==='streaming'}
            style={{padding:'10px 22px',background:state==='streaming'?'#9CA3AF':'#2E6FFF',color:'white',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:state==='streaming'?'not-allowed':'pointer',transition:'background 0.2s'}}
          >
            {state==='streaming' ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        <div style={{display:'flex',gap:8,marginBottom:24,flexWrap:'wrap'}}>
          {POPULAR.map(p=>(
            <button key={p} onClick={()=>{setInput(p);analyze(p)}} style={{padding:'5px 13px',borderRadius:20,border:`1.5px solid ${product===p?m.color:'#E8E9EF'}`,background:product===p?`${m.color}12`:'white',color:product===p?m.color:'#6B7280',fontSize:12,cursor:'pointer',fontWeight:product===p?700:400}}>
              {p}
            </button>
          ))}
        </div>

        {/* Streaming progress indicator */}
        {state==='streaming' && (
          <div style={{marginBottom:20}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12,padding:'14px 18px',background:'white',borderRadius:12,border:'1px solid #E8E9EF'}}>
              <div style={{width:14,height:14,borderRadius:'50%',border:'2px solid #E8E9EF',borderTopColor:m.color,animation:'spin 0.7s linear infinite',flexShrink:0}}/>
              <span style={{fontSize:14,color:'#6B7280'}}>Scanning competitors for <b style={{color:'#1A1D2E'}}>{product || input}</b> in {m.label}...</span>
              <span style={{marginLeft:'auto',fontSize:12,color:'#9CA3AF',fontFamily:'DM Mono'}}>{streamText.length} chars</span>
            </div>
            {/* Live JSON preview */}
            <div style={{padding:'12px 16px',background:'#0F1117',borderRadius:10,fontFamily:'DM Mono',fontSize:11,color:'#7DD3FC',maxHeight:120,overflow:'hidden',position:'relative'}}>
              <div style={{position:'absolute',bottom:0,left:0,right:0,height:40,background:'linear-gradient(transparent,#0F1117)'}}/>
              {streamText.slice(-400)}
            </div>
          </div>
        )}

        {state==='done' && data && (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {data.marketSummary && (
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
                {[
                  {label:'Avg Price',       value:data.marketSummary.avgPrice,             color:m.color},
                  {label:'Avg Rating',      value:`${data.marketSummary.avgRating}★`,       color:'#FFB830'},
                  {label:'Total Revenue',   value:data.marketSummary.totalMonthlyRevenue,   color:'#00C48C'},
                  {label:'Entry Difficulty',value:data.marketSummary.entryDifficulty,       color:diffColor(data.marketSummary.entryDifficulty)},
                ].map((c,i)=>(
                  <div key={i} className="card" style={{padding:'16px 18px'}}>
                    <div style={{fontSize:11,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:6}}>{c.label}</div>
                    <div style={{fontSize:22,fontWeight:800,color:c.color,fontFamily:'DM Mono'}}>{c.value}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="card" style={{overflow:'hidden'}}>
              <div style={{padding:'16px 20px',borderBottom:'1px solid #F0F1F5',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontSize:15,fontWeight:700,color:'#1A1D2E'}}>Top Competitors — {data.product}</div>
                {data.marketSummary && <span style={{fontSize:12,padding:'4px 12px',borderRadius:20,fontWeight:700,background:diffBg(data.marketSummary.entryDifficulty),color:diffColor(data.marketSummary.entryDifficulty)}}>{data.marketSummary.entryDifficulty} to Enter</span>}
              </div>
              <table>
                <thead><tr><th>Product</th><th>Price</th><th>Rating</th><th>Reviews</th><th>Monthly Sales</th><th>Revenue</th><th>BSR</th><th>Listing Score</th><th>Gap</th></tr></thead>
                <tbody>
                  {(data.topCompetitors||[]).map((c:any,i:number)=>(
                    <tr key={i}>
                      <td style={{maxWidth:200}}>
                        <div style={{fontWeight:600,color:'#1A1D2E',marginBottom:2}}>{c.name}</div>
                        <div style={{fontSize:11,color:'#9CA3AF'}}>{c.brand} · {c.fulfillment}</div>
                      </td>
                      <td style={{color:'#00C48C',fontWeight:700,fontFamily:'DM Mono'}}>{c.price}</td>
                      <td style={{color:'#FFB830',fontFamily:'DM Mono'}}>{c.rating}★</td>
                      <td style={{color:'#6B7280',fontFamily:'DM Mono',fontSize:13}}>{(c.reviews||0).toLocaleString()}</td>
                      <td style={{color:m.color,fontFamily:'DM Mono',fontSize:13}}>{(c.monthlySales||0).toLocaleString()}</td>
                      <td style={{color:'#1A1D2E',fontFamily:'DM Mono',fontSize:13,fontWeight:600}}>{c.monthlyRevenue}</td>
                      <td style={{color:'#9CA3AF',fontFamily:'DM Mono',fontSize:12}}>#{c.bsr?.toLocaleString()}</td>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          <div style={{width:50,height:5,background:'#F0F1F5',borderRadius:3}}>
                            <div style={{width:`${c.listingScore}%`,height:'100%',background:c.listingScore>=70?'#00C48C':c.listingScore>=50?'#FFB830':'#FF4D6A',borderRadius:3}}/>
                          </div>
                          <span style={{fontSize:12,fontFamily:'DM Mono',fontWeight:700,color:c.listingScore>=70?'#00C48C':c.listingScore>=50?'#FFB830':'#FF4D6A'}}>{c.listingScore}</span>
                        </div>
                      </td>
                      <td style={{maxWidth:160,fontSize:12,color:'#6B7280'}}>{c.opportunityGap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div className="card" style={{padding:'18px 20px'}}>
                <div style={{fontSize:15,fontWeight:700,color:'#1A1D2E',marginBottom:14}}>🔑 Keyword Gaps</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {(data.keywordGaps||[]).map((kw:string,i:number)=>(
                    <span key={i} style={{fontSize:12,padding:'5px 12px',background:'rgba(46,111,255,0.1)',color:'#2E6FFF',borderRadius:20,fontWeight:500}}>{kw}</span>
                  ))}
                </div>
              </div>
              <div className="card" style={{padding:'18px 20px'}}>
                <div style={{fontSize:15,fontWeight:700,color:'#1A1D2E',marginBottom:10}}>💡 Recommendation</div>
                <p style={{fontSize:14,color:'#6B7280',lineHeight:1.6}}>{data.marketSummary?.recommendation}</p>
                {data.pricingOpportunity && <div style={{marginTop:10,padding:'8px 12px',background:'rgba(0,196,140,0.08)',borderRadius:8,fontSize:13,color:'#00C48C',fontWeight:500}}>💰 {data.pricingOpportunity}</div>}
              </div>
            </div>
          </div>
        )}

        {state==='error' && (
          <div style={{padding:'20px',background:'rgba(255,77,106,0.08)',borderRadius:12,color:'#FF4D6A',fontSize:14}}>
            Failed to analyze. Please try again.
          </div>
        )}
      </main>
    </div>
  )
}
