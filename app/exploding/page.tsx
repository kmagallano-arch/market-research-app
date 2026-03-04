'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'

const STAGE_CONFIG: Record<string,{color:string;bg:string;icon:string}> = {
  'pre-peak': {color:'#00C48C',bg:'rgba(0,196,140,0.1)',icon:'🌱'},
  'early':    {color:'#0EA5E9',bg:'rgba(14,165,233,0.1)',icon:'📡'},
  'growing':  {color:'#FFB830',bg:'rgba(255,184,48,0.1)',icon:'📈'},
  'peaking':  {color:'#FF4D6A',bg:'rgba(255,77,106,0.1)',icon:'🔥'},
  'post-peak':{color:'#94A3B8',bg:'rgba(156,163,175,0.1)',icon:'📉'},
}

function Sparkline({data,color}:{data:number[];color:string}) {
  const min=Math.min(...data), max=Math.max(...data)
  const w=120,h=32
  const pts=data.map((v,i)=>{
    const x=(i/(data.length-1))*w
    const y=h-((v-min)/(max-min||1))*h*0.85-h*0.08
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} style={{overflow:'visible'}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts.split(' ').pop()?.split(',')[0]} cy={pts.split(' ').pop()?.split(',')[1]} r="3" fill={color}/>
    </svg>
  )
}

export default function ExplodingPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [category, setCategory] = useState('electronics')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setLoading(true); setError(null)
    fetch(`/api/exploding?category=${category}`)
      .then(r=>{ if (!r.ok) throw new Error(`Failed (${r.status})`); return r.json() })
      .then(j=>{setData(j.data||[]); setLoading(false)})
      .catch(e=>{setError(e.message); setLoading(false)})
  }, [category, retryCount])

  const filtered = filter==='all' ? data : data.filter(d=>d.stage===filter||d.opportunity===filter)
  const oppColor = (o:string) => o==='high'?'#00C48C':o==='medium'?'#FFB830':'#94A3B8'

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#F1F5F9'}}>
      <Sidebar/>
      <main style={{flex:1,padding:'28px 32px',overflow:'auto'}}>
        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:24,fontWeight:700,color:'#0F172A',letterSpacing:'-0.4px'}}>💥 Exploding Topics</h1>
          <p style={{fontSize:14,color:'#64748B',marginTop:3}}>Keyword velocity tracker — find trends before they peak</p>
        </div>

        <div style={{display:'flex',gap:10,marginBottom:20,alignItems:'center',flexWrap:'wrap'}}>
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            {['electronics','home-kitchen','cleaning-products','smart-home','automotive','gadgets','health-wellness'].map(c=>(
              <option key={c} value={c}>{c.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>
            ))}
          </select>
          <div style={{display:'flex',background:'#E2E8F0',borderRadius:10,padding:3}}>
            {[['all','All'],['pre-peak','🌱 Pre-peak'],['early','📡 Early'],['growing','📈 Growing'],['high','⭐ High Opp']].map(([val,label])=>(
              <button key={val} onClick={()=>setFilter(val)} style={{padding:'5px 12px',borderRadius:8,border:'none',cursor:'pointer',fontSize:12,fontWeight:filter===val?700:400,background:filter===val?'white':'transparent',color:filter===val?'#0F172A':'#94A3B8',boxShadow:filter===val?'0 1px 4px rgba(0,0,0,0.1)':'none'}}>
                {val==='all'?`All (${data.length})`:label}
              </button>
            ))}
          </div>
          {loading && <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#94A3B8'}}><div style={{width:13,height:13,borderRadius:'50%',border:'2px solid #E2E8F0',borderTopColor:'#FF4D6A',animation:'spin 0.8s linear infinite'}}/>Analyzing velocity...</div>}
        </div>

        {error && (
          <div style={{ padding:'12px 18px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, color:'#DC2626' }}>{error}</span>
            <button onClick={()=>setRetryCount(c=>c+1)} style={{ padding:'5px 14px', borderRadius:8, background:'#DC2626', color:'white', fontSize:12, fontWeight:600, border:'none', cursor:'pointer' }}>Retry</button>
          </div>
        )}

        <div className="card" style={{overflow:'hidden',marginBottom:16}}>
          <table>
            <thead><tr><th>Keyword</th><th>Stage</th><th>Velocity</th><th>6-Month Trend</th><th>Volume Growth</th><th>Peak Est.</th><th>Markets</th><th>Opportunity</th><th>Competition</th></tr></thead>
            <tbody>
              {loading ? [...Array(12)].map((_,i)=>(
                <tr key={i}>{[...Array(9)].map((_,j)=><td key={j}><div className="skeleton" style={{height:16}}/></td>)}</tr>
              )) : filtered.map((k:any,i:number)=>{
                const sc = STAGE_CONFIG[k.stage]||STAGE_CONFIG['growing']
                return (
                  <tr key={i}>
                    <td>
                      <div style={{fontWeight:600,color:'#0F172A',marginBottom:2}}>{k.keyword}</div>
                      <div style={{fontSize:11,color:'#94A3B8'}}>{k.category}</div>
                    </td>
                    <td><span style={{fontSize:11,padding:'3px 10px',borderRadius:20,fontWeight:700,background:sc.bg,color:sc.color}}>{sc.icon} {k.stage}</span></td>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:60,height:6,background:'#E2E8F0',borderRadius:3}}><div style={{width:`${k.velocityScore}%`,height:'100%',background:sc.color,borderRadius:3}}/></div>
                        <span style={{fontSize:13,fontWeight:700,color:sc.color,fontFamily:'DM Mono'}}>{k.velocityScore}</span>
                      </div>
                    </td>
                    <td><Sparkline data={k.monthlyData||[20,22,25,30,40,55,70,75,80,85,90,95]} color={sc.color}/></td>
                    <td style={{color:'#00C48C',fontWeight:700,fontFamily:'DM Mono',fontSize:13}}>{k.volumeGrowth}</td>
                    <td style={{fontSize:13,color:'#64748B'}}>{k.peakEstimate}</td>
                    <td>
                      <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
                        {(k.markets||[]).slice(0,3).map((mkt:string,j:number)=>(
                          <span key={j} style={{fontSize:10,padding:'2px 6px',background:'#F1F5F9',color:'#64748B',borderRadius:12}}>{mkt}</span>
                        ))}
                      </div>
                    </td>
                    <td><span style={{fontSize:13,fontWeight:700,color:oppColor(k.opportunity),textTransform:'capitalize'}}>{k.opportunity}</span></td>
                    <td><span style={{fontSize:13,fontWeight:600,color:k.competitionNow==='low'?'#00C48C':k.competitionNow==='medium'?'#FFB830':'#FF4D6A',textTransform:'capitalize'}}>{k.competitionNow}</span></td>
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
