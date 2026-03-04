'use client'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9' }}>
      <div style={{ background: 'white', borderRadius: 16, padding: '48px 40px', maxWidth: 440, width: '100%', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <span style={{ fontSize: 28 }}>!</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Something went wrong</h2>
        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 24, lineHeight: 1.5 }}>
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={reset}
          style={{ padding: '10px 28px', borderRadius: 10, background: '#0EA5E9', color: 'white', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
