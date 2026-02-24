export default function LoadingCard({ rows = 3, height = 160 }: { rows?: number; height?: number }) {
  return (
    <div className="card" style={{ padding: '20px 22px', height }}>
      <div className="skeleton" style={{ height: 12, width: '35%', marginBottom: 16 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 11, width: `${80 - i * 10}%`, marginBottom: 10, opacity: 1 - i * 0.15 }} />
      ))}
    </div>
  )
}
