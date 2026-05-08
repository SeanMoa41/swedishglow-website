export default function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct))
  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${clamped}%` }} />
    </div>
  )
}
