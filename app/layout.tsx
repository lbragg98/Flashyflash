import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const rainDrops = [
  { left: '4%', top: '-10%', size: 4, duration: '1.03s', delay: '0s', opacity: 0.17 },
  { left: '12%', top: '-16%', size: 5, duration: '1.2s', delay: '0.35s', opacity: 0.22 },
  { left: '20%', top: '-8%', size: 3, duration: '1.09s', delay: '0.7s', opacity: 0.15 },
  { left: '28%', top: '-14%', size: 4, duration: '1.17s', delay: '0.2s', opacity: 0.18 },
  { left: '37%', top: '-12%', size: 5, duration: '1.26s', delay: '0.55s', opacity: 0.2 },
  { left: '46%', top: '-18%', size: 4, duration: '1.14s', delay: '0.1s', opacity: 0.17 },
  { left: '55%', top: '-10%', size: 5, duration: '1.23s', delay: '0.45s', opacity: 0.22 },
  { left: '63%', top: '-15%', size: 3, duration: '1.06s', delay: '0.8s', opacity: 0.15 },
  { left: '71%', top: '-9%', size: 4, duration: '1.12s', delay: '0.25s', opacity: 0.18 },
  { left: '79%', top: '-17%', size: 5, duration: '1.29s', delay: '0.6s', opacity: 0.2 },
  { left: '88%', top: '-11%', size: 4, duration: '1.11s', delay: '0.95s', opacity: 0.17 },
  { left: '95%', top: '-19%', size: 3, duration: '1.05s', delay: '0.4s', opacity: 0.15 },
]

export const metadata: Metadata = {
  title: 'FlashHub',
  description: 'Discover. Compare. Flash.',
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
    <html lang="en">
      <body className="font-sans antialiased">
        {/* Storm background environment */}
        <div className="storm-bg-container">
          <div className="storm-sky" />
          <div className="cloud-layer-1 storm-cloud" />
          <div className="cloud-layer-2 storm-cloud" />
          <div className="cloud-layer-3 storm-cloud" />
          <div className="storm-mist" />
          <div className="lightning-flash-bg" />
          <div className="ambient-glow" />

          {/* Slow rain droplets */}
          {rainDrops.map((drop, i) => (
            <div
              key={i}
              className="rain-droplet pointer-events-none absolute rounded-full"
              style={{
                left: drop.left,
                top: drop.top,
                width: `${drop.size}px`,
                height: `${Math.round(drop.size * 1.6)}px`,
                opacity: drop.opacity,
                animationDuration: drop.duration,
                animationDelay: drop.delay,
              }}
            />
          ))}
        </div>

        {/* Content above background */}
        <div className="storm-content">
          {children}
          <Analytics />
        </div>
      </body>
    </html>
  )
}
