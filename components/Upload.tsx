'use client'
import { useCallback, DragEvent, ChangeEvent, useState } from 'react'
import { useApp } from '@/context/AppContext'

export default function Upload() {
  const { loadImage } = useApp()
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setLoading(true)
    try { await loadImage(file) } finally { setLoading(false) }
  }, [loadImage])

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onClick={() => document.getElementById('file-input')?.click()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1.5px dashed ${dragging ? '#7C5DFF' : 'var(--border-strong)'}`,
        borderRadius: '20px',
        padding: '3.5rem 2rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: dragging ? 'rgba(124,93,255,0.04)' : 'var(--bg)',
        transform: dragging ? 'scale(1.01)' : 'scale(1)',
        userSelect: 'none',
        boxShadow: dragging ? '0 0 0 4px rgba(124,93,255,0.08)' : 'none',
      }}
    >
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '32px', height: '32px',
            border: '2px solid var(--border)',
            borderTopColor: 'var(--text)',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }} />
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>Analysing image…</p>
        </div>
      ) : (
        <>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.35rem', marginBottom: '1.25rem', color: 'var(--text-2)',
          }}>
            ↑
          </div>
          <p style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.9375rem' }}>
            Drop your image here
          </p>
          <p style={{ color: 'var(--text-3)', fontSize: '0.8125rem' }}>
            or click to browse · JPEG, PNG, WebP
          </p>
        </>
      )}
      <input id="file-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={onChange} />
    </div>
  )
}
