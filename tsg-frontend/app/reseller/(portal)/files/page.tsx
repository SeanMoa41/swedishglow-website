'use client'
import { useEffect, useState } from 'react'
import { apiFetch, apiJson } from '@/lib/api'
import type { FileListOut } from '@/lib/types'
import PageHeader from '@/components/reseller/PageHeader'

function tierLabel(tier: string): string {
  if (tier === 'all') return 'Alle tiers'
  return tier.charAt(0).toUpperCase() + tier.slice(1) + ' en hoger'
}

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

export default function FilesPage() {
  const [data, setData] = useState<FileListOut | null>(null)

  useEffect(() => {
    apiJson<FileListOut>('/files')
      .then(setData)
      .catch((e) => console.error('files:', e.message))
  }, [])

  async function download(fileId: string, name: string) {
    try {
      const res = await apiFetch(`/files/${fileId}/download`)
      const { download_url } = await res.json()
      const a = document.createElement('a')
      a.href = download_url
      a.download = name
      a.click()
    } catch (e) {
      console.error('download:', e)
    }
  }

  const accessible = data?.accessible ?? []
  const locked = data?.locked ?? []

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Downloads" title="Marketingmateriaal" />

      {!data && <div className="loading">Laden...</div>}

      {data && (
        <>
          {accessible.length > 0 && (
            <>
              <div className="section-eyebrow">Beschikbaar</div>
              <div className="table-wrap">
                {accessible.map(f => (
                  <div key={f.id} className="file-row">
                    <div className="file-icon"><FileIcon /></div>
                    <div className="file-info">
                      <div className="file-name">{f.name}</div>
                      <div className="file-meta">{f.download_count} downloads · {tierLabel(f.min_tier)}</div>
                    </div>
                    <button className="btn btn-ghost" onClick={() => download(f.id, f.name)}>
                      Downloaden ↓
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {locked.length > 0 && (
            <>
              <div className="section-eyebrow" style={{ marginTop: '2rem' }}>Vergrendeld</div>
              <div className="table-wrap">
                {locked.map(f => (
                  <div key={f.id} className="file-row locked">
                    <div className="file-icon"><LockIcon /></div>
                    <div className="file-info">
                      <div className="file-name">{f.name}</div>
                      <div className="file-meta">Vereist {tierLabel(f.min_tier)}</div>
                    </div>
                    <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Geen toegang</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
