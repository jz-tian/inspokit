import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InspoKit',
  description: 'Upload an image. Generate your design system.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
