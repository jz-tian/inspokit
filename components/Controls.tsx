'use client'
import { useApp } from '@/context/AppContext'

function Slider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/40 shrink-0 w-20">{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-28"
      />
      <span className="text-xs text-white/25 w-7 font-mono tabular-nums">{Math.round(value * 100)}</span>
    </div>
  )
}

export default function Controls() {
  const { controls, setControls, tokens, imageUrl } = useApp()
  if (!imageUrl) return null

  return (
    <div className="flex items-center gap-6 px-6 py-3 border-b border-white/8 bg-[#0a0a0a]">
      <Slider label="Roundedness" value={controls.roundedness} onChange={v => setControls({ roundedness: v })} />
      <Slider label="Boldness" value={controls.boldness} onChange={v => setControls({ boldness: v })} />
      <Slider label="Contrast" value={controls.contrast} onChange={v => setControls({ contrast: v })} />

      {tokens && (
        <div className="ml-auto flex items-center gap-2">
          {Object.values(tokens.colors).slice(0, 6).map((color, i) => (
            <div
              key={i}
              title={color}
              style={{ background: color }}
              className="w-4 h-4 rounded-full ring-1 ring-white/10"
            />
          ))}
        </div>
      )}
    </div>
  )
}
