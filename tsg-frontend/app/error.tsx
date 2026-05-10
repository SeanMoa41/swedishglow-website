'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Er is iets misgegaan</h2>
      <button onClick={reset}>Probeer opnieuw</button>
    </div>
  )
}
