import type { Metadata } from 'next'
import './globals.css'
import { LogoProvider } from '@/components/LogoContext'

export const metadata: Metadata = {
  title: 'Brainy Duck — Market Intelligence',
  description: 'AI-powered market research for electronics across US, PH, UK, DE, NL, SE, NO',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LogoProvider>
          {children}
        </LogoProvider>
      </body>
    </html>
  )
}
