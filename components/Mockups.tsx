'use client'
import { useEffect, useState, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import { generateLandingHTML } from '@/lib/generators/landing'
import { getLaptopSVG, getIPhoneSVG, svgToPng } from '@/lib/generators/mockup'
import { renderWallpaper } from '@/lib/generators/wallpaper'
import { saveAs } from 'file-saver'

export default function Mockups() {
  const { tokens, imageEl } = useApp()
  const [laptopSvg, setLaptopSvg] = useState<string>('')
  const [iphoneSvg, setIphoneSvg] = useState<string>('')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!tokens) return
    setGenerating(true)

    // Generate a screenshot from landing page HTML
    // We use an off-screen canvas with a gradient as the screenshot source
    // (iframe + html-to-image can fail due to CORS on Google Fonts)
    const screenshotCanvas = document.createElement('canvas')
    screenshotCanvas.width = 1280
    screenshotCanvas.height = 800
    const ctx = screenshotCanvas.getContext('2d')!

    // Draw a beautiful gradient landing page preview
    const bg = ctx.createLinearGradient(0, 0, 1280, 800)
    bg.addColorStop(0, tokens.colors.bg)
    bg.addColorStop(1, tokens.colors.surface)
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, 1280, 800)

    // Navbar area
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.fillRect(0, 0, 1280, 64)
    ctx.fillStyle = tokens.colors.text
    ctx.font = `700 22px serif`
    ctx.fillText('Brand', 48, 40)

    // Hero gradient blob
    const blob = ctx.createRadialGradient(900, 400, 0, 900, 400, 500)
    blob.addColorStop(0, tokens.colors.accent + 'aa')
    blob.addColorStop(1, 'transparent')
    ctx.fillStyle = blob
    ctx.fillRect(0, 0, 1280, 800)

    const blob2 = ctx.createRadialGradient(400, 300, 0, 400, 300, 380)
    blob2.addColorStop(0, tokens.colors.primary + '88')
    blob2.addColorStop(1, 'transparent')
    ctx.fillStyle = blob2
    ctx.fillRect(0, 0, 1280, 800)

    // Heading text
    ctx.fillStyle = tokens.colors.text
    ctx.font = `700 72px serif`
    ctx.fillText('Design systems', 80, 280)
    ctx.fillStyle = tokens.colors.accent
    ctx.fillText('that inspire.', 80, 370)

    // Subtext
    ctx.fillStyle = tokens.colors.text + '88'
    ctx.font = `400 24px sans-serif`
    ctx.fillText('From one image to a complete design system.', 80, 430)

    // CTA button
    const btnRadius = parseInt(tokens.radii.md) || 8
    ctx.fillStyle = tokens.colors.accent
    ctx.beginPath()
    ctx.roundRect(80, 460, 240, 56, btnRadius)
    ctx.fill()
    ctx.fillStyle = tokens.colors.bg
    ctx.font = `600 20px sans-serif`
    ctx.fillText('Get started free', 115, 494)

    // Feature cards
    const cardColors = [tokens.colors.primary, tokens.colors.secondary, tokens.colors.accent]
    ;[0, 1, 2].forEach(i => {
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      ctx.beginPath()
      ctx.roundRect(80 + i * 280, 580, 240, 140, 12)
      ctx.fill()
      ctx.fillStyle = cardColors[i]
      ctx.fillRect(80 + i * 280, 580, 4, 60)
    })

    const screenshotUrl = screenshotCanvas.toDataURL('image/png')

    // Also generate phone wallpaper as iPhone screen
    const phoneCanvas = document.createElement('canvas')
    renderWallpaper(phoneCanvas, 'mesh', tokens)
    const phoneUrl = phoneCanvas.toDataURL('image/png')

    setLaptopSvg(getLaptopSVG(screenshotUrl))
    setIphoneSvg(getIPhoneSVG(phoneUrl))
    setGenerating(false)
  }, [tokens])

  const downloadLaptop = async () => {
    if (!laptopSvg) return
    saveAs(new Blob([laptopSvg], { type: 'image/svg+xml' }), 'mockup-laptop.svg')
  }

  const downloadIphone = async () => {
    if (!iphoneSvg) return
    saveAs(new Blob([iphoneSvg], { type: 'image/svg+xml' }), 'mockup-iphone.svg')
  }

  if (!tokens) return null

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-widest text-white/30">Device Mockups</h2>
        {generating && (
          <div className="flex items-center gap-2 text-xs text-white/30">
            <div className="w-3 h-3 border border-white/20 border-t-white/60 rounded-full animate-spin" />
            Generating…
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Laptop mockup */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
            <div>
              <p className="text-sm font-medium">MacBook</p>
              <p className="text-xs text-white/35 mt-0.5">Landing page preview</p>
            </div>
            <button
              onClick={downloadLaptop}
              className="text-xs text-white/35 hover:text-white/70 transition-colors"
            >
              ↓ SVG
            </button>
          </div>
          <div className="p-4 bg-gradient-to-b from-white/3 to-transparent">
            {laptopSvg ? (
              <div dangerouslySetInnerHTML={{ __html: laptopSvg }} />
            ) : (
              <div className="aspect-[900/580] bg-white/5 rounded-lg animate-pulse" />
            )}
          </div>
        </div>

        {/* iPhone mockup */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
            <div>
              <p className="text-sm font-medium">iPhone 15 Pro</p>
              <p className="text-xs text-white/35 mt-0.5">Abstract mesh wallpaper</p>
            </div>
            <button
              onClick={downloadIphone}
              className="text-xs text-white/35 hover:text-white/70 transition-colors"
            >
              ↓ SVG
            </button>
          </div>
          <div className="p-4 flex justify-center bg-gradient-to-b from-white/3 to-transparent">
            <div style={{ width: '240px' }}>
              {iphoneSvg ? (
                <div dangerouslySetInnerHTML={{ __html: iphoneSvg }} />
              ) : (
                <div className="aspect-[340/700] bg-white/5 rounded-3xl animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-white/20">
        SVG device frames — embedded canvas screenshots. Open in browser to view at full resolution.
      </p>
    </div>
  )
}
