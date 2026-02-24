'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import PlatformFilter, { PlatformKey } from '@/components/PlatformFilter'

export default function RecommendationsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL'|'US'|'PH'|'BOTH'>('ALL')
  const [platform, setPlatform] = useState<PlatformKey>('all')

  useEffect(() => {
    fetch('/api/recommendations').then(r=>r.json()).then(j=>{setData(j.data||[]); setLoading(false)})
  }, [])

  const filtered = filter==='ALL' ? data : data.filter(r=>r.targetMarket===filter)
  const riskColor = (r:string) => ({Low:'#00C48C',Medium:'#FFB830',High:'#FF4D6A'}[r]||'#9CA3AF')
  const riskBg   = (r:string) => ({Low:'rgba(0,196,140,0.1)',Medium:'rgba(255,184,48,0.1)',High:'rgba(255,77,106,0.1)'}[r]||'#F3F4F6')
  const compColor = (c:string) => ({Low:'#00C48C',Medium:'#FFB830',High:'#FF4D6A'}[c]||'#9CA3AF')
  const activeMarket = filter === 'US' ? 'US' : filter === 'PH' ? 'PH' : undefined

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#F2F3F7' }}>
      <Sidebar />
      <main style={{ flex:1, padding:'28px 32px', overflow:'auto' }}>
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#1A1D2E', letterSpacing:'-0.4px' }}>✦ AI Product Picks</h1>
          <p style={{ fontSize:13, color:'#6B7280', marginTop:3 }}>AI-scored opportunities ranked by demand, competition, and profit potential</p>
        </div>

        {/* Market filter tabs */}
        <div style={{ display:'flex', gap:2, marginBottom:14, background:'#EBEBEF', borderRadius:11, padding:3, width:'fit-content' }}>
          {(['ALL','US','PH','BOTH'] as const).map(val=>(
            <button key={val} onClick={()=>{setFilter(val);setPlatform('all')}} style={{ padding:'7px 20px', borderRadius:9, border:'none', cursor:'pointer', fontSize:13, fontWeight:filter===val?700:400, background:filter===val?'white':'transparent', color:filter===val?'#1A1D2E':'#9CA3AF', transition:'all 0.15s', boxShadow:filter===val?'0 1px 4px rgba(0,0,0,0.1)':'none' }}>
              {val==='ALL'?`All (${data.length})`:val==='US'?'🇺🇸 US':val==='PH'?'🇵🇭 PH':'🌏 Both'}
            </button>
          ))}
        </div>

        <div style={{ marginBottom:18 }}>
          <PlatformFilter value={platform} onChange={setPlatform} market={activeMarket} />
        </div>

        <div className="card" style={{ overflow:'hidden' }}>
          <table>
            <thead>
              <tr><th>Score</th><th>Product Idea</th><th>Market</th><th>Category</th><th>Demand</th><th>Competition</th><th>Risk</th><th>Est. Profit</th></tr>
            </thead>
            <tbody>
              {loading ? [...Array(8)].map((_,i)=>(
                <tr key={i}>{[...Array(8)].map((_,j)=><td key={j}><div className="skeleton" style={{height:14}}/></td>)}</tr>
              )) : filtered.map((r:any,i:number)=>(
                <tr key={i}>
                  <td>
                    <div style={{ width:42, height:42, borderRadius:10, background:r.score>=80?'linear-gradient(135deg,#00C48C,#38EF7D)':'linear-gradient(135deg,#FFB830,#FF8C42)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, color:'white' }}>{r.score}</div>
                  </td>
                  <td style={{ maxWidth:220 }}>
                    <div style={{ fontWeight:600, color:'#1A1D2E', marginBottom:3 }}>{r.productIdea}</div>
                    <div style={{ fontSize:11, color:'#9CA3AF', lineHeight:1.4 }}>{r.reason?.slice(0,60)}...</div>
                  </td>
                  <td>
                    <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:600, background:r.targetMarket==='US'?'rgba(46,111,255,0.1)':r.targetMarket==='PH'?'rgba(255,77,106,0.1)':'rgba(0,196,140,0.1)', color:r.targetMarket==='US'?'#2E6FFF':r.targetMarket==='PH'?'#FF4D6A':'#00C48C' }}>
                      {r.targetMarket==='US'?'🇺🇸 US':r.targetMarket==='PH'?'🇵🇭 PH':'🌏 Both'}
                    </span>
                  </td>
                  <td style={{ color:'#6B7280', fontSize:12 }}>{r.category}</td>
                  <td><span style={{ fontSize:12, fontWeight:600, color:r.estimatedDemand==='Very High'?'#00C48C':r.estimatedDemand==='High'?'#2E6FFF':'#FFB830' }}>{r.estimatedDemand}</span></td>
                  <td><span style={{ fontSize:12, fontWeight:600, color:compColor(r.competition) }}>{r.competition}</span></td>
                  <td><span style={{ fontSize:11, padding:'3px 9px', borderRadius:20, background:riskBg(r.riskLevel), color:riskColor(r.riskLevel), fontWeight:600 }}>{r.riskLevel}</span></td>
                  <td style={{ color:'#00C48C', fontWeight:700, fontFamily:'DM Mono', fontSize:12, whiteSpace:'nowrap' }}>{r.estimatedProfit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
