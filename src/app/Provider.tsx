'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type * as React from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions:{
      queries:{
        refetchOnWindowFocus:true,
        
      }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}