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

export default function LandingPages() {
  const { tokens } = useApp()
  const [active, setActive] = useState<LandingTemplate>('hero-left')

  const htmlMap = useMemo(() => {
    if (!tokens) return {} as Record<LandingTemplate, string>
    const map = {} as Record<LandingTemplate, string>
    for (const { id } of TEMPLATES) map[id] = generateLandingHTML(id, tokens)
    return map
  }, [tokens])

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
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-widest text-white/30">Landing Page Templates</h2>
        <button
          onClick={downloadZip}
          className="text-sm px-4 py-2 glass rounded-lg hover:bg-white/8 transition-colors"
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
            className={`glass rounded-xl px-4 py-3 text-left transition-all ${
              active === id ? 'border-white/25 bg-white/8' : 'hover:border-white/15'
            }`}
          >
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-white/35 mt-0.5">{desc}</p>
          </button>
        ))}
      </div>

      {/* Active preview */}
      {htmlMap[active] && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              </div>
              <span className="text-xs text-white/30 ml-2 font-mono">{active}.html</span>
            </div>
            <button
              onClick={() => downloadSingle(active)}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              ↓ Download HTML
            </button>
          </div>
          <iframe
            key={active}
            srcDoc={htmlMap[active]}
            className="w-full"
            style={{ height: '560px', border: 'none' }}
            title={active}
            sandbox="allow-same-origin"
          />
        </div>
      )}

      {/* All 3 thumbnails */}
      <div className="grid grid-cols-3 gap-4 pt-2">
        {TEMPLATES.map(({ id, label }) => (
          <div
            key={id}
            onClick={() => setActive(id)}
            className={`glass rounded-xl overflow-hidden cursor-pointer transition-all hover:border-white/20 ${
              active === id ? 'ring-1 ring-white/30' : ''
            }`}
          >
            <div className="px-3 py-2 border-b border-white/8 flex items-center justify-between">
              <span className="text-xs text-white/40">{label}</span>
              {active === id && <span className="text-xs text-white/30">Active</span>}
            </div>
            <iframe
              key={id + JSON.stringify(tokens.colors)}
              srcDoc={htmlMap[id]}
              className="w-full pointer-events-none"
              style={{ height: '180px', border: 'none', transform: 'scale(0.5)', transformOrigin: '0 0', width: '200%', marginBottom: '-90px' }}
              title={label}
              sandbox="allow-same-origin"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
