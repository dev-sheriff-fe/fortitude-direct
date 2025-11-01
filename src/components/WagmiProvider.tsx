'use client'
import React, { useEffect, useState } from 'react'
import { WagmiConfig, createConfig, http, createStorage, cookieStorage, State } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { metaMask } from 'wagmi/connectors'

interface Props {
  children: React.ReactNode
  initialState?: State
}

export default function WagmiProvider({ children, initialState }: Props) {
  const [config, setConfig] = useState<any>(null)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }))

  useEffect(() => {
    let mounted = true

    // Dynamic import at runtime avoids Next build-time transformation of `export *`
    import('wagmi/chains').then(({ baseSepolia }) => {
      const cfg = createConfig({
        chains: [baseSepolia],
        connectors: [
          metaMask({
            infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY!
          })
        ],
        ssr: true,
        storage: createStorage({
          storage: cookieStorage,
        }),
        transports: {
          [baseSepolia.id]: http(),
        },
      })

      if (mounted) setConfig(cfg)
    }).catch((err) => {
      console.error('Failed to load wagmi/chains dynamically:', err)
    })

    return () => { mounted = false }
  }, [])

  if (!config) {
    // Render nothing or a small loader while config is built
    return null
  }

  return (
    <WagmiProvider config={config} initialState={initialState} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}