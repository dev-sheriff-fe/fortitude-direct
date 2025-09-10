'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocationDetection } from '@/hooks/useLocationDetection'

interface LocationProviderProps {
  children: React.ReactNode
  autoDetect?: boolean
  showPermissionPrompt?: boolean
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
  autoDetect = true,
  showPermissionPrompt = false,
}) => {
  const { detectLocation, shouldDetectThisSession, hasLocationPermission } = useLocationDetection()
  const hasAttemptedDetection = useRef(false)
  const [isMounted, setIsMounted] = useState(false)

  // Ensure we're only running on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only run after component is mounted (client-side)
    if (!isMounted) return

    // Only attempt detection once per component mount
    if (hasAttemptedDetection.current) {
      return
    }

    // Don't auto-detect if we shouldn't detect this session
    if (!shouldDetectThisSession) {
      return
    }

    // Don't auto-detect if permission was previously denied in this session
    if (hasLocationPermission === false && !showPermissionPrompt) {
      return
    }

    if (autoDetect) {
      hasAttemptedDetection.current = true
      
      // Add small delay to ensure page is loaded
      const timer = setTimeout(() => {
        detectLocation()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isMounted, autoDetect, detectLocation, shouldDetectThisSession, hasLocationPermission, showPermissionPrompt])

  return <>{children}</>
}
