export default function Loading() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid #ebebeb' }}>
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="shimmer rounded-lg mb-4" style={{ height: 24, width: 120 }} />
          <div className="shimmer rounded-lg mb-3" style={{ height: 32, width: 200 }} />
          <div className="shimmer rounded-full" style={{ height: 32, width: '100%', maxWidth: 500 }} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ padding: 16, borderRight: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb' }}>
              <div className="shimmer rounded-lg mb-3" style={{ height: 160, width: '100%' }} />
              <div className="shimmer rounded mb-2" style={{ height: 14, width: '70%' }} />
              <div className="shimmer rounded mb-3" style={{ height: 12, width: '50%' }} />
              <div className="shimmer rounded" style={{ height: 22, width: '60%' }} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
