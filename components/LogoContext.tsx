'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LogoCtx { logoUrl: string | null; setLogoUrl: (url: string | null) => void }
const LogoContext = createContext<LogoCtx>({ logoUrl: null, setLogoUrl: () => {} })

export function LogoProvider({ children }: { children: ReactNode }) {
  const [logoUrl, setLogoUrlState] = useState<string | null>(null)
  useEffect(() => {
    const saved = localStorage.getItem('brainy-duck-logo')
    if (saved) setLogoUrlState(saved)
  }, [])
  const setLogoUrl = (url: string | null) => {
    if (url) localStorage.setItem('brainy-duck-logo', url)
    else localStorage.removeItem('brainy-duck-logo')
    setLogoUrlState(url)
  }
  return <LogoContext.Provider value={{ logoUrl, setLogoUrl }}>{children}</LogoContext.Provider>
}

export const useLogo = () => useContext(LogoContext)
