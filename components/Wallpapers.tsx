'use client'
import { useEffect, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import { renderWallpaper, WALLPAPER_STYLES, WallpaperStyle } from '@/lib/generators/wallpaper'
import type { DesignTokens } from '@/types'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

function WallpaperCard({
  style,
  label,
  desc,
  tokens,
  imageEl,
}: {
  style: WallpaperStyle
  label: string
  desc: string
  tokens: DesignTokens
  imageEl: HTMLImageElement | null
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      renderWallpaper(canvasRef.current, style, tokens, imageEl ?? undefined)
    }
  }, [style, tokens, imageEl])

  const download = () => {
    if (!canvasRef.current) return
    canvasRef.current.toBlob(
      blob => blob && saveAs(blob, `wallpaper-${style}.png`),
      'image/png'
    )
  }

  return (
    <div className="card-elevated rounded-2xl overflow-hidden flex flex-col">
      <div className="flex items-start justify-between px-4 py-3 border-b border-[var(--border)]">
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">{label}</p>
          <p className="text-xs text-[var(--text-3)] mt-0.5 leading-relaxed">{desc}</p>
        </div>
        <button
          onClick={download}
          className="text-xs text-[var(--text-3)] hover:text-[var(--text)] transition-colors shrink-0 ml-3 mt-0.5 border border-[var(--border)] rounded px-2 py-0.5"
        >
          ↓ PNG
        </button>
      </div>
      {/* Canvas preview at iPhone aspect ratio */}
      <div className="relative bg-[var(--surface)]" style={{ aspectRatio: '1290/2796' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
        />
      </div>
      <div className="px-4 py-2 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--text-3)] font-mono">1290 × 2796 px · iPhone 15 Pro Max</p>
      </div>
    </div>
  )
}

export default function Wallpapers() {
  const { tokens, imageEl } = useApp()
  if (!tokens) return null

  const exportAll = async () => {
    const zip = new JSZip()
    for (const { id } of WALLPAPER_STYLES) {
      const canvas = document.createElement('canvas')
      renderWallpaper(canvas, id, tokens, imageEl ?? undefined)
      const blob = await new Promise<Blob>(res =>
        canvas.toBlob(b => res(b!), 'image/png')
      )
      zip.file(`wallpaper-${id}.png`, blob)
    }
    const b = await zip.generateAsync({ type: 'blob' })
    saveAs(b, 'inspokit-wallpapers.zip')
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text)]" style={{ fontFamily: 'Cormorant Garant, serif' }}>
            iPhone Wallpapers
          </h2>
          <p className="text-xs text-[var(--text-3)] mt-0.5">1290 × 2796 px · three styles, ready to use</p>
        </div>
        <button
          onClick={exportAll}
          className="text-sm px-4 py-2 rounded-lg border border-[var(--border-strong)] text-[var(--text-2)] hover:bg-[var(--surface)] transition-colors"
        >
          Export All ZIP ↓
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {WALLPAPER_STYLES.map(({ id, label, desc }) => (
          <WallpaperCard
            key={id}
            style={id}
            label={label}
            desc={desc}
            tokens={tokens}
            imageEl={imageEl}
          />
        ))}
      </div>
    </div>
  )
}
