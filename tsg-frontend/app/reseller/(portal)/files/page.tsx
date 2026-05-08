'use client'
import { useEffect, useState } from 'react'
import { apiFetch, apiJson } from '@/lib/api'
import type { MarketingFile } from '@/lib/types'

export default function FilesPage() {
  const [files, setFiles] = useState<MarketingFile[]>([])

  useEffect(() => {
    apiJson<MarketingFile[]>('/files').then(setFiles)
  }, [])

  async function download(fileId: string, name: string) {
    const res = await apiFetch(`/files/${fileId}/download`)
    const { url } = await res.json()
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
  }

  const fmtBytes = (n: number | null) =>
    n ? `${(n / 1024 / 1024).toFixed(1)} MB` : '—'

  return (
    <div className="panel" id="panel-files">
      <h1>Bestanden</h1>
      {files.length === 0 && <div className="loading">Laden...</div>}
      <div className="files-grid">
        {files.map(f => (
          <div key={f.id} className={`file-card${f.accessible ? '' : ' locked'}`}>
            <div className="file-name">{f.name}</div>
            <div className="file-size">{fmtBytes(f.file_size_bytes)}</div>
            <div className="file-downloads">{f.download_count}× gedownload</div>
            {f.accessible ? (
              <button onClick={() => download(f.id, f.name)} className="download-btn">
                Downloaden
              </button>
            ) : (
              <div className="lock-msg">Vereist {f.min_tier} tier of hoger</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
