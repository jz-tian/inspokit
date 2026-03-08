'use client'
import { useCallback, DragEvent, ChangeEvent, useState } from 'react'
import { useApp } from '@/context/AppContext'

export default function Upload() {
  const { loadImage } = useApp()
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return
      setLoading(true)
      try {
        await loadImage(file)
      } finally {
        setLoading(false)
      }
    },
    [loadImage]
  )

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
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
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-20 cursor-pointer transition-all duration-200 select-none ${
        dragging
          ? 'border-white/50 bg-white/8 scale-[1.01]'
          : 'border-white/15 hover:border-white/30 hover:bg-white/3'
      }`}
    >
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Extracting palette…</p>
        </div>
      ) : (
        <>
          <div className="text-5xl mb-5 opacity-60">⬆</div>
          <p className="text-xl font-medium text-white/80 mb-2">Drop an image here</p>
          <p className="text-sm text-white/35">or click to browse · JPEG, PNG, WebP, GIF</p>
        </>
      )}
      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </div>
  )
}
