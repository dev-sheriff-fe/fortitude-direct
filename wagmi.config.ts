// wagmi.config.ts
import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { lineaSepolia, linea, mainnet, baseSepolia,sepolia, monadTestnet } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export function getConfig() {
  return createConfig({
    chains: [lineaSepolia, linea, mainnet, baseSepolia, sepolia, monadTestnet],
    // connectors: [
    //   injected({ target: 'metaMask' }), // This will work with MetaMask
    // ],
    connectors:[
      metaMask({
        infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY!
      })
    ],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [lineaSepolia.id]: http(),
      [linea.id]: http(),
      [mainnet.id]: http(),
      [baseSepolia.id]: http(),
      [sepolia?.id]: http(),
      [monadTestnet?.id]: http()
    },
  });
}