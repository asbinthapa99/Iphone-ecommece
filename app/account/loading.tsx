export default function Loading() {
  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <div className="rounded-[20px] p-5 mb-4 text-center" style={{ border: '1px solid #ebebeb' }}>
        <div className="shimmer rounded-full mx-auto mb-3" style={{ width: 64, height: 64 }} />
        <div className="shimmer rounded mx-auto mb-2" style={{ height: 20, width: 140 }} />
        <div className="shimmer rounded mx-auto" style={{ height: 14, width: 180 }} />
      </div>
      <div className="rounded-[16px] overflow-hidden mb-4" style={{ border: '1px solid #ebebeb' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < 3 ? '1px solid #f0f0ee' : 'none' }}>
            <div className="shimmer rounded-full shrink-0" style={{ width: 14, height: 14 }} />
            <div>
              <div className="shimmer rounded mb-1" style={{ height: 10, width: 60 }} />
              <div className="shimmer rounded" style={{ height: 13, width: 120 }} />
            </div>
          </div>
        ))}
      </div>
      <div className="shimmer rounded-[16px]" style={{ height: 44 }} />
    </main>
  )
}
