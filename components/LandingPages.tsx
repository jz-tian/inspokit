'use client'
import { useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { generateLandingHTML, LandingTemplate } from '@/lib/generators/landing'
import { tokensToCSS, tokensToJSON } from '@/lib/tokens'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

const TEMPLATES: { id: LandingTemplate; label: string; desc: string }[] = [
  { id: 'hero-left', label: 'Hero Left', desc: 'Left-aligned hero with gradient image panel' },
  { id: 'centered', label: 'Centered', desc: 'Full-width centered hero over mesh gradient' },
  { id: 'split', label: 'Split', desc: '50/50 color-block with content panel' },
]

/** Inject CSS to disable all interactive elements in the preview iframe */
function makePreviewSrc(html: string): string {
  const disableCSS = `<style>a,button,input,select,textarea,label,area,[onclick],[role=button]{pointer-events:none!important;cursor:default!important}</style>`
  return html.replace('</head>', `${disableCSS}</head>`)
}

export default function LandingPages() {
  const { tokens, subjects } = useApp()
  const [active, setActive] = useState<LandingTemplate>('hero-left')

  const htmlMap = useMemo(() => {
    if (!tokens) return {} as Record<LandingTemplate, string>
    const map = {} as Record<LandingTemplate, string>
    for (const { id } of TEMPLATES) map[id] = generateLandingHTML(id, tokens, subjects)
    return map
  }, [tokens, subjects])

  if (!tokens) return null

  const downloadZip = async () => {
    const zip = new JSZip()
    const folder = zip.folder('landing')!
    for (const { id } of TEMPLATES) folder.file(`${id}.html`, htmlMap[id])
    zip.file('tokens.json', tokensToJSON(tokens))
    zip.file('styles.css', tokensToCSS(tokens))
    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'inspokit-landing.zip')
  }

  const downloadSingle = (id: LandingTemplate) => {
    saveAs(new Blob([htmlMap[id]], { type: 'text/html' }), `${id}.html`)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text)]" style={{ fontFamily: 'Cormorant Garant, serif' }}>
            Landing Page Templates
          </h2>
          <p className="text-xs text-[var(--text-3)] mt-0.5">3 production-ready HTML files, pre-styled with your palette</p>
        </div>
        <button
          onClick={downloadZip}
          className="text-sm px-4 py-2 rounded-lg border border-[var(--border-strong)] text-[var(--text-2)] hover:bg-[var(--surface)] transition-colors"
        >
          Download All ZIP ↓
        </button>
      </div>

      {/* Template selector */}
      <div className="flex gap-3">
        {TEMPLATES.map(({ id, label, desc }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`card rounded-xl px-4 py-3 text-left transition-all flex-1 ${
              active === id
                ? 'ring-2 ring-[var(--text-3)] bg-[var(--surface)]'
                : 'hover:bg-[var(--surface)]'
            }`}
          >
            <p className="text-sm font-medium text-[var(--text)]">{label}</p>
            <p className="text-xs text-[var(--text-3)] mt-0.5 leading-relaxed">{desc}</p>
          </button>
        ))}
      </div>

      {/* Active preview */}
      {htmlMap[active] && (
        <div className="card-elevated rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              </div>
              <span className="text-xs text-[var(--text-3)] font-mono">{active}.html</span>
            </div>
            <button
              onClick={() => downloadSingle(active)}
              className="text-xs text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
            >
              ↓ Download HTML
            </button>
          </div>
          <iframe
            key={active}
            srcDoc={makePreviewSrc(htmlMap[active])}
            className="w-full"
            style={{ height: '560px', border: 'none', background: '#fff' }}
            title={active}
            sandbox="allow-same-origin"
          />
        </div>
      )}

      {/* All 3 thumbnails */}
      <div className="grid grid-cols-3 gap-4">
        {TEMPLATES.map(({ id, label }) => (
          <div
            key={id}
            onClick={() => setActive(id)}
            className={`card rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-md ${
              active === id ? 'ring-2 ring-[var(--text-3)]' : ''
            }`}
          >
            <div className="px-3 py-2 border-b border-[var(--border)] flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-2)]">{label}</span>
              {active === id && (
                <span className="text-xs text-[var(--text-3)] bg-[var(--surface)] px-1.5 py-0.5 rounded">active</span>
              )}
            </div>
            <iframe
              key={id + JSON.stringify(tokens.colors)}
              srcDoc={makePreviewSrc(htmlMap[id])}
              className="w-full pointer-events-none"
              style={{
                height: '180px',
                border: 'none',
                transform: 'scale(0.5)',
                transformOrigin: '0 0',
                width: '200%',
                marginBottom: '-90px',
              }}
              title={label}
              sandbox="allow-same-origin"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
