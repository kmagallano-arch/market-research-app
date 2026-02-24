'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface LogoCtx { logoUrl: string | null; setLogoUrl: (url: string | null) => void }
const LogoContext = createContext<LogoCtx>({ logoUrl: null, setLogoUrl: () => {} })

export function LogoProvider({ children }: { children: ReactNode }) {
  // No localStorage - always falls back to the file in /public
  const [logoUrl, setLogoUrlState] = useState<string | null>(null)
  const setLogoUrl = (url: string | null) => setLogoUrlState(url)
  return <LogoContext.Provider value={{ logoUrl, setLogoUrl }}>{children}</LogoContext.Provider>
}

export const useLogo = () => useContext(LogoContext)
