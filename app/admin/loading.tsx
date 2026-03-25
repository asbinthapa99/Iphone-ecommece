export default function Loading() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[1,2,3,4].map((i) => (
          <div key={i} className="shimmer rounded-[16px]" style={{ height: 90 }} />
        ))}
      </div>
      <div className="shimmer rounded-[16px]" style={{ height: 300 }} />
    </div>
  )
}
