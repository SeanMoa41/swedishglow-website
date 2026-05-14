'use client'
import { useEffect, useState } from 'react'
import { apiFetch, apiJson } from '@/lib/api'
import type { MarketingFile, Reseller } from '@/lib/types'
import PageHeader from '@/components/reseller/PageHeader'

const TIER_ORDER = ['all', 'pearl', 'rose', 'pro', 'elite', 'black']

function isAccessible(fileTier: string, resellerTier: string): boolean {
  if (fileTier === 'all') return true
  return TIER_ORDER.indexOf(resellerTier) >= TIER_ORDER.indexOf(fileTier)
}

function tierLabel(tier: string): string {
  if (tier === 'all') return 'Alle tiers'
  return tier.charAt(0).toUpperCase() + tier.slice(1) + ' en hoger'
}

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

export default function FilesPage() {
  const [files, setFiles] = useState<MarketingFile[]>([])
  const [reseller, setReseller] = useState<Reseller | null>(null)

  useEffect(() => {
    apiJson<MarketingFile[]>('/files')
      .then(setFiles)
      .catch((e) => console.error('files:', e.message))
    apiJson<Reseller>('/auth/me')
      .then(setReseller)
      .catch((e) => console.error('me:', e.message))
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

  const resellerTier = reseller?.tier ?? 'pearl'

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Downloads" title="Marketingmateriaal" />

      <div className="section-eyebrow">Beschikbare bestanden</div>

      {files.length === 0 && <div className="loading">Laden...</div>}

      <div className="table-wrap">
        {files.map(f => {
          const accessible = isAccessible(f.min_tier, resellerTier)
          return (
            <div key={f.id} className={`file-row${accessible ? '' : ' locked'}`}>
              <div className="file-icon">
                {accessible ? <FileIcon /> : <LockIcon />}
              </div>
              <div className="file-info">
                <div className="file-name">{f.name}</div>
                <div className="file-meta">{f.download_count} downloads</div>
              </div>
              <div className="file-tier-tag">{tierLabel(f.min_tier)}</div>
              <div className="file-action">
                {accessible
                  ? (
                    <button className="icon-btn" onClick={() => download(f.id, f.name)}>
                      ↓
                    </button>
                  )
                  : (
                    <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                      Vereist {f.min_tier !== 'all' ? f.min_tier.charAt(0).toUpperCase() + f.min_tier.slice(1) : ''} tier
                    </span>
                  )
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
