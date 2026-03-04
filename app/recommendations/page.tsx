'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import MarketSelector from '@/components/MarketSelector'
import { MARKETS, MarketCode, MARKET_CODES } from '@/lib/markets'

const MARKET_COLORS: Record<string, string> = {
  US: '#0EA5E9', PH: '#FF4D6A', UK: '#8B5CF6', DE: '#FFB830',
  NL: '#00C48C', FR: '#E30613', SE: '#FF8C42', NO: '#E879F9',
  AU: '#0EA5E9', BE: '#6366F1',
}

const riskColor = (r: string) => ({ Low: '#12B76A', Medium: '#F79009', High: '#F04438' }[r] || '#94A3B8')
const riskBg   = (r: string) => ({ Low: '#ECFDF3', Medium: '#FFFAEB', High: '#FEF3F2' }[r] || '#E2E8F0')
const demandColor = (d: string) => ({ 'Very High': '#12B76A', High: '#0EA5E9', Medium: '#F79009', Low: '#94A3B8' }[d] || '#94A3B8')
const compColor   = (c: string) => ({ Low: '#12B76A', Medium: '#F79009', High: '#F04438' }[c] || '#94A3B8')

type FilterType = 'ALL' | MarketCode

export default function RecommendationsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [fetchedMarket, setFetchedMarket] = useState<FilterType>('ALL')
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (market: FilterType) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/recommendations?market=${market}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'API error')
      setData(json.data || [])
      setFetchedMarket(market)
    } catch (e: any) {
      setError(e.message)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData('ALL') }, [])

  const handleMarketChange = (m: MarketCode) => {
    setFilter(m)
    fetchData(m)
  }

  const handleAll = () => {
    setFilter('ALL')
    if (fetchedMarket !== 'ALL') fetchData('ALL')
  }

  const filtered = filter === 'ALL' ? data : data.filter(r => r.targetMarket === filter)

  const marketColor = (code: string) => MARKET_COLORS[code] || '#94A3B8'
  const marketFlag  = (code: string) => MARKETS[code as MarketCode]?.flag || '🌍'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F5F9' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto' }}>

        <div className="page-header">
          <h1>✦ AI Product Picks</h1>
          <p>AI-scored opportunities ranked by demand, competition, and profit potential</p>
        </div>

        {/* Filters row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {/* All button */}
          <button
            onClick={handleAll}
            style={{
              padding: '7px 16px', borderRadius: 8,
              border: `1px solid ${filter === 'ALL' ? '#0EA5E9' : '#E2E8F0'}`,
              background: filter === 'ALL' ? '#EFF8FF' : 'white',
              color: filter === 'ALL' ? '#175CD3' : '#64748B',
              fontSize: 13, fontWeight: filter === 'ALL' ? 600 : 400,
              cursor: 'pointer', fontFamily: 'Geist, sans-serif',
              transition: 'all 0.12s',
            }}
          >
            All ({data.length})
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: '#E2E8F0' }} />

          {/* Market buttons */}
          {MARKET_CODES.map(code => {
            const count = data.filter(r => r.targetMarket === code).length
            const active = filter === code
            const color = marketColor(code)
            return (
              <button
                key={code}
                onClick={() => { setFilter(code); if (fetchedMarket !== code && fetchedMarket !== 'ALL') fetchData(code) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 12px', borderRadius: 8,
                  border: `1px solid ${active ? color : '#E2E8F0'}`,
                  background: active ? `${color}12` : 'white',
                  color: active ? color : '#64748B',
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  cursor: 'pointer', fontFamily: 'Geist, sans-serif',
                  transition: 'all 0.12s',
                }}
              >
                <span>{marketFlag(code)}</span>
                <span>{code}</span>
                {count > 0 && (
                  <span style={{ fontSize: 11, background: active ? `${color}20` : '#E2E8F0', color: active ? color : '#94A3B8', padding: '1px 6px', borderRadius: 99, fontWeight: 600 }}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}

          {/* Reload button */}
          <button
            onClick={() => fetchData(filter)}
            style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', color: '#64748B', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'Geist, sans-serif' }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M14 8A6 6 0 112 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M14 4v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Refresh
          </button>
        </div>

        {error && (
          <div style={{ padding: '14px 18px', background: '#FEF3F2', border: '1px solid #FDA29B', borderRadius: 10, color: '#B42318', fontSize: 13, marginBottom: 16 }}>
            ⚠️ Error: {error}
          </div>
        )}
        <div className="card" style={{ overflow: 'hidden' }}>
          <table>
            <thead>
              <tr><th>Score</th><th>Product Idea</th><th>Market</th><th>Category</th><th>Demand</th><th>Competition</th><th>Risk</th><th>Est. Profit</th></tr>
            </thead>
            <tbody>
              {loading ? [...Array(10)].map((_, i) => (
                <tr key={i}>{[...Array(8)].map((_, j) => <td key={j}><div className="skeleton" style={{ height: 14 }} /></td>)}</tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#94A3B8', padding: '32px' }}>No picks for this market yet — click Refresh</td></tr>
              ) : filtered.map((r: any, i: number) => (
                <tr key={i}>
                  <td>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: r.score >= 80 ? 'linear-gradient(135deg,#12B76A,#38EF7D)' : r.score >= 60 ? 'linear-gradient(135deg,#0EA5E9,#818CF8)' : 'linear-gradient(135deg,#F79009,#FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'Geist Mono, monospace' }}>
                      {r.score}
                    </div>
                  </td>
                  <td style={{ maxWidth: 220 }}>
                    <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: 3, fontSize: 13.5 }}>{r.productIdea}</div>
                    <div style={{ fontSize: 11.5, color: '#94A3B8', lineHeight: 1.4 }}>{r.reason?.slice(0, 70)}...</div>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, padding: '3px 9px', borderRadius: 99, fontWeight: 600, background: `${marketColor(r.targetMarket)}15`, color: marketColor(r.targetMarket), display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {marketFlag(r.targetMarket)} {r.targetMarket}
                    </span>
                  </td>
                  <td style={{ color: '#64748B', fontSize: 12.5 }}>{r.category}</td>
                  <td><span style={{ fontSize: 12.5, fontWeight: 600, color: demandColor(r.estimatedDemand) }}>{r.estimatedDemand}</span></td>
                  <td><span style={{ fontSize: 12.5, fontWeight: 600, color: compColor(r.competition) }}>{r.competition}</span></td>
                  <td><span style={{ fontSize: 11.5, padding: '3px 9px', borderRadius: 99, background: riskBg(r.riskLevel), color: riskColor(r.riskLevel), fontWeight: 600 }}>{r.riskLevel}</span></td>
                  <td style={{ color: '#12B76A', fontWeight: 700, fontFamily: 'Geist Mono, monospace', fontSize: 12.5, whiteSpace: 'nowrap' }}>{r.estimatedProfit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
