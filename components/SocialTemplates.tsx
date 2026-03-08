'use client'
import { useEffect, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import {
  renderSocialTemplate,
  SOCIAL_FORMATS,
  FORMAT_LABELS,
  SocialFormat,
} from '@/lib/generators/social'
import type { DesignTokens } from '@/types'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

function SocialCard({
  format,
  tokens,
  subjects,
}: {
  format: SocialFormat
  tokens: DesignTokens
  subjects: import('@/types').Subject[]
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      renderSocialTemplate(canvasRef.current, format, tokens, subjects)
    }
  }, [format, tokens, subjects])

  const download = () => {
    if (!canvasRef.current) return
    canvasRef.current.toBlob(
      blob => blob && saveAs(blob, `${format}.png`),
      'image/png'
    )
  }

  const isWide = format === 'post'
  const isStory = format === 'story'

  return (
    <div className="card rounded-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]">
        <span className="text-xs text-[var(--text-2)] truncate font-medium">{FORMAT_LABELS[format]}</span>
        <button
          onClick={download}
          className="text-xs text-[var(--text-3)] hover:text-[var(--text)] transition-colors ml-2 shrink-0"
        >
          ↓
        </button>
      </div>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          maxHeight: isStory ? '280px' : '200px',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

export default function SocialTemplates() {
  const { tokens, subjects } = useApp()
  if (!tokens) return null

  const exportAll = async () => {
    const zip = new JSZip()
    for (const fmt of SOCIAL_FORMATS) {
      const canvas = document.createElement('canvas')
      renderSocialTemplate(canvas, fmt, tokens, subjects)
      const blob = await new Promise<Blob>(res =>
        canvas.toBlob(b => res(b!), 'image/png')
      )
      zip.file(`${fmt}.png`, blob)
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'inspokit-social.zip')
  }

  // Group: non-carousel + carousel
  const standalones = SOCIAL_FORMATS.filter(f => !f.startsWith('carousel-'))
  const carousel = SOCIAL_FORMATS.filter(f => f.startsWith('carousel-'))

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text)]" style={{ fontFamily: 'Cormorant Garant, serif' }}>
            Social Templates
          </h2>
          <p className="text-xs text-[var(--text-3)] mt-0.5">Post, story, and carousel assets at full resolution</p>
        </div>
        <button
          onClick={exportAll}
          className="text-sm px-4 py-2 rounded-lg border border-[var(--border-strong)] text-[var(--text-2)] hover:bg-[var(--surface)] transition-colors"
        >
          Export All ZIP ↓
        </button>
      </div>

      {/* Standalone formats */}
      <div>
        <p className="label mb-3">Standalone</p>
        <div className="grid grid-cols-3 gap-4">
          {standalones.map(fmt => (
            <SocialCard key={fmt} format={fmt} tokens={tokens} subjects={subjects} />
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div>
        <p className="label mb-3">Carousel · 5 slides</p>
        <div className="grid grid-cols-5 gap-3">
          {carousel.map(fmt => (
            <SocialCard key={fmt} format={fmt} tokens={tokens} subjects={subjects} />
          ))}
        </div>
      </div>
    </div>
  )
}
