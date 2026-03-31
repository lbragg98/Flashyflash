import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const rainDrops = [
  { left: '6%', top: '-10%', size: 4, duration: '1.8s', delay: '0s', opacity: 0.16 },
  { left: '16%', top: '-16%', size: 5, duration: '2.1s', delay: '0.45s', opacity: 0.2 },
  { left: '28%', top: '-8%', size: 3, duration: '1.9s', delay: '0.85s', opacity: 0.14 },
  { left: '41%', top: '-14%', size: 5, duration: '2.2s', delay: '0.25s', opacity: 0.18 },
  { left: '56%', top: '-10%', size: 4, duration: '2s', delay: '0.65s', opacity: 0.16 },
  { left: '70%', top: '-15%', size: 5, duration: '2.15s', delay: '0.15s', opacity: 0.2 },
  { left: '84%', top: '-12%', size: 4, duration: '1.95s', delay: '0.95s', opacity: 0.16 },
  { left: '94%', top: '-18%', size: 3, duration: '1.85s', delay: '0.5s', opacity: 0.14 },
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
