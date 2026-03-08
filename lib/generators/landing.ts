import type { DesignTokens, Subject } from '@/types'
import { getSubjectMotif, getSubjectCopy } from '@/lib/subjects'

export type LandingTemplate = 'hero-left' | 'centered' | 'split'

function baseStyles(tokens: DesignTokens): string {
  const { colors, radii, shadows, fontWeights, fontPairing } = tokens
  return `
@import url('${fontPairing.importUrl}');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --color-bg: ${colors.bg};
  --color-surface: ${colors.surface};
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-text: ${colors.text};
  --color-text-muted: ${colors.textMuted};
  --radius-sm: ${radii.sm};
  --radius-md: ${radii.md};
  --radius-lg: ${radii.lg};
  --shadow-md: ${shadows.md};
  --shadow-lg: ${shadows.lg};
  --fw-body: ${fontWeights.body};
  --fw-heading: ${fontWeights.heading};
}
body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: '${fontPairing.body}', system-ui, sans-serif;
  font-weight: var(--fw-body);
  line-height: 1.65;
}
h1, h2, h3 {
  font-family: '${fontPairing.heading}', serif;
  font-weight: var(--fw-heading);
  line-height: 1.2;
}
a { color: var(--color-accent); text-decoration: none; }
.btn {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  background: var(--color-accent);
  color: var(--color-bg);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: opacity .2s;
  font-size: 0.95rem;
}
.btn:hover { opacity: .85; }
.btn-outline {
  background: transparent;
  border: 1.5px solid rgba(255,255,255,.25);
  color: var(--color-text);
}
.btn-outline:hover { border-color: rgba(255,255,255,.5); }
nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 4rem;
  border-bottom: 1px solid rgba(255,255,255,.07);
  background: rgba(0,0,0,.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  position: sticky;
  top: 0;
  z-index: 100;
}
.logo { font-family: '${fontPairing.heading}', serif; font-size: 1.35rem; font-weight: 700; color: var(--color-text); }
nav ul { display: flex; gap: 2rem; list-style: none; align-items: center; }
nav ul a { color: var(--color-text-muted); font-size: .875rem; transition: color .15s; }
nav ul a:hover { color: var(--color-text); }
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 6rem 4rem;
  background: var(--color-bg);
}
.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(255,255,255,.06);
  transition: transform .2s, box-shadow .2s;
}
.card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.card-icon { font-size: 1.75rem; margin-bottom: 1rem; }
.card h3 { margin-bottom: .6rem; color: var(--color-primary); font-size: 1.1rem; }
.card p { color: var(--color-text-muted); font-size: .9rem; line-height: 1.6; }
.testimonial {
  background: var(--color-surface);
  padding: 5rem 4rem;
  text-align: center;
  border-top: 1px solid rgba(255,255,255,.06);
  border-bottom: 1px solid rgba(255,255,255,.06);
}
.testimonial blockquote {
  font-size: 1.3rem;
  max-width: 44ch;
  margin: 0 auto 1.25rem;
  color: var(--color-text-muted);
  font-style: italic;
  line-height: 1.6;
}
.testimonial cite { font-size: .85rem; color: var(--color-text-muted); opacity: .6; }
.cta-section {
  text-align: center;
  padding: 6rem 4rem;
  background: ${tokens.gradients.linear};
}
footer {
  padding: 2.5rem 4rem;
  text-align: center;
  color: var(--color-text-muted);
  font-size: .8rem;
  border-top: 1px solid rgba(255,255,255,.06);
  opacity: .7;
}
`
}

function navHtml(): string {
  return `<nav>
  <span class="logo">Brand</span>
  <ul>
    <li><a href="#">Features</a></li>
    <li><a href="#">Pricing</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#" class="btn" style="padding:.5rem 1.1rem;font-size:.85rem">Get started</a></li>
  </ul>
</nav>`
}

function featuresHtml(): string {
  return `<section class="features">
  <div class="card"><div class="card-icon">✦</div><h3>Feature One</h3><p>Describe the first key benefit of your product in a short sentence or two that resonates with users.</p></div>
  <div class="card"><div class="card-icon">◈</div><h3>Feature Two</h3><p>A second compelling reason customers choose your solution over alternatives in the market.</p></div>
  <div class="card"><div class="card-icon">⬡</div><h3>Feature Three</h3><p>Third benefit that reinforces the value proposition and drives conversion for your audience.</p></div>
</section>`
}

function testimonialHtml(): string {
  return `<section class="testimonial">
  <blockquote>"This product completely changed how our team operates. We ship three times faster now and the quality has never been better."</blockquote>
  <cite>— Alex Chen, CEO at Acme Corp</cite>
</section>`
}

function ctaHtml(tokens: DesignTokens): string {
  return `<section class="cta-section">
  <h2 style="font-size:2.5rem;margin-bottom:1rem;color:#fff;font-family:'${tokens.fontPairing.heading}',serif">Ready to get started?</h2>
  <p style="color:rgba(255,255,255,.75);margin-bottom:2.5rem;font-size:1.05rem">Join thousands of teams already using Brand to ship faster.</p>
  <a href="#" class="btn" style="background:#fff;color:${tokens.colors.primary};font-size:1rem;padding:.9rem 2rem">Start for free →</a>
</section>`
}

function footerHtml(): string {
  return `<footer><p>© 2026 Brand, Inc. · All rights reserved · <a href="#" style="opacity:.6">Privacy</a> · <a href="#" style="opacity:.6">Terms</a></p></footer>`
}

