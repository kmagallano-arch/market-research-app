'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import MarketSelector from '@/components/MarketSelector'
import { MARKETS, MarketCode } from '@/lib/markets'

const POPULAR = ['robot vacuum','dashcam 4K','wifi mesh router','window cleaning robot','cordless vacuum','wireless earbuds','smart plug','portable charger','air purifier','security camera','face serum','electric toothbrush','yoga mat','protein shaker','baby monitor','pet camera','LED desk lamp','resistance bands']

const INTENT_COLOR: Record<string, { bg: string; color: string }> = {
  informational:  { bg: 'rgba(99,102,241,0.1)',  color: '#6366F1' },
  commercial:     { bg: 'rgba(255,184,48,0.1)',  color: '#D97706' },
  transactional:  { bg: 'rgba(0,196,140,0.1)',   color: '#059669' },
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length === 0) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 120, h = 36, pad = 2
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / range) * (h - pad * 2)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  )
}

function DifficultyBar({ value, label }: { value: number; label?: string }) {
  const color = value < 35 ? '#00C48C' : value < 65 ? '#FFB830' : '#FF4D6A'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 80, height: 6, background: '#F0F1F5', borderRadius: 3, flexShrink: 0 }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, fontFamily: 'DM Mono', fontWeight: 700, color }}>{value}</span>
      {label && <span style={{ fontSize: 11, color: '#9CA3AF' }}>{label}</span>}
    </div>
  )
}

type State = 'idle' | 'loading' | 'done' | 'error'

