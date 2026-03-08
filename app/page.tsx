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
  { id: 'palette', label: 'Palette' },
  { id: 'landing', label: 'Landing Pages' },
  { id: 'social', label: 'Social' },
  { id: 'wallpapers', label: 'Wallpapers' },
  { id: 'mockups', label: 'Mockups' },
]

function App() {
  const { imageUrl, imageEl, activeTab, setActiveTab } = useApp()

  if (!imageUrl || !imageEl) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0a0a0a]">
        {/* Logo */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-3">
            Inspo<span className="text-white/40">Kit</span>
          </h1>
          <p className="text-white/40 text-lg">Upload one image. Generate your entire design system.</p>
        </div>

        {/* Upload area */}
        <div className="w-full max-w-2xl">
          <Upload />
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 mt-12 justify-center">
          {['Palette Extraction', 'Landing Pages', 'Social Templates', 'iPhone Wallpapers', 'Device Mockups', 'ZIP Export'].map(f => (
            <span key={f} className="text-xs text-white/30 border border-white/10 rounded-full px-3 py-1">
              {f}
            </span>
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/8 bg-[#0a0a0a]/80 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="text-base font-semibold tracking-tight text-white">
            Inspo<span className="text-white/40">Kit</span>
          </span>
          <div className="w-px h-4 bg-white/15" />
          <img
            src={imageUrl}
            alt="source"
            className="h-7 w-7 rounded-lg object-cover ring-1 ring-white/15"
          />
        </div>
        <ExportAll />
      </header>

      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-0 border-b border-white/8">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm rounded-t-lg transition-all duration-150 ${
              activeTab === t.id
                ? 'tab-active font-medium'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Controls strip */}
      <Controls />

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'palette' && <PaletteDisplay />}
        {activeTab === 'landing' && <LandingPages />}
        {activeTab === 'social' && <SocialTemplates />}
        {activeTab === 'wallpapers' && <Wallpapers />}
        {activeTab === 'mockups' && <Mockups />}
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  )
}
