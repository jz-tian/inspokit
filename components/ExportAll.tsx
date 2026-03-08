'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { exportAllZip } from '@/lib/exporters/zip'

export default function ExportAll() {
  const { tokens, imageEl, imageUrl } = useApp()
  const [loading, setLoading] = useState(false)

  if (!imageUrl) return null

  const handleExport = async () => {
    if (!tokens || loading) return
    setLoading(true)
    try {
      await exportAllZip(tokens, imageEl)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading || !tokens}
      className="text-sm px-5 py-2 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {loading ? (
        <>
          <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          Exporting…
        </>
      ) : (
        'Export All ↓'
      )}
    </button>
  )
}
