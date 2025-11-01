// 'use client'
// import React, { useEffect, useState } from 'react'
// import { WagmiConfig } from 'wagmi'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// interface Props {
//   children: React.ReactNode
//   cookieHeader?: string
// }

// export default function WagmiProvider({ children, cookieHeader }: Props) {
//   const [config, setConfig] = useState<any>(null)
//   const [initialState, setInitialState] = useState<any>(undefined)
//   const [queryClient] = useState(() => new QueryClient({
//     defaultOptions: {
//       queries: {
//         refetchOnWindowFocus: true,
//         staleTime: 5 * 60 * 1000,
//       },
//     },
//   }))

//   useEffect(() => {
//     let mounted = true

//     const initializeWagmi = async () => {
//       try {
//         const wagmiConfigModule = await import('@/wagmi.config');
//         const config = wagmiConfigModule.getConfig();
        
//         if (mounted) {
//           setConfig(config);
          
//           if (cookieHeader) {
//             const { cookieToInitialState } = await import('wagmi/actions');
//             const initialState = cookieToInitialState(config, cookieHeader);
//             setInitialState(initialState);
//           }
//         }
//       } catch (err) {
//         console.error('Failed to initialize wagmi:', err);
//       }
//     };

//     initializeWagmi();

//     return () => { mounted = false };
//   }, [cookieHeader]);

//   if (!config) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   return (
//     <WagmiConfig config={config} initialState={initialState}>
//       <QueryClientProvider client={queryClient}>
//         {children}
//       </QueryClientProvider>
//     </WagmiConfig>
//   );
// }

'use client'
import React, { useEffect, useState } from 'react'
import { WagmiConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface Props {
  children: React.ReactNode
  cookieHeader?: string
}

export default function WagmiProvider({ children, cookieHeader }: Props) {
  const [config, setConfig] = useState<any>(null)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        staleTime: 5 * 60 * 1000,
      },
    },
  }))

  useEffect(() => {
    let mounted = true

    const initializeWagmi = async () => {
      try {
        const wagmiConfigModule = await import('@/wagmi.config');
        const config = wagmiConfigModule.getConfig();
        
        if (mounted) {
          setConfig(config);
        }
      } catch (err) {
        console.error('Failed to initialize wagmi:', err);
      }
    };

    initializeWagmi();

    return () => { mounted = false };
  }, [cookieHeader]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
}