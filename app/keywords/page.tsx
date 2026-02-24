'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import MarketSelector from '@/components/MarketSelector'
import PlatformFilter, { PlatformKey, PLATFORMS } from '@/components/PlatformFilter'
import { MARKETS, MarketCode } from '@/lib/markets'

const categories = ['electronics','home-kitchen','automotive','cleaning-products','smart-home','gadgets']
const SCORE_KEYS: Record<MarketCode,string> = { US:'usScore',PH:'phScore',UK:'ukScore',DE:'deScore',NL:'nlScore',SE:'seScore',NO:'noScore',AU:'auScore',FR:'frScore',BE:'beScore' }

export default function KeywordsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('electronics')
  const [market, setMarket] = useState<MarketCode>('US')
  const [platform, setPlatform] = useState<PlatformKey>('all')
  const m = MARKETS[market]
  const scoreKey = SCORE_KEYS[market]

  useEffect(() => {
    setLoading(true); setPlatform('all')
    fetch(`/api/keywords?category=${category}&market=${market}`)
      .then(r=>r.json()).then(j=>{setData(j.data||[]); setLoading(false)})
  }, [category, market])

  const compColor = (c:string) => ({Low:'#00C48C',Medium:'#FFB830',High:'#FF4D6A'}[c]||'#9CA3AF')
  const compBg   = (c:string) => ({Low:'rgba(0,196,140,0.1)',Medium:'rgba(255,184,48,0.1)',High:'rgba(255,77,106,0.1)'}[c]||'#F3F4F6')

  // Platform affects CPC currency label and badge shown
  const platformLabel = platform === 'all' ? m.platform : PLATFORMS[platform]?.label

  const sorted = [...data].sort((a,b)=>(b[scoreKey]||b.marketScore||0)-(a[scoreKey]||a.marketScore||0))

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#F2F3F7' }}>
      <Sidebar />
      <main style={{ flex:1, padding:'28px 32px', overflow:'auto' }}>
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontSize:24, fontWeight:700, color:'#1A1D2E', letterSpacing:'-0.4px' }}>Keyword Research</h1>
          <p style={{ fontSize:14, color:'#6B7280', marginTop:3 }}>Search volume · CPC · Market scores across all regions</p>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:600, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:9 }}>Market</div>
          <MarketSelector value={market} onChange={setMarket} />
        </div>

        <div style={{ marginBottom:18 }}>
          <PlatformFilter value={platform} onChange={setPlatform} market={market} />
        </div>

        <div style={{ display:'flex', gap:10, marginBottom:20, alignItems:'center' }}>
          <div style={{ padding:'9px 16px', background:`${m.color}0D`, border:`1.5px solid ${m.color}25`, borderRadius:10, fontSize:13, color:m.color, fontWeight:600 }}>
            {m.flag} {m.label} · {platformLabel}
          </div>
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
          </select>
          {loading && <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#9CA3AF' }}><div style={{ width:13, height:13, borderRadius:'50%', border:'2px solid #E8E9EF', borderTopColor:m.color, animation:'spin 0.8s linear infinite' }}/>Loading...</div>}
        </div>

        <div className="card" style={{ overflow:'hidden' }}>
          <table>
            <thead>
              <tr><th>Keyword</th><th>Volume</th><th>Competition</th><th>CPC</th><th style={{color:m.color}}>{m.flag} Score</th><th>🇺🇸</th><th>🇵🇭</th><th>🇬🇧</th><th>Related</th></tr>
            </thead>
            <tbody>
              {loading ? [...Array(15)].map((_,i)=>(
                <tr key={i}>{[...Array(9)].map((_,j)=><td key={j}><div className="skeleton" style={{height:16}}/></td>)}</tr>
              )) : sorted.map((k:any,i:number)=>{
                const score = k[scoreKey]||k.marketScore||0
                return (
                  <tr key={i}>
                    <td style={{ fontWeight:500, color:'#1A1D2E' }}>{k.keyword}</td>
                    <td style={{ fontFamily:'DM Mono', fontSize:13, color:'#6B7280' }}>{k.searchVolume}</td>
                    <td><span style={{ fontSize:12, padding:'3px 10px', borderRadius:20, fontWeight:600, background:compBg(k.competition), color:compColor(k.competition) }}>{k.competition}</span></td>
                    <td style={{ fontFamily:'DM Mono', color:'#00C48C', fontWeight:600, fontSize:13 }}>{k.cpc}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:80, height:6, background:'#F0F1F5', borderRadius:3 }}><div style={{ width:`${score}%`, height:'100%', background:m.color, borderRadius:3 }}/></div>
                        <span style={{ fontSize:13, color:m.color, fontWeight:700, fontFamily:'DM Mono', width:24 }}>{score}</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize:13, color:'#2E6FFF', fontFamily:'DM Mono', fontWeight:700 }}>{k.usScore||'—'}</span></td>
                    <td><span style={{ fontSize:13, color:'#FF4D6A', fontFamily:'DM Mono', fontWeight:700 }}>{k.phScore||'—'}</span></td>
                    <td><span style={{ fontSize:13, color:'#8B5CF6', fontFamily:'DM Mono', fontWeight:700 }}>{k.ukScore||'—'}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:4 }}>
                        {(k.relatedTerms||[]).slice(0,2).map((t:string,j:number)=>(
                          <span key={j} style={{ fontSize:11, padding:'2px 9px', background:'#F3F4F6', color:'#6B7280', borderRadius:20 }}>{t}</span>
                        ))}
                      </div>
                    </td>
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
