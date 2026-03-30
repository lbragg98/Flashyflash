import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

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
          
          {/* Rain streaks */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-blue-300/30 to-transparent pointer-events-none"
              style={{
                height: '100vh',
                left: `${Math.random() * 100}%`,
                animation: `rain-fall ${2 + Math.random() * 1.5}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
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
