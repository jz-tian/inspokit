'use client'
import { AppProvider, useApp } from '@/context/AppContext'
import Upload from '@/components/Upload'
import Controls from '@/components/Controls'
import PaletteDisplay from '@/components/PaletteDisplay'
import LandingPages from '@/components/LandingPages'
import SocialTemplates from '@/components/SocialTemplates'
import Wallpapers from '@/components/Wallpapers'
import Mockups from '@/components/Mockups'
import ExportAll from '@/components/ExportAll'
import type { TabName } from '@/types'

const TABS: { id: TabName; label: string }[] = [
  { id: 'palette', label: 'Palette & Vibe' },
  { id: 'landing', label: 'Landing Pages' },
  { id: 'social', label: 'Social' },
  { id: 'wallpapers', label: 'Wallpapers' },
  { id: 'mockups', label: 'Mockups' },
]

const FEATURES = [
  { icon: '◑', label: 'Palette extraction' },
  { icon: '✦', label: 'Atmosphere & vibe' },
  { icon: '⬡', label: 'Landing pages' },
  { icon: '◻', label: 'Social templates' },
  { icon: '◎', label: 'iPhone wallpapers' },
  { icon: '⬕', label: 'Device mockups' },
]

function App() {
  const { imageUrl, imageEl, activeTab, setActiveTab, vibe } = useApp()

  if (!imageUrl || !imageEl) {
    return (
      <main className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
        {/* Minimal top bar */}
        <nav style={{ padding: '1.5rem 2.5rem', borderBottom: '1px solid var(--border)' }}>
          <span
            className="rainbow-text"
            style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.01em' }}
          >
            InspoKit
          </span>
        </nav>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-8" style={{ paddingTop: '5rem', paddingBottom: '6rem' }}>
          <div style={{ maxWidth: '520px', width: '100%' }}>
            {/* Large wordmark */}
            <div style={{ marginBottom: '0.75rem' }}>
              <h1
                className="rainbow-text"
                style={{
                  fontFamily: "'Cormorant Garant', serif",
                  fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.0,
                  letterSpacing: '-0.02em',
                  marginBottom: '1rem',
                }}
              >
                InspoKit
              </h1>
              <p style={{ color: 'var(--text-2)', fontSize: '1.0625rem', lineHeight: 1.55, maxWidth: '38ch' }}>
                Upload one image — extract palette, atmosphere, and generate a full design kit.
              </p>
            </div>

            {/* Feature dots */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '2rem 0' }}>
              {FEATURES.map(f => (
                <span
                  key={f.label}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    fontSize: '0.75rem', color: 'var(--text-3)',
                    border: '1px solid var(--border)', borderRadius: '9999px',
                    padding: '0.25rem 0.75rem',
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  <span>{f.icon}</span>{f.label}
                </span>
              ))}
            </div>

            {/* Upload card */}
            <Upload />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--surface)' }}>
      {/* Sticky header */}
      <header
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.75rem 1.5rem',
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span
            className="rainbow-text"
            style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.01em' }}
          >
            InspoKit
          </span>
          <div style={{ width: '1px', height: '16px', background: 'var(--border-strong)' }} />
          {/* Source thumbnail */}
          <img
            src={imageUrl}
            alt="source"
            style={{ width: '28px', height: '28px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }}
          />
          {/* Vibe chip */}
          {vibe && (
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                fontSize: '0.75rem', color: 'var(--text-2)',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '9999px', padding: '0.2rem 0.65rem',
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {vibe.emoji} {vibe.label}
            </span>
          )}
        </div>
        <ExportAll />
      </header>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '0.25rem',
          padding: '0.625rem 1.25rem',
          background: 'rgba(255,255,255,0.7)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`tab-pill ${activeTab === t.id ? 'active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Controls strip */}
      <Controls />

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '2rem 1.75rem' }}>
        {activeTab === 'palette'    && <PaletteDisplay />}
        {activeTab === 'landing'    && <LandingPages />}
        {activeTab === 'social'     && <SocialTemplates />}
        {activeTab === 'wallpapers' && <Wallpapers />}
        {activeTab === 'mockups'    && <Mockups />}
      </div>
    </main>
  )
}

export default function Page() {
  return <AppProvider><App /></AppProvider>
}