function heroLeftHtml(tokens: DesignTokens, headline: string, sub: string, motif: string): string {
  return `<section style="position:relative;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;min-height:88vh;align-items:center;padding:0 4rem;gap:5rem;background:var(--color-bg);color:var(--color-text)">
  ${motif}
  <div style="position:relative;z-index:1">
    <p style="text-transform:uppercase;letter-spacing:.18em;font-size:.75rem;color:${tokens.colors.accent};margin-bottom:1.25rem;font-weight:600">Introducing Brand</p>
    <h1 style="font-size:3.75rem;margin-bottom:1.5rem;line-height:1.1">${headline}</h1>
    <p style="color:${tokens.colors.textMuted};font-size:1.1rem;margin-bottom:2.5rem;max-width:38ch;line-height:1.7">${sub}</p>
    <div style="display:flex;gap:1rem;align-items:center">
      <a href="#" class="btn">Get started free</a>
      <a href="#" class="btn btn-outline">View demo →</a>
    </div>
    <p style="color:${tokens.colors.textMuted};font-size:.8rem;margin-top:1.5rem;opacity:.5">No credit card required · Free forever plan</p>
  </div>
  <div style="background:${tokens.gradients.radial};border-radius:${tokens.radii.lg};aspect-ratio:4/3;box-shadow:${tokens.shadows.lg};display:flex;align-items:center;justify-content:center">
    <div style="width:60%;height:60%;background:rgba(255,255,255,.1);border-radius:${tokens.radii.md};backdrop-filter:blur(8px)"></div>
  </div>
</section>`
}

function centeredHtml(tokens: DesignTokens, headline: string, sub: string, motif: string): string {
  return `<section style="position:relative;overflow:hidden;text-align:center;padding:9rem 4rem 7rem;background:${tokens.gradients.mesh},var(--color-bg);color:var(--color-text)">
  ${motif}
  <div style="position:relative;z-index:1">
    <div style="display:inline-block;background:${tokens.colors.accent}22;border:1px solid ${tokens.colors.accent}44;border-radius:9999px;padding:.35rem 1rem;margin-bottom:1.5rem">
      <span style="font-size:.75rem;color:${tokens.colors.accent};font-weight:600;letter-spacing:.1em;text-transform:uppercase">New · Spring 2026</span>
    </div>
    <h1 style="font-size:4.5rem;margin-bottom:1.5rem;max-width:14ch;margin-left:auto;margin-right:auto;line-height:1.05">${headline}</h1>
    <p style="color:${tokens.colors.textMuted};max-width:44ch;margin:0 auto 3rem;font-size:1.15rem;line-height:1.65">${sub}</p>
    <div style="display:flex;gap:1rem;justify-content:center;align-items:center">
      <a href="#" class="btn" style="font-size:1rem;padding:.9rem 2.25rem">Start for free →</a>
      <a href="#" style="color:${tokens.colors.textMuted};font-size:.9rem">Watch demo ↗</a>
    </div>
  </div>
</section>`
}

function splitHtml(tokens: DesignTokens, headline: string, sub: string, motif: string): string {
  return `<section style="display:grid;grid-template-columns:1fr 1fr;min-height:88vh">
  <div style="background:${tokens.gradients.linear};display:flex;align-items:center;justify-content:center;padding:4rem;position:relative;overflow:hidden">
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 70%, rgba(255,255,255,.12) 0%, transparent 60%)"></div>
    ${motif ? `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0.4">${motif.replace(/style="[^"]*position:absolute[^"]*"/g, 'style="position:relative;width:60%;height:auto"')}</div>` : ''}
    <div style="width:220px;height:220px;background:rgba(255,255,255,.15);border-radius:${tokens.radii.lg};backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.2);position:relative;z-index:1;display:flex;align-items:center;justify-content:center">
      <div style="width:100px;height:100px;background:rgba(255,255,255,.2);border-radius:50%"></div>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;justify-content:center;padding:5rem 4rem;background:var(--color-bg);position:relative;overflow:hidden">
    <p style="color:${tokens.colors.accent};margin-bottom:1rem;font-size:.8rem;text-transform:uppercase;letter-spacing:.15em;font-weight:600">Design at scale</p>
    <h1 style="font-size:3.25rem;margin-bottom:1.5rem;line-height:1.1">${headline}</h1>
    <p style="color:${tokens.colors.textMuted};margin-bottom:2.5rem;max-width:38ch;font-size:1rem;line-height:1.7">${sub}</p>
    <div style="display:flex;gap:1rem;align-items:center">
      <a href="#" class="btn">Try it free</a>
      <a href="#" class="btn btn-outline">Learn more</a>
    </div>
  </div>
</section>`
}

export function generateLandingHTML(template: LandingTemplate, tokens: DesignTokens, subjects: Subject[] = []): string {
  const { headline, sub } = getSubjectCopy(subjects)
  const motif = getSubjectMotif(subjects)

  const heroHtml =
    template === 'hero-left'
      ? heroLeftHtml(tokens, headline, sub, motif)
      : template === 'centered'
        ? centeredHtml(tokens, headline, sub, motif)
        : splitHtml(tokens, headline, sub, motif)

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Landing — ${template}</title>
<style>${baseStyles(tokens)}</style>
</head>
<body>
${navHtml()}
${heroHtml}
${featuresHtml()}
${testimonialHtml()}
${ctaHtml(tokens)}
${footerHtml()}
</body>
</html>`
}
