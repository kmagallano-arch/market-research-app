import type { Metadata } from 'next'
import './globals.css'
import { LogoProvider } from '@/components/LogoContext'

export const metadata: Metadata = {
  title: 'Brainy Duck — Market Intelligence',
  description: 'AI-powered e-commerce market research',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <LogoProvider>{children}</LogoProvider>
      </body>
    </html>
  )
}
