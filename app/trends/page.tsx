'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import PlatformFilter, { PlatformKey } from '@/components/PlatformFilter'

const SIGNALS = [
  { kw:'dashcam 4K',                us:88, ph:72, vol:'49K/mo',  change:'+12%', cat:'Auto'       },
  { kw:'robot vacuum cleaner',      us:92, ph:85, vol:'110K/mo', change:'+24%', cat:'Home'       },
  { kw:'wifi extender mesh',        us:76, ph:90, vol:'74K/mo',  change:'+18%', cat:'WiFi'       },
  { kw:'window cleaning robot',     us:61, ph:55, vol:'22K/mo',  change:'+31%', cat:'Home'       },
  { kw:'portable charger 20000mah', us:84, ph:78, vol:'55K/mo',  change:'+9%',  cat:'Electronics'},
  { kw:'smart plug wifi',           us:79, ph:68, vol:'38K/mo',  change:'+15%', cat:'Smart Home' },
  { kw:'cordless vacuum',           us:87, ph:62, vol:'92K/mo',  change:'+20%', cat:'Home'       },
  { kw:'security camera outdoor',   us:90, ph:77, vol:'88K/mo',  change:'+16%', cat:'Security'   },
  { kw:'car air purifier',          us:58, ph:81, vol:'30K/mo',  change:'+28%', cat:'Auto'       },
  { kw:'led strip lights smart',    us:82, ph:75, vol:'67K/mo',  change:'+22%', cat:'Smart Home' },
  { kw:'wireless earbuds noise cancel', us:95, ph:88, vol:'140K/mo', change:'+8%', cat:'Audio'  },
  { kw:'electric spin scrubber',    us:71, ph:65, vol:'45K/mo',  change:'+35%', cat:'Cleaning'   },
]

export default function TrendsPage() {
  const [sort, setSort] = useState<'us'|'ph'|'change'>('us')
  const [platform, setPlatform] = useState<PlatformKey>('all')
  const sorted = [...SIGNALS].sort((a,b)=>sort==='us'?b.us-a.us:sort==='ph'?b.ph-a.ph:parseFloat(b.change)-parseFloat(a.change))

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#F2F3F7' }}>
      <Sidebar />
      <main style={{ flex:1, padding:'28px 32px', overflow:'auto' }}>
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#1A1D2E', letterSpacing:'-0.4px' }}>📡 Market Trends</h1>
          <p style={{ fontSize:13, color:'#6B7280', marginTop:3 }}>Keyword momentum — US vs Philippines ranked by search interest</p>
        </div>

        <div style={{ marginBottom:16 }}>
          <PlatformFilter value={platform} onChange={setPlatform} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          {[
            {label:'Rising Fast',  value:SIGNALS.filter(s=>parseInt(s.change)>20).length, color:'#00C48C', sub:'>20% growth'},
            {label:'US Dominant',  value:SIGNALS.filter(s=>s.us>s.ph+10).length,          color:'#2E6FFF', sub:'US score >PH+10'},
            {label:'PH Dominant',  value:SIGNALS.filter(s=>s.ph>s.us).length,             color:'#FF4D6A', sub:'PH beating US'},
            {label:'Both Markets', value:SIGNALS.filter(s=>s.us>70&&s.ph>70).length,      color:'#FFB830', sub:'Both score >70'},
          ].map((c,i)=>(
            <div key={i} className="card" style={{ padding:'18px 20px' }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${c.color}15`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                <div style={{ width:14, height:14, borderRadius:'50%', background:c.color }}/>
              </div>
              <div style={{ fontSize:26, fontWeight:800, color:'#1A1D2E', fontFamily:'DM Mono' }}>{c.value}</div>
              <div style={{ fontSize:12, fontWeight:600, color:c.color, marginTop:2 }}>{c.label}</div>
              <div style={{ fontSize:11, color:'#9CA3AF', marginTop:2 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:6, marginBottom:14, alignItems:'center' }}>
          <span style={{ fontSize:12, color:'#9CA3AF', marginRight:4 }}>Sort by:</span>
          {([['us','🇺🇸 US Score'],['ph','🇵🇭 PH Score'],['change','📈 Growth']] as const).map(([val,label])=>(
            <button key={val} onClick={()=>setSort(val)} style={{ padding:'6px 14px', borderRadius:20, border:`1.5px solid ${sort===val?'#2E6FFF':'#E8E9EF'}`, background:sort===val?'rgba(46,111,255,0.08)':'white', color:sort===val?'#2E6FFF':'#6B7280', fontSize:12, fontWeight:sort===val?700:400, cursor:'pointer' }}>{label}</button>
          ))}
        </div>

        <div className="card" style={{ overflow:'hidden' }}>
          <table>
            <thead><tr><th>Keyword</th><th>Category</th><th>Volume</th><th>🇺🇸 US</th><th>🇵🇭 PH</th><th>Growth</th><th>Best For</th></tr></thead>
            <tbody>
              {sorted.map((k,i)=>{
                const opp = k.us>75&&k.ph>75?'Both':k.us>k.ph?'US Focus':'PH Focus'
                const oppColor = opp==='Both'?'#00C48C':opp==='US Focus'?'#2E6FFF':'#FF4D6A'
                const oppBg    = opp==='Both'?'rgba(0,196,140,0.1)':opp==='US Focus'?'rgba(46,111,255,0.1)':'rgba(255,77,106,0.1)'
                return (
                  <tr key={i}>
                    <td style={{ fontWeight:500, color:'#1A1D2E' }}>{k.kw}</td>
                    <td><span style={{ fontSize:11, padding:'2px 9px', background:'#F3F4F6', color:'#6B7280', borderRadius:20 }}>{k.cat}</span></td>
                    <td style={{ fontFamily:'DM Mono', fontSize:12, color:'#9CA3AF' }}>{k.vol}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:80, height:5, background:'#F0F1F5', borderRadius:3 }}><div style={{ width:`${k.us}%`, height:'100%', background:'#2E6FFF', borderRadius:3 }}/></div>
                        <span style={{ fontSize:12, fontWeight:700, color:'#2E6FFF', fontFamily:'DM Mono' }}>{k.us}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:80, height:5, background:'#F0F1F5', borderRadius:3 }}><div style={{ width:`${k.ph}%`, height:'100%', background:'#FF4D6A', borderRadius:3 }}/></div>
                        <span style={{ fontSize:12, fontWeight:700, color:'#FF4D6A', fontFamily:'DM Mono' }}>{k.ph}</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize:13, fontWeight:700, color:'#00C48C', fontFamily:'DM Mono' }}>{k.change}</span></td>
                    <td><span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:700, background:oppBg, color:oppColor }}>{opp}</span></td>
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
