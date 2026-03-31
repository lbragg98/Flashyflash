import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const rainDrops = [
  { left: '3%', top: '-8%', size: 3, duration: '0.98s', delay: '0s', opacity: 0.34 },
  { left: '8%', top: '-18%', size: 4, duration: '1.18s', delay: '0.22s', opacity: 0.42 },
  { left: '14%', top: '-11%', size: 3, duration: '1.05s', delay: '0.58s', opacity: 0.32 },
  { left: '19%', top: '-22%', size: 2, duration: '0.92s', delay: '0.1s', opacity: 0.28 },
  { left: '27%', top: '-9%', size: 3, duration: '1.11s', delay: '0.76s', opacity: 0.36 },
  { left: '31%', top: '-16%', size: 4, duration: '1.2s', delay: '0.34s', opacity: 0.4 },
  { left: '39%', top: '-7%', size: 2, duration: '0.96s', delay: '0.64s', opacity: 0.26 },
  { left: '43%', top: '-19%', size: 3, duration: '1.08s', delay: '0.16s', opacity: 0.35 },
  { left: '49%', top: '-13%', size: 4, duration: '1.16s', delay: '0.49s', opacity: 0.4 },
  { left: '56%', top: '-23%', size: 3, duration: '1.02s', delay: '0.27s', opacity: 0.33 },
  { left: '61%', top: '-10%', size: 2, duration: '0.94s', delay: '0.82s', opacity: 0.27 },
  { left: '67%', top: '-17%', size: 4, duration: '1.14s', delay: '0.41s', opacity: 0.41 },
  { left: '72%', top: '-6%', size: 3, duration: '1s', delay: '0.69s', opacity: 0.34 },
  { left: '78%', top: '-20%', size: 2, duration: '0.9s', delay: '0.2s', opacity: 0.25 },
  { left: '83%', top: '-12%', size: 3, duration: '1.09s', delay: '0.55s', opacity: 0.36 },
  { left: '89%', top: '-24%', size: 4, duration: '1.22s', delay: '0.31s', opacity: 0.42 },
  { left: '94%', top: '-9%', size: 3, duration: '1.03s', delay: '0.73s', opacity: 0.33 },
  { left: '98%', top: '-18%', size: 2, duration: '0.93s', delay: '0.12s', opacity: 0.27 },
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
      <body className="storm-shell storm-rain font-sans antialiased">
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
                ['--drop-opacity' as '--drop-opacity']: drop.opacity.toString(),
                ['--fall-duration' as '--fall-duration']: drop.duration,
                ['--fall-delay' as '--fall-delay']: drop.delay,
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
