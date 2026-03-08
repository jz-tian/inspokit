export function getLaptopSVG(screenshotDataUrl: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 580" style="width:100%">
  <!-- Drop shadow filter -->
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-opacity="0.4"/>
    </filter>
    <clipPath id="screen-clip">
      <rect x="80" y="32" width="740" height="440" rx="3"/>
    </clipPath>
  </defs>

  <!-- Base/palm rest -->
  <path d="M30 510 L870 510 L800 555 L100 555 Z" fill="#2c2c2e"/>
  <rect x="30" y="505" width="840" height="8" rx="2" fill="#3a3a3c"/>
  <!-- Hinge -->
  <rect x="30" y="497" width="840" height="10" rx="2" fill="#1c1c1e"/>

  <!-- Lid (screen bezel) -->
  <rect x="60" y="20" width="780" height="480" rx="14" fill="#1c1c1e" filter="url(#shadow)"/>

  <!-- Screen background -->
  <rect x="80" y="32" width="740" height="440" rx="3" fill="#000"/>

  <!-- Screenshot -->
  <image href="${screenshotDataUrl}" x="80" y="32" width="740" height="440"
    clip-path="url(#screen-clip)" preserveAspectRatio="xMidYMid slice"/>

  <!-- Camera -->
  <circle cx="450" cy="26" r="4" fill="#2c2c2e"/>
  <circle cx="450" cy="26" r="1.5" fill="#1a1a1a"/>

  <!-- Trackpad -->
  <rect x="360" y="520" width="180" height="28" rx="6" fill="#2c2c2e"/>
  <!-- Keyboard hint rows -->
  <rect x="110" y="515" width="220" height="3" rx="1.5" fill="#2c2c2e" opacity="0.5"/>
  <rect x="570" y="515" width="220" height="3" rx="1.5" fill="#2c2c2e" opacity="0.5"/>

  <!-- Bezel inner glow -->
  <rect x="80" y="32" width="740" height="440" rx="3" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
</svg>`
}

export function getIPhoneSVG(screenshotDataUrl: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 700" style="width:100%">
  <defs>
    <filter id="phone-shadow">
      <feDropShadow dx="0" dy="10" stdDeviation="20" flood-opacity="0.45"/>
    </filter>
    <clipPath id="phone-screen">
      <rect x="22" y="22" width="296" height="656" rx="38"/>
    </clipPath>
  </defs>

  <!-- Body -->
  <rect x="8" y="8" width="324" height="684" rx="50" fill="#1c1c1e" filter="url(#phone-shadow)"/>

  <!-- Body edge highlight -->
  <rect x="8" y="8" width="324" height="684" rx="50" fill="none"
    stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>

  <!-- Screen -->
  <rect x="22" y="22" width="296" height="656" rx="38" fill="#000"/>

  <!-- Screenshot -->
  <image href="${screenshotDataUrl}" x="22" y="22" width="296" height="656"
    clip-path="url(#phone-screen)" preserveAspectRatio="xMidYMid slice"/>

  <!-- Screen edge -->
  <rect x="22" y="22" width="296" height="656" rx="38" fill="none"
    stroke="rgba(255,255,255,0.06)" stroke-width="1"/>

  <!-- Dynamic Island -->
  <rect x="115" y="34" width="110" height="30" rx="15" fill="#000"/>

  <!-- Side button (right) -->
  <rect x="333" y="160" width="8" height="70" rx="4" fill="#3a3a3c"/>
  <rect x="333" y="250" width="8" height="36" rx="4" fill="#3a3a3c"/>

  <!-- Volume buttons (left) -->
  <rect x="-1" y="130" width="8" height="44" rx="4" fill="#3a3a3c"/>
  <rect x="-1" y="184" width="8" height="44" rx="4" fill="#3a3a3c"/>
  <!-- Silent toggle -->
  <rect x="-1" y="105" width="8" height="18" rx="4" fill="#3a3a3c"/>

  <!-- Home indicator -->
  <rect x="120" y="662" width="100" height="5" rx="2.5" fill="rgba(255,255,255,0.35)"/>
</svg>`
}

export async function svgToPng(svgString: string, w: number, h: number): Promise<Blob> {
  return new Promise(resolve => {
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      canvas.toBlob(b => resolve(b!), 'image/png')
    }
    img.src = url
  })
}
