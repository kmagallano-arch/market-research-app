'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import PlatformFilter, { PlatformKey, PLATFORMS } from '@/components/PlatformFilter'

const MARKET_CODE = 'SE'
const MARKET_NAME = 'Sweden'
const MARKET_FLAG = '🇸🇪'
const MARKET_COLOR = '#FF8C42'
const MARKET_PLATFORMS = 'Amazon SE, CDON, Elgiganten'

export default function SwedenMarketPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [platform, setPlatform] = useState<PlatformKey>('all')

  useEffect(() => {
    fetch('/api/se-market')
      .then(r=>{ if (!r.ok) throw new Error(`Failed (${r.status})`); return r.json() })
      .then(j=>{setData(j.data); setLoading(false)})
      .catch(e=>{setError(e.message); setLoading(false)})
  }, [retryCount])

  const tc = (t:string) => t==='up'?'#00C48C':t==='down'?'#FF4D6A':'#94A3B8'
  const ti = (t:string) => t==='up'?'↑':t==='down'?'↓':'→'

  const filteredProducts = (data?.trendingProducts||[]).filter((p:any) => {
    if (platform === 'all') return true
    const str = (p.platform||'').toLowerCase()
    return str.includes(platform) || str.includes((PLATFORMS[platform]?.label||'').toLowerCase())
  })

  const platformBadge = (pname: string) => {
    const n = pname?.toLowerCase() || ''
    if (n.includes('amazon'))    return { bg:'rgba(255,153,0,0.1)',  color:'#FF9900' }
    if (n.includes('bol'))       return { bg:'rgba(0,114,239,0.1)',  color:'#0072EF' }
    if (n.includes('otto'))      return { bg:'rgba(234,52,35,0.1)',  color:'#EA3423' }
    if (n.includes('ebay'))      return { bg:'rgba(0,100,210,0.1)',  color:'#0064D2' }
    if (n.includes('cdiscount')) return { bg:'rgba(255,100,0,0.1)', color:'#FF6400' }
    if (n.includes('fnac'))      return { bg:'rgba(255,197,0,0.1)', color:'#FFC500' }
    if (n.includes('cdon'))      return { bg:'rgba(227,6,19,0.1)',  color:'#E30613' }
    if (n.includes('catch'))     return { bg:'rgba(0,168,89,0.1)',  color:'#00A859' }
    if (n.includes('finn'))      return { bg:'rgba(6,93,186,0.1)',  color:'#065DBA' }
    return { bg:'rgba(107,114,128,0.1)', color:'#64748B' }
  }

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#F1F5F9'}}>
      <Sidebar/>
      <main style={{flex:1,padding:'28px 32px',overflow:'auto'}}>
        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:24,fontWeight:700,color:'#0F172A',letterSpacing:'-0.4px'}}>{MARKET_FLAG} {MARKET_NAME} Market</h1>
          <p style={{fontSize:14,color:'#64748B',marginTop:3}}>{MARKET_PLATFORMS} — trending products, categories, market intelligence</p>
        </div>

        <div style={{marginBottom:20}}>
          <PlatformFilter value={platform} onChange={setPlatform} market={MARKET_CODE}/>
        </div>

        {error && (
          <div style={{ padding:'12px 18px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, color:'#DC2626' }}>{error}</span>
            <button onClick={()=>setRetryCount(c=>c+1)} style={{ padding:'5px 14px', borderRadius:8, background:'#DC2626', color:'white', fontSize:12, fontWeight:600, border:'none', cursor:'pointer' }}>Retry</button>
          </div>
        )}

        {loading ? (
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'32px 20px',color:'#94A3B8',fontSize:14}}>
            <div style={{width:16,height:16,borderRadius:'50%',border:'2px solid #E2E8F0',borderTopColor:MARKET_COLOR,animation:'spin 0.8s linear infinite'}}/>
            Scanning {MARKET_NAME} market...
          </div>
        ) : data && (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:12}}>
              {(data.topCategories||[]).map((cat:any,i:number)=>(
                <div key={i} className="card" style={{padding:'18px 20px'}}>
                  <div style={{fontSize:14,color:'#0F172A',fontWeight:600,marginBottom:8}}>{cat.name}</div>
                  <div style={{fontSize:26,fontWeight:800,color:'#00C48C',fontFamily:'DM Mono'}}>{cat.growth}</div>
                  <div style={{fontSize:12,color:'#94A3B8',marginTop:4}}>avg {cat.avgPrice}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{overflow:'hidden'}}>
              <div style={{padding:'16px 20px',borderBottom:'1px solid #E2E8F0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontSize:15,fontWeight:700,color:'#0F172A'}}>Trending Products</div>
                <span style={{fontSize:13,color:'#94A3B8'}}>{filteredProducts.length} products{platform!=='all'?` · ${PLATFORMS[platform]?.label}`:''}</span>
              </div>
              <table>
                <thead><tr><th>Product</th><th>Platform</th><th>Price</th><th>Sold/mo</th><th>Rating</th><th>Trend</th><th>Keywords</th></tr></thead>
                <tbody>
                  {filteredProducts.length===0 ? (
                    <tr><td colSpan={7} style={{textAlign:'center',padding:'32px',color:'#94A3B8',fontSize:14}}>No products for this platform. Try "All Platforms".</td></tr>
                  ) : filteredProducts.map((prod:any,i:number)=>{
                    const pb = platformBadge(prod.platform)
                    return (
                      <tr key={i}>
                        <td style={{fontWeight:500,color:'#0F172A',maxWidth:240}}>{prod.title}</td>
                        <td><span style={{fontSize:12,padding:'3px 10px',borderRadius:20,fontWeight:600,background:pb.bg,color:pb.color}}>{prod.platform}</span></td>
                        <td style={{color:MARKET_COLOR,fontWeight:700,fontFamily:'DM Mono'}}>{prod.price}</td>
                        <td style={{color:'#64748B',fontFamily:'DM Mono',fontSize:13}}>{prod.soldLastMonth}</td>
                        <td style={{color:'#FFB830',fontFamily:'DM Mono'}}>{prod.rating}★</td>
                        <td><span style={{color:tc(prod.trend),fontWeight:700,fontSize:15}}>{ti(prod.trend)}</span></td>
                        <td><div style={{display:'flex',gap:4}}>{(prod.keywords||[]).slice(0,2).map((kw:string,j:number)=>(
                          <span key={j} style={{fontSize:11,padding:'2px 9px',background:'#F1F5F9',color:'#64748B',borderRadius:20}}>{kw}</span>
                        ))}</div></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div className="card" style={{padding:'20px 22px'}}>
                <div style={{fontSize:15,fontWeight:700,color:'#0F172A',marginBottom:14}}>Market Insights</div>
                {(data.marketInsights||[]).map((ins:string,i:number)=>(
                  <div key={i} style={{display:'flex',gap:10,padding:'11px 0',borderBottom:'1px solid #E2E8F0',alignItems:'flex-start'}}>
                    <span style={{color:MARKET_COLOR,flexShrink:0,fontWeight:700}}>›</span>
                    <span style={{fontSize:14,color:'#64748B',lineHeight:1.5}}>{ins}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{padding:'20px 22px'}}>
                <div style={{fontSize:15,fontWeight:700,color:'#0F172A',marginBottom:14}}>Seasonal Opportunities</div>
                {(data.seasonalTips||[]).map((tip:string,i:number)=>(
                  <div key={i} style={{display:'flex',gap:10,padding:'11px 0',borderBottom:'1px solid #E2E8F0',alignItems:'flex-start'}}>
                    <span style={{color:'#FFB830',flexShrink:0,fontWeight:700}}>◆</span>
                    <span style={{fontSize:14,color:'#64748B',lineHeight:1.5}}>{tip}</span>
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
