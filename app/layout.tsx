import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Market Research | US & Philippines',
  description: 'Product market research for US and Philippines',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
