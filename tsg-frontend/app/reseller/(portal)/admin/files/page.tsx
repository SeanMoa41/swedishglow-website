'use client'
import { useEffect, useRef, useState } from 'react'
import { apiFetch, apiJson } from '@/lib/api'
import type { MarketingFile } from '@/lib/types'

const MIN_TIERS = ['all', 'rose', 'pro', 'elite', 'black'] as const

export default function AdminFilesPage() {
  const [files, setFiles] = useState<MarketingFile[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    apiJson<MarketingFile[]>('/files').then(setFiles)
  }, [])

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setUploading(true)
    const body = new FormData()
    body.append('file', file)
    const minTier = (e.currentTarget.elements.namedItem('min_tier') as HTMLSelectElement).value
    body.append('min_tier', minTier)
    // No Content-Type header — let browser set multipart boundary
    await apiFetch('/files', { method: 'POST', body, headers: {} })
    const updated = await apiJson<MarketingFile[]>('/files')
    setFiles(updated)
    setUploading(false)
    e.currentTarget.reset()
  }

  async function deleteFile(id: string) {
    await apiFetch(`/files/${id}`, { method: 'DELETE' })
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const fmtBytes = (n: number | null) =>
    n ? `${(n / 1024 / 1024).toFixed(1)} MB` : '—'

  return (
    <div className="panel" id="panel-admin-files">
      <h1>Bestanden beheren</h1>
      <form onSubmit={upload} className="upload-form">
        <h2>Bestand uploaden</h2>
        <input type="file" ref={fileRef} required />
        <select name="min_tier">
          {MIN_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploaden...' : 'Uploaden'}
        </button>
      </form>
      <h2>Bestaande bestanden</h2>
      {files.length === 0 && <p>Geen bestanden</p>}
      <table className="data-table">
        <thead>
          <tr><th>Naam</th><th>Grootte</th><th>Min. tier</th><th>Downloads</th><th></th></tr>
        </thead>
        <tbody>
          {files.map(f => (
            <tr key={f.id}>
              <td>{f.name}</td>
              <td>—</td>
              <td>{f.min_tier}</td>
              <td>{f.download_count}</td>
              <td><button onClick={() => deleteFile(f.id)} className="delete-btn">Verwijder</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {uploading && <div className="loading">Uploaden...</div>}
    </div>
  )
}