export default function KeywordSearchPage() {
  const [data, setData] = useState<any>(null)
  const [state, setState] = useState<State>('idle')
  const [market, setMarket] = useState<MarketCode>('US')
  const [input, setInput] = useState('robot vacuum')
  const [searched, setSearched] = useState('')
  const [sortBy, setSortBy] = useState<'volume' | 'difficulty' | 'cpc'>('volume')
  const m = MARKETS[market]

  const search = async (kw?: string) => {
    const query = kw || input
    setSearched(query)
    setData(null)
    setState('loading')
    try {
      const res = await fetch(`/api/keyword-search?keyword=${encodeURIComponent(query)}&market=${market}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setData(json)
      setState('done')
    } catch {
      setState('error')
    }
  }

  const sortedRelated = [...(data?.related || [])].sort((a, b) => {
    if (sortBy === 'volume') return (b.searchVolumeRaw || 0) - (a.searchVolumeRaw || 0)
    if (sortBy === 'difficulty') return (a.competitionIndex || 0) - (b.competitionIndex || 0)
    if (sortBy === 'cpc') {
      const av = parseFloat((a.cpc || '0').replace(/[^0-9.]/g, ''))
      const bv = parseFloat((b.cpc || '0').replace(/[^0-9.]/g, ''))
      return bv - av
    }
    return 0
  })

  const compColor = (idx: number) => idx > 66 ? '#FF4D6A' : idx > 33 ? '#FFB830' : '#00C48C'
  const compLabel = (idx: number) => idx > 66 ? 'High' : idx > 33 ? 'Medium' : 'Low'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F2F3F7' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1D2E', letterSpacing: '-0.4px' }}>🔍 Keyword Search</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 3 }}>Live search volume, competition, CPC and related keywords</p>
        </div>

        {/* Market */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 9 }}>Market</div>
          <MarketSelector value={market} onChange={setMarket} />
        </div>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="Enter a keyword to research..."
            style={{ flex: 1, maxWidth: 440, padding: '10px 16px', borderRadius: 10, border: '1.5px solid #E8E9EF', fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
          />
          <button
            onClick={() => search()}
            disabled={state === 'loading'}
            style={{ padding: '10px 24px', background: state === 'loading' ? '#9CA3AF' : m.color, color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: state === 'loading' ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
          >
            {state === 'loading' ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Popular suggestions */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {POPULAR.map(p => (
            <button key={p} onClick={() => { setInput(p); search(p) }}
              style={{ padding: '5px 13px', borderRadius: 20, border: `1.5px solid ${searched === p ? m.color : '#E8E9EF'}`, background: searched === p ? `${m.color}12` : 'white', color: searched === p ? m.color : '#6B7280', fontSize: 12, cursor: 'pointer', fontWeight: searched === p ? 700 : 400 }}>
              {p}
            </button>
          ))}
        </div>

        {/* Loading */}
        {state === 'loading' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '24px 20px', color: '#9CA3AF', fontSize: 14 }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #E8E9EF', borderTopColor: m.color, animation: 'spin 0.8s linear infinite' }} />
            Searching for <b style={{ color: '#1A1D2E', marginLeft: 4 }}>{searched}</b>...
          </div>
        )}

        {/* Results */}
        {state === 'done' && data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Data source badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: data.hasLiveData ? 'rgba(0,196,140,0.1)' : 'rgba(99,102,241,0.1)', color: data.hasLiveData ? '#059669' : '#6366F1' }}>
                {data.hasLiveData ? '✓ Live data from DataForSEO' : '✦ AI-generated estimates'}
              </span>
              {data.main.seasonality && <span style={{ fontSize: 12, color: '#9CA3AF' }}>📅 {data.main.seasonality}</span>}
            </div>

            {/* Main keyword stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              {[
                { label: 'Search Volume',  value: data.main.searchVolume,                              color: m.color },
                { label: 'Competition',    value: compLabel(data.main.competitionIndex),               color: compColor(data.main.competitionIndex) },
                { label: 'CPC',            value: data.main.cpc,                                       color: '#FFB830' },
                { label: 'SEO Difficulty', value: data.main.difficulty,                                color: data.main.difficulty < 35 ? '#00C48C' : data.main.difficulty < 65 ? '#FFB830' : '#FF4D6A' },
                { label: 'Best Markets',   value: (data.bestMarkets || []).slice(0, 2).join(', ') || '—', color: '#8B5CF6' },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: '16px 18px' }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: i === 3 ? 28 : 22, fontWeight: 800, color: s.color, fontFamily: 'DM Mono' }}>{s.value}</div>
                  {i === 3 && <DifficultyBar value={data.main.difficulty} />}
                </div>
              ))}
            </div>

            {/* Trend chart + insights */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="card" style={{ padding: '20px 22px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E', marginBottom: 16 }}>📈 12-Month Search Trend</div>
                {data.trendData && data.trendData.length > 0 ? (
                  <div>
                    {/* Bar chart */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80, marginBottom: 8 }}>
                      {data.trendData.map((v: number, i: number) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                          <div style={{ width: '100%', background: i === data.trendData.length - 1 ? m.color : `${m.color}60`, borderRadius: '3px 3px 0 0', height: `${Math.max(4, v)}%`, transition: 'height 0.3s' }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {(data.trendLabels || []).filter((_: string, i: number) => i % 3 === 0).map((l: string) => (
                        <span key={l} style={{ fontSize: 10, color: '#9CA3AF' }}>{l}</span>
                      ))}
                    </div>
                  </div>
                ) : <div style={{ color: '#9CA3AF', fontSize: 13 }}>No trend data available</div>}
                {data.main.opportunity && (
                  <div style={{ marginTop: 14, padding: '10px 14px', background: `${m.color}0D`, borderRadius: 8, fontSize: 13, color: '#6B7280', lineHeight: 1.5, borderLeft: `3px solid ${m.color}` }}>
                    💡 {data.main.opportunity}
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: '20px 22px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E', marginBottom: 14 }}>📌 Insights</div>
                {(data.insights || []).map((ins: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #F0F1F5', alignItems: 'flex-start' }}>
                    <span style={{ color: m.color, flexShrink: 0, fontWeight: 700, fontSize: 16 }}>›</span>
                    <span style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{ins}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related keywords table */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F1F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E' }}>Related Keywords <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 400 }}>({sortedRelated.length})</span></div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['volume', 'difficulty', 'cpc'] as const).map(s => (
                    <button key={s} onClick={() => setSortBy(s)}
                      style={{ padding: '4px 12px', borderRadius: 20, border: `1.5px solid ${sortBy === s ? m.color : '#E8E9EF'}`, background: sortBy === s ? `${m.color}12` : 'white', color: sortBy === s ? m.color : '#9CA3AF', fontSize: 12, cursor: 'pointer', fontWeight: sortBy === s ? 700 : 400, textTransform: 'capitalize' }}>
                      {s === 'volume' ? '↓ Volume' : s === 'difficulty' ? '↑ Easiest' : '↓ CPC'}
                    </button>
                  ))}
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Keyword</th>
                    <th>Volume</th>
                    <th>Competition</th>
                    <th>CPC</th>
                    <th>Difficulty</th>
                    <th>Intent</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRelated.map((k: any, i: number) => {
                    const ic = INTENT_COLOR[k.intent] || INTENT_COLOR.commercial
                    const ci = k.competitionIndex || 50
                    return (
                      <tr key={i}>
                        <td style={{ fontWeight: 500, color: '#1A1D2E', maxWidth: 220 }}>{k.keyword}</td>
                        <td style={{ fontFamily: 'DM Mono', fontSize: 13, color: '#1A1D2E', fontWeight: 600 }}>{k.searchVolume || '—'}</td>
                        <td>
                          <span style={{ fontSize: 12, padding: '2px 9px', borderRadius: 20, fontWeight: 600, background: ci > 66 ? 'rgba(255,77,106,0.1)' : ci > 33 ? 'rgba(255,184,48,0.1)' : 'rgba(0,196,140,0.1)', color: compColor(ci) }}>
                            {compLabel(ci)}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'DM Mono', fontSize: 13, color: '#FFB830', fontWeight: 600 }}>{k.cpc || '—'}</td>
                        <td><DifficultyBar value={k.difficulty || ci} /></td>
                        <td>
                          {k.intent && (
                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600, background: ic.bg, color: ic.color }}>
                              {k.intent}
                            </span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, fontWeight: 700, background: k.source === 'live' ? 'rgba(0,196,140,0.08)' : 'rgba(99,102,241,0.08)', color: k.source === 'live' ? '#059669' : '#6366F1' }}>
                            {k.source === 'live' ? 'LIVE' : 'AI'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {state === 'error' && (
          <div style={{ padding: '20px', background: 'rgba(255,77,106,0.08)', borderRadius: 12, color: '#FF4D6A', fontSize: 14 }}>
            Search failed. Please try again.
          </div>
        )}
      </main>
    </div>
  )
}
