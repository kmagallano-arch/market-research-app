interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: string
  icon?: React.ReactNode
  trend?: string
  trendUp?: boolean
  delta?: string
}

export default function StatCard({ label, value, sub, accent = '#2E6FFF', icon, trend, trendUp, delta }: StatCardProps) {
  return (
    <div className="card" style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#8A9DC0', fontWeight: 500, marginBottom: 10, letterSpacing: '0.3px', textTransform: 'uppercase' }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#E8EDF5', letterSpacing: '-0.5px', lineHeight: 1, fontFamily: 'DM Mono, monospace' }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: '#4A5E80', marginTop: 6 }}>{sub}</div>}
          {trend && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, padding: '3px 8px', background: trendUp !== false ? 'rgba(0,196,140,0.12)' : 'rgba(255,77,106,0.12)', borderRadius: 20, fontSize: 11, color: trendUp !== false ? '#00C48C' : '#FF4D6A', fontWeight: 600 }}>
              {trendUp !== false ? '↑' : '↓'} {trend}
            </div>
          )}
          {delta && (
            <div style={{ fontSize: 12, color: '#8A9DC0', marginTop: 6 }}>{delta}</div>
          )}
        </div>
        {icon && (
          <div style={{ width: 38, height: 38, borderRadius: 9, background: `${accent}18`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
