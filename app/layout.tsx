import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'StormStrike — Club Directory',
  description: 'The definitive directory for tracking clubs — ratings, flash type, pricing, and more.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
        <div className="min-h-screen">
          {/* Cinematic Storm Background */}
          <div className="storm-background">
            <div className="sky-base" />
            <div className="sky-glow" />
            
            <div className="cloud-container">
              <div className="cloud-1" />
              <div className="cloud-2" />
              <div className="cloud-3" />
            </div>
            
            <div className="lightning-flash" />
            <div className="lightning-secondary" />
            <div className="mist-layer" />
          </div>

          {/* Page Content */}
          <div className="content-wrapper relative z-10">
            {children}
            <Analytics />
          </div>
        </div>
      </body>
    </html>
  )
}
