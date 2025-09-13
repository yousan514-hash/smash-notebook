'use client'

import { useEffect } from 'react'
import { initPostHog } from '@/lib/analytics'

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    initPostHog()
  }, [])

  return <>{children}</>
}