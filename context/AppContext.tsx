'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { AppState, Controls, TabName, Subject } from '@/types'
import { generateTokens } from '@/lib/tokens'
import { extractPalette } from '@/lib/palette'
import { extractVibe } from '@/lib/vibe'
import { detectSubjects } from '@/lib/subjects'

const DEFAULT_CONTROLS: Controls = { roundedness: 0.5, boldness: 0.5, contrast: 0.5 }

interface AppContextValue extends AppState {
  loadImage: (file: File) => Promise<void>
  setControls: (c: Partial<Controls>) => void
  setActiveTab: (t: TabName) => void
  setFontOverride: (id: 1 | 2 | 3 | null) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    imageFile: null,
    imageUrl: null,
    imageEl: null,
    palette: [],
    tokens: null,
    vibe: null,
    subjects: [],
    subjectsLoading: false,
    controls: DEFAULT_CONTROLS,
    activeTab: 'palette',
    fontPairingOverride: null,
  })

  const loadImage = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url
    await new Promise<void>(res => { img.onload = () => res() })

    const vibe = extractVibe(img)
    const palette = await extractPalette(img)
    const tokens = generateTokens(palette, DEFAULT_CONTROLS, null)

    // Commit palette/vibe immediately so UI is responsive
    setState(s => ({
      ...s,
      imageFile: file,
      imageUrl: url,
      imageEl: img,
      palette,
      tokens,
      vibe,
      subjects: [],
      subjectsLoading: true,
      controls: DEFAULT_CONTROLS,
      fontPairingOverride: null,
      activeTab: 'palette',
    }))

    // Subject detection loads the TF model (~1.5MB) — run async after render
    const subjects = await detectSubjects(img)
    setState(s => ({ ...s, subjects, subjectsLoading: false }))
  }, [])

  const setControls = useCallback((partial: Partial<Controls>) => {
    setState(s => {
      const controls = { ...s.controls, ...partial }
      const tokens = s.palette.length
        ? generateTokens(s.palette, controls, s.fontPairingOverride)
        : s.tokens
      return { ...s, controls, tokens }
    })
  }, [])

  const setActiveTab = useCallback((activeTab: TabName) => {
    setState(s => ({ ...s, activeTab }))
  }, [])

  const setFontOverride = useCallback((fontPairingOverride: 1 | 2 | 3 | null) => {
    setState(s => {
      const tokens = s.palette.length
        ? generateTokens(s.palette, s.controls, fontPairingOverride)
        : s.tokens
      return { ...s, fontPairingOverride, tokens }
    })
  }, [])

  return (
    <AppContext.Provider value={{ ...state, loadImage, setControls, setActiveTab, setFontOverride }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
