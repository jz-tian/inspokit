'use client'
import { useApp } from '@/context/AppContext'

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: 'var(--text-3)', width: '80px', flexShrink: 0 }}>
        {label}
      </span>
      <input
        type="range" min={0} max={1} step={0.01} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100px' }}
      />
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: 'var(--text-3)', width: '28px' }}>
        {Math.round(value * 100)}
      </span>
    </div>
  )
}

export default function Controls() {
  const { controls, setControls, tokens, imageUrl } = useApp()
  if (!imageUrl) return null

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '2rem',
      padding: '0.625rem 1.75rem',
      background: 'rgba(255,255,255,0.6)',
      borderBottom: '1px solid var(--border)',
      flexWrap: 'wrap',
    }}>
      <Slider label="Roundedness" value={controls.roundedness} onChange={v => setControls({ roundedness: v })} />
      <Slider label="Boldness"    value={controls.boldness}    onChange={v => setControls({ boldness: v })} />
      <Slider label="Contrast"    value={controls.contrast}    onChange={v => setControls({ contrast: v })} />

      {tokens && (
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {Object.values(tokens.colors).slice(0, 6).map((color, i) => (
            <div
              key={i}
              title={color}
              style={{
                width: '18px', height: '18px',
                borderRadius: '50%',
                background: color,
                border: '1.5px solid rgba(0,0,0,0.08)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
